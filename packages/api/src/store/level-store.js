import level from 'level'
import fs from 'fs-extra'
export default class LevelStore {
  constructor({ dbPath }) {
    if (!dbPath) {
      throw new Error('no database path provided')
    }
    this.ready = (async () => {
      await fs.ensureDir(dbPath)
      await new Promise((resolve, reject) => {
        this.db = level(dbPath, err => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
    })()
  }

  async close() {
    return this.db.close()
  }

  async *listStream(prefix = '') {
    // I do not know if this is the right way to do this, but...
    // if we want every key that starts with "endpoint/", what we're
    // really asking for is ">= 'endpoint/'" and '< 'endpoint0',
    // which is the character code one after slash? ¯\_(ツ)_/¯
    let filter = {}
    if (prefix !== '') {
      const lastCode = prefix.charCodeAt(prefix.length - 1)
      const endKey =
        prefix.slice(0, prefix.length - 1) + String.fromCharCode(lastCode + 1)
      filter = {
        gte: prefix,
        lt: endKey,
      }
    }
    await this.ready
    for await (const { value } of this.db.createReadStream(filter)) {
      yield JSON.parse(value)
    }
  }

  async list(prefix = '') {
    const ret = []
    for await (const val of this.listStream(prefix)) {
      ret.push(val)
    }
    return ret
  }

  async get(id) {
    await this.ready
    return JSON.parse(await this.db.get(id))
  }

  async create(data) {
    if (typeof data !== 'object' || typeof data.id !== 'string') {
      throw new Error(`invalid values: ${JSON.stringify(data)}`)
    }
    const { id } = data
    await this.ready

    try {
      await this.db.get(id)
      throw new Error(`${id} already exists`)
    } catch (err) {
      if (!err.type === 'NotFoundError') {
        throw err
      }
      // Not found - that's great!
    }
    await this.db.put(id, JSON.stringify(data))
  }

  async replace(data) {
    if (typeof data !== 'object' || typeof data.id !== 'string') {
      throw new Error(`invalid values: ${JSON.stringify(data)}`)
    }
    const { id } = data
    await this.ready

    // Make sure it exists first, this throws if not
    await this.db.get(id)
    await this.db.put(id, JSON.stringify(data))
  }

  async delete(id) {
    // Make sure it exists first, this throws if not
    await this.db.get(id)
    await this.db.del(id)
  }
}
