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
    for await (const { key, value } of this.db.createReadStream(filter)) {
      yield { [key]: JSON.parse(value) }
    }
  }

  async listKeys(prefix = '', cursor, limit = DEFAULT_LIMIT) {
    const listRes = await this.list(prefix, cursor, limit)
    const keys = []
    for (let i = 0; i < listRes.data.length; i++) {
      keys.push(Object.keys(listRes.data[i])[0])
    }

    return [keys, listRes.cursor]
  }

  async list(prefix = '', cursor, limit = DEFAULT_LIMIT) {
    const ret = []
    for await (const val of this.listStream(prefix, cursor, limit)) {
      ret.push(val)
    }
    if (ret.length < 1) {
      return { data: ret, cursor: null }
    }
    return { data: ret, cursor: ret[ret.length - 1].id }
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

  async create(key, data) {
    await this.ready
    await this.db.put(key, JSON.stringify(data))
  }

  async replace(key, data) {
    await this.ready
    await this.db.put(key, JSON.stringify(data))
  }

  async delete(id) {
    await this.db.del(id)
  }
}
