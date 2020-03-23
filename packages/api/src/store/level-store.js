import level from 'level'
import fs from 'fs-extra'
import { NotFoundError } from './errors'

// default limit value in level is -1 , ref: https://github.com/Level/level#dbcreatereadstreamoptions
const DEFAULT_LIMIT = -1

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

  async *listStream(prefix = '', cursor, limit = DEFAULT_LIMIT) {
    // I do not know if this is the right way to do this, but...
    // if we want every key that starts with "endpoint/", what we're
    // really asking for is ">= 'endpoint/'" and '< 'endpoint0',
    // which is the character code one after slash? ¯\_(ツ)_/¯
    let filter = {}
    limit = parseInt(limit)
    if (cursor) {
      const lastCode = prefix.charCodeAt(prefix.length - 1)
      const endKey =
        prefix.slice(0, prefix.length - 1) + String.fromCharCode(lastCode + 1)
      filter = {
        gte: `${prefix}${cursor}`,
        lt: endKey,
        limit,
      }
    } else if (prefix !== '') {
      const lastCode = prefix.charCodeAt(prefix.length - 1)
      const endKey =
        prefix.slice(0, prefix.length - 1) + String.fromCharCode(lastCode + 1)
      filter = {
        gte: prefix,
        lt: endKey,
        limit,
      }
    }

    await this.ready
    for await (const { value } of this.db.createReadStream(filter)) {
      yield JSON.parse(value)
    }
  }

  async list(prefix = '', cursor, limit = DEFAULT_LIMIT) {
    const ret = []
    for await (const val of this.listStream(prefix, cursor, limit)) {
      ret.push(val)
    }

    if (ret.length < 1) {
      return { data: ret, cursor: null }
    }
    // return ret
    return { data: ret, cursor: ret[ret.length - 1].id }
  }

  async newGet() {
    await this.ready
    let res
    try {
      res = await this.db.get(key)
    } catch (err) {
      if (err.name === 'NotFoundError') {
        return null
      }
      throw err
    }
    return res
  }

  async get(key) {
    await this.ready
    let res
    try {
      res = await this.db.get(key)
    } catch (err) {
      if (err.name === 'NotFoundError') {
        return null
      }
      throw err
    }
    return JSON.parse(res)
  }

  async write(key, value) {
    if (!key) {
      throw new Error(`invalid value: ${key}`)
    }
    await this.ready
    await this.db.put(key, JSON.stringify(value))
  }

  async create(data) {
    if (typeof data !== 'object' || typeof data.id !== 'string') {
      throw new Error(`invalid values: ${JSON.stringify(data)}`)
    }
    const { id, kind } = data
    if (!id || !kind) {
      throw new Error(`Missing required values: id, kind`)
    }
    await this.ready
    const item = await this.get(`${kind}/${id}`)
    if (item) {
      throw new Error(`${id} already exists`)
    }
    await this.db.put(`${kind}/${id}`, JSON.stringify(data))
  }

  async replace(data) {
    if (typeof data !== 'object' || typeof data.id !== 'string') {
      throw new Error(`invalid values: ${JSON.stringify(data)}`)
    }
    const { id, kind } = data
    if (!id || !kind) {
      throw new Error('missing id, kind')
    }
    await this.ready

    // Make sure it exists first, this throws if not
    const record = await this.db.get(`${kind}/${id}`)
    if (!record) {
      throw new NotFoundError()
    }
    await this.db.put(`${kind}/${id}`, JSON.stringify(data))
  }

  async delete(id) {
    // Make sure it exists first, this throws if not
    const record = await this.db.get(id)
    if (!record) {
      throw new NotFoundError()
    }
    await this.db.del(id)
  }
}
