const DEFAULT_LIMIT = 100

export default class CloudflareStore {
  constructor({ cloudflareNamespace }) {
    // It's just bound into our namespace, so there's no import or anything
    this.KV = global[cloudflareNamespace]
    if (!this.KV) {
      throw new Error(
        `couldn't find cloudflare kv namespace at global.${cloudflareNamespace}`,
      )
    }
  }

  async listKeys(prefix = '', oldCursor = null, limit = DEFAULT_LIMIT) {
    let { keys, cursor } = await this.KV.list({
      prefix,
      limit,
      cursor: oldCursor,
    })
    keys = keys.map(obj => obj.name)
    return [keys, cursor]
  }

  async list(prefix = '', oldCursor = null, limit = DEFAULT_LIMIT) {
    const [keys, cursor] = await this.listKeys(prefix, oldCursor, limit)
    const data = await Promise.all(keys.map(key => this.get(key)))
    return { data, cursor }
  }

  async get(value) {
    const str = await this.KV.get(value)
    if (!str) {
      return null
    }
    return JSON.parse(str)
  }

  async create(key, data) {
    return await this.KV.put(key, JSON.stringify(data))
  }

  async replace(key, data) {
    return await this.KV.put(key, JSON.stringify(data))
  }

  async delete(id) {
    return await this.KV.delete(id)
  }
}
