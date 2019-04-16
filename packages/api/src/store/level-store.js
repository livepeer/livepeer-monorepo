import level from 'level'

export default class LevelStore {
  constructor({ dataDir }) {
    this.ready = new Promise((resolve, reject) => {
      this.db = level(dataDir, err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  async close() {
    return this.db.close()
  }

  async list(prefix) {}

  async get(id) {}

  async create(id, data) {
    if (typeof id !== 'string' || typeof data !== 'object') {
      throw new Error('invalid values')
    }
    await this.ready
    try {
      await this.db.get(id)
      throw new Error('already exists')
    } catch (e) {
      if (err.type !== 'NotFoundError') {
        throw e
      }
      // Not found - that's great!
    }
    await db.put(id, data)
  }

  async update(id, data) {}

  async delete(id) {}
}
