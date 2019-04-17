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

  async *list() {
    for await (const { key, value } of this.db.createReadStream()) {
      yield JSON.parse(value)
    }
  }

  async get(id) {
    return JSON.parse(await this.db.get(id))
  }

  async create(id, data) {
    if (typeof id !== 'string' || typeof data !== 'object') {
      throw new Error('invalid values')
    }
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

  async update(id, data) {}

  async delete(id) {}
}
