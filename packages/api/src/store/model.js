import schema from '../schema/schema.json'
import { NotFoundError , ForbiddenError } from './errors'

export default class Model {
  constructor(backend) {
    this.backend = backend
  }

  // Get one by id
  async get(id) {
    return await this.backend.get(id)
  }

  async replace(doc) {
    // TO-DO (angie): need to update this
    return await this.backend.replace(doc)
  }

  async list(prefix, cursor, limit) {
    return await this.backend.list(prefix, cursor, limit)
  }

  async deleteDb(doc) {
    return await this.backend.delete(doc)
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
          operations.push(`${kind}${fieldName}/${value}/${existing['id']}`)
        }
      }
    }

    await Promise.all(
      operations.map((id) => {
        return this.backend.delete(id)
      })
    )
  }

  async find(kind, fieldName, value) {
    const records = await this.list(`${kind}${fieldName}/${value}`)
    if (!records || records.data.length == 0) {
      return null
    }
    return await this.backend.get(
      `${kind}${fieldName}/${value}/${records.data[0]['id']}`,
    )
  }

  cleanKind(kind) {
    let cleanKind = kind.charAt(0) === '/' ? kind.substring(1) : kind
    return cleanKind.indexOf('/') > -1 ? cleanKind.substr(0, cleanKind.indexOf('/')) : cleanKind
  }

  getSchema(kind) {
    const cleanKind = this.cleanKind(kind)
    const schemas = schema.components.schemas[cleanKind]
    if (!schemas) {
      return [null, null]
    }
    return [schemas.properties, cleanKind]
  }

  async create(doc) {
    if (typeof doc !== 'object' || typeof doc.id !== 'string') {
      throw new Error(`invalid values: ${JSON.stringify(doc)}`)
    }
    const { id, kind } = doc
    if (!id || !kind || typeof doc.kind !== 'string') {
      throw new Error(`Missing required values: id, kind`)
    }
    // TO-DO (angie): figure out how to remove kindish here
    const [properties, kindish] = this.getSchema(kind)
    if (properties) {
      for (const [fieldName, fieldArray] of Object.entries(properties)) {
        const value = doc[fieldName]
        if (fieldArray.unique && value) {
          const existing = await this.find(kind, fieldName, value)
          if (existing) {
            throw new ForbiddenError(`there is already a ${kind} with ${fieldName}=${value}`)
          }
        }
      }
    }

    // ok, cool, verified uniqueness, now...
    const operations = [[`${kind}/${id}`, doc]]

    if (properties) {
      for (const [fieldName, fieldArray] of Object.entries(properties)) {
        if (fieldArray.index === true) {
          // TO-DO (angie): once we remove objectStores userId, this should not be necessary
          const cleanKind = this.cleanKind(kind)
          operations.push(
            // ex. user-emails/eli@iame.li/abc123
            [
              `${cleanKind}${fieldName}/${doc[fieldName]}/${id}`,
              {
                id: id,
                [fieldName]: doc[fieldName],
                kind: `${cleanKind}${fieldName}/${doc[fieldName]}`,
              },
            ],
          )
        }
      }
    }

    await Promise.all(
      operations.map(([key, value]) => {
        return this.backend.write(key, value)
      }),
    )
  }
}
