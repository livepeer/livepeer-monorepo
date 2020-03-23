import schema from '../schema/schema.json'
import uuid from 'uuid/v4'

export default class Model {
  constructor(backend) {
    this.backend = backend
  }

  // Get one by id
  async get(id) {
    return await this.backend.get(id)
  }

  async replace(doc) {
    return await this.backend.replace(doc)
  }

  async list(doc) {
    return await this.backend.list(doc)
  }

  async remove(doc) {
    return await this.backend.delete(doc)
  }

  async find(kind, fieldName, value) {
    const records = await this.list(`${kind}${fieldName}/${value}`)
    if (!records || records.data.length == 0) {
      return null
    }
    const firstRecord = records.data[0]
    const thing = await this.backend.get(
      `${kind}${fieldName}/${value}/${firstRecord['id']}`,
    )
    return thing
  }

  getSchema(kind) {
    const cleanKind =
      kind.indexOf('/') > -1 ? kind.substr(0, kind.indexOf('/')) : kind
    const schemas = schema.components.schemas[cleanKind]
    if (!schemas) {
      return null
    }
    return schemas.properties
  }

  async create(doc) {
    const { kind, id } = doc
    const properties = this.getSchema(kind)
    for (const [fieldName, fieldArray] of Object.entries(properties)) {
      const value = doc[fieldName]
      if (fieldArray.unique) {
        const existing = await this.find(kind, fieldName, value)
        if (existing) {
          throw new Error(
            `there is already a ${kind} with ${fieldName}=${value}`,
          )
        }
      }
    }

    // ok, cool, verified uniqueness, now...
    const operations = [[`${kind}/${id}`, doc]]

    for (const [fieldName, fieldArray] of Object.entries(properties)) {
      if (fieldArray.index === true) {
        const id = uuid()
        operations.push(
          // ex. user-emails/eli@iame.li/abc123
          [`${kind}${fieldName}/${doc[fieldName]}/${id}`, { id: id }],
        )
      }
    }

    await Promise.all(
      operations.map(([key, value]) => {
        return this.backend.write(key, value)
      }),
    )
  }
}
