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
    const resp = await this.backend.list(doc)

    console.log(`what is the responseeee???? ${JSON.stringify(resp)}`)
    await resp
  }

  async remove(doc) {
    await this.backend.delete(doc)
  }

  // delete user-emails/eli@iame.li/abc123
  // create user-emails/eli@livepeer.org/abc123
  // replace user/abc123 with { ... email: "eli@livepeer.org"}
  async update(doc) {
    const { kind, id } = doc
    const properties = getSchema(kind)
    const operations = []
    for (const [fieldName, fieldArray] of Object.entries(properties)) {
      if (fieldArray.unique || fieldArray.index === true) {
        const value = doc[fieldName]
        const existing = await find(kind, fieldName, value)
        if (existing.length > 0) {
          await remove(`${kind}${fieldName}/${value}/${id}`)
        }
        operations.push({
          kind: kind,
          id: doc[fieldName],
          [`${kind}Id`]: id,
        })
      }
    }

    await Promise.all(
      operations.map(([key, value]) => {
        return this.backend.create(value)
      }),
    )

    await replace(doc)
  }

  async find(kind, fieldName, value) {
    const records = await this.list(`${kind}${fieldName}/${value}`)
    console.log(`RECORDSSSSS11: ${JSON.stringify(records)}`)
    console.log(`paramsssss: ${kind}, ${fieldName}, ${value}`)
    if (!records || records.data.length == 0) {
      return null
    }
    const firstRecord = records[0]
    console.log(`first record: ${firstRecord}`)
    const id = firstRecord.split('/')[2]
    const thing = await this.backend.get(`${kind}${fieldName}/${value}/${id}`)
    console.log(`THINGGGG: ${JSON.stringify(thing)}`)
    return thing
  }

  getSchema(kind) {
    console.log(`here is kind: ${kind}`)
    const schemas = schema.components.schemas[kind]
    console.log(`schemasss: ${JSON.stringify(schemas)}`)
    if (!schemas) {
      return null
    }
    return schemas.properties
  }

  async create(doc) {
    const { kind, id } = doc
    const properties = this.getSchema(kind)
    for (const [fieldName, fieldArray] of Object.entries(properties)) {
      if (fieldArray.unique) {
        const value = doc[fieldName]
        const existing = await this.find(kind, fieldName, value)
        if (existing) {
          throw new Error(
            `there is already a ${kind} with ${fieldName}=${value}`,
          )
          // there is already a user with email=eli@iame.li
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
          [`${kind}${fieldName}/${doc[fieldName]}/${id}`, {}],
        )
      }
    }

    await Promise.all(
      operations.map(([key, value]) => {
        return this.backend.what(key, value)
      }),
    )
  }
}
