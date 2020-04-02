import schema from '../schema/schema.json'
import { NotFoundError, ForbiddenError, InternalServerError } from './errors'

export default class Model {
  constructor(backend) {
    this.backend = backend
  }

  async get(id, cleanWriteOnly = true) {
    const responses = await this.backend.get(id)
    if (responses && cleanWriteOnly) {
      return this.cleanWriteOnlyResponses(id, responses)
    }
    return responses
  }

  async replace(data) {
    // method to be added and editted when necessary
    throw new InternalServerError('replace method not yet supported')

    if (typeof data !== 'object' || typeof data.id !== 'string') {
      throw new Error(`invalid values: ${JSON.stringify(data)}`)
    }
    const { id, kind } = data
    if (!id || !kind) {
      throw new Error('missing id, kind')
    }

    const record = await this.db.get(`${kind}/${id}`)
    if (!record) {
      throw new NotFoundError()
    }
    return await this.backend.replace(doc)
  }

  async list(prefix, cursor, limit, cleanWriteOnly = true) {
    const responses = await this.backend.list(prefix, cursor, limit)

    if (responses.data.length > 0 && cleanWriteOnly) {
      return this.cleanWriteOnlyResponses(prefix, responses)
    }
    return responses
  }

  async getPropertyIds(prefix, cursor, limit, cleanWriteOnly) {
    const responses = await this.list(prefix, cursor, limit, cleanWriteOnly)

    if (responses.data.length === 0) {
      throw new NotFoundError(`Not found: ${prefix}`)
    }

    const ids = []
    for (const res of responses.data) {
      const key = Object.keys(res)

      ids.push(key[0].split('/').pop())
    }

    responses.data = ids
    return responses
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
    if (!properties || properties.length) {
      return await this.backend.delete(id)
    }

    // adding all delete operations that need to happen
    const doc = await this.get(`${id}`)
    if (!doc) {
      throw new NotFoundError()
    }

    const operations = [id]
    for (const [fieldName, fieldArray] of Object.entries(properties)) {
      const value = doc[fieldName]
      if (fieldArray.unique || fieldArray.index) {
        const existing = await this.find(kind, fieldName, value)
        if (existing) {
          for (const item of existing) {
            operations.push(Object.keys(item)[0])
          }
        }
      }
    }

    await Promise.all(
      operations.map(id => {
        return this.backend.delete(id)
      }),
    )
  }

  async find(kind, fieldName, value) {
    const records = await this.list(`${kind}${fieldName}/${value}`)
    if (!records || records.data.length == 0) {
      return null
    }
    return records.data
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
          const existing = await this.find(kind, fieldName, value)
          if (existing) {
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
            [`${cleanKind}${fieldName}/${doc[fieldName]}/${id}`, {}],
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
}
