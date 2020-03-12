import schema from "../schema/schema.json"

export default class Model {
  constructor(backend) {
    this.backend = backend;
  }

  // Get one by id
  async get(id) {

  }

  async find(kind, search)

  // {email: "eli@livepeer.org"}
  async update(doc) {
    // delete user-emails/eli@iame.li/abc123
    // create user-emails/eli@livepeer.org/abc123
    // replace user/abc123 with { ... email: "eli@livepeer.org"}
  }

  async create(doc) {
    const {kind, id} = doc;
    const schema = getSchema(kind);
    const properties = schema.components.schemas[kind];
    for (const [propName, prop] of Object.entries(properties)) {
      if (field.unique) {
        const fieldName = field.name;
        const value = doc[fieldName]
        const existing = await this.find(kind, {[fieldName]: value})
        if (existing.length > 0) { 
          throw new Error(`there is already a ${kind} with ${fieldName}=${value}`)
          // there is already a user with email=eli@iame.li
        }
      }
    }

    // ok, cool, verified uniqueness, now...
    const operations = [
      [`${kind}/${id}`, doc]
    ];
    
    for (const field of schema) {
      const fieldName = field.name;
      const value = doc[fieldName]
      if (schema[field].index === true) {
        operations.push(
          // ex. user-emails/eli@iame.li/abc123
          [`user-${field}/${doc[fieldName]}/${id}`, {}]
        )
      }
    }
  
    await Promise.all(operations.map(([key, value]) => {
      return this.backend.write(key, value);
    }));
  }
}