import level from 'level'
import fs from 'fs-extra'
export default class LevelStore {
  constructor({ dbPath }) {
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

  async *listStream() {
    await this.ready
    for await (const { value } of this.db.createReadStream()) {
      yield JSON.parse(value)
    }
  }

  async list() {
    const ret = []
    for await (const val of this.listStream()) {
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
