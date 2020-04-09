import schema from '../schema/schema.json'
import { NotFoundError, ForbiddenError, InternalServerError } from './errors'

export default class Model {
  constructor(backend) {
    this.backend = backend
    this.ready = backend.ready
  }

  async get(id, cleanWriteOnly = true) {
    const responses = await this.backend.get(id)
    if (responses && cleanWriteOnly) {
      return this.cleanWriteOnlyResponses(id, responses)
    }
    return responses
  }

  async replace(data) {
    // NOTE: method does not replace objects saved from fields with an index
    if (typeof data !== 'object' || typeof data.id !== 'string') {
      throw new Error(`invalid values: ${JSON.stringify(data)}`)
    }
    const { id, kind } = data
    if (!id || !kind) {
      throw new Error('missing id, kind')
    }

    const key = `${kind}/${id}`
    const record = await this.backend.get(key)

    if (!record) {
      throw new NotFoundError(`key not found: ${JSON.stringify(key)}`)
    }

    return await this.backend.replace(key, data)

    // NOTE: uncomment code below when replacing objects saved from indexes becomes relevant
    // const operations = await this.getOperations(key, data)
    // if (!operations) {
    // return await this.backend.replace(key, data)
    // }

    // await Promise.all(
    //   operations.map(([key, value]) => {
    //     return this.backend.replace(key, value)
    //   }),
    // )
  }

  async list(prefix, cursor, limit, cleanWriteOnly = true) {
    const responses = await this.backend.list(prefix, cursor, limit)

    if (responses.data.length > 0 && cleanWriteOnly) {
      return this.cleanWriteOnlyResponses(prefix, responses)
    }
    return responses
  }

  async listKeys(prefix, cursor, limit) {
    return this.backend.listKeys(prefix, cursor, limit)
  }

  async query(kind, queryObj, cursor, limit, cleanWriteOnly) {
    const [queryKey, ...others] = Object.keys(queryObj)
    if (others.length > 0) {
      throw new Error('you may only query() by one key')
    }
    const queryValue = queryObj[queryKey]
    const prefix = `${kind}+${queryKey}/${queryValue}`

    const [keys] = await this.backend.listKeys(
      prefix,
      cursor,
      limit,
      cleanWriteOnly,
    )

    if (keys.length === 0) {
      throw new NotFoundError(`Not found: ${prefix}`)
    }

    const ids = []
    for (let i = 0; i < keys.length; i++) {
      ids.push(keys[i].split('/').pop())
    }

    return ids
  }

  async deleteKey(key) {
    const record = await this.get(key)
    if (!record) {
      throw new NotFoundError()
    }
    return await this.backend.delete(key)
  }

  async delete(id) {
    const [properties, kind] = this.getSchema(id)
    const doc = await this.get(`${id}`)
    if (!doc) {
      throw new NotFoundError()
    }

    // adding all delete operations that need to happen
    const operations = [id]
    for (const [fieldName, fieldArray] of Object.entries(properties)) {
      const value = doc[fieldName]
      if (fieldArray.unique || fieldArray.index) {
        const [keys] = await this.backend.listKeys(
          `${kind}+${fieldName}/${value}`,
        )
        if (keys.length > 0) {
          operations.concat(keys)
        }
      }
    }

    await Promise.all(
      operations.map(id => {
        return this.backend.delete(id)
      }),
    )
  }

  // before sending object back to user, pipe it through function. Write-only.
  async create(doc) {
    if (typeof doc !== 'object' || typeof doc.id !== 'string') {
      throw new Error(`invalid values: ${JSON.stringify(doc)}`)
    }
    const { id, kind } = doc
    if (!id || !kind || typeof doc.kind !== 'string') {
      throw new Error(`Missing required values: id, kind`)
    }

    const item = await this.get(`${kind}/${id}`)
    if (item) {
      throw new Error(`${id} already exists`)
    }

    const [properties] = this.getSchema(kind)
    if (properties) {
      for (const [fieldName, fieldArray] of Object.entries(properties)) {
        const value = doc[fieldName]
        if (fieldArray.unique && value) {
          const [keys] = await this.backend.listKeys(
            `${kind}+${fieldName}/${value}`,
          )
          if (keys.length > 0) {
            throw new ForbiddenError(
              `there is already a ${kind} with ${fieldName}=${value}`,
            )
          }
        }
      }
    }

    const operations = [[`${kind}/${id}`, doc]]

    if (properties) {
      for (const [fieldName, fieldArray] of Object.entries(properties)) {
        if (fieldArray.index === true) {
          const cleanKind = this.getCleanKind(kind)
          operations.push(
            // ex. user-emails/eli@iame.li/abc123
            [`${cleanKind}+${fieldName}/${doc[fieldName]}/${id}`, {}],
          )
        }
      }
    }

    await Promise.all(
      operations.map(([key, value]) => {
        return this.backend.create(key, value)
      }),
    )
  }

  getSchema(kind) {
    const cleanKind = this.getCleanKind(kind)
    const schemas = schema.components.schemas[cleanKind]
    if (!schemas) {
      return [null, null]
    }
    return [schemas.properties, cleanKind]
  }

  getCleanKind(kind) {
    let cleanKind = kind.charAt(0) === '/' ? kind.substring(1) : kind
    return cleanKind.indexOf('/') > -1
      ? cleanKind.substr(0, cleanKind.indexOf('/'))
      : cleanKind
  }

  cleanWriteOnlyResponses(id, responses) {
    // obfuscate writeOnly fields in objects returned
    const [properties] = this.getSchema(id)
    const writeOnlyFields = {}
    if (properties) {
      for (const [fieldName, fieldArray] of Object.entries(properties)) {
        if (fieldArray.writeOnly) {
          writeOnlyFields[fieldName] = null
        }
      }
    }

    if ('data' in responses) {
      responses.data = responses.data.map(x => ({
        ...x,
        ...writeOnlyFields,
      }))
    } else {
      responses = {
        ...responses,
        ...writeOnlyFields,
      }
    }

    return responses
  }

  close() {
    this.backend.close()
  }
}
