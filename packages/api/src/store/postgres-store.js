import { Pool } from 'pg'
import logger from '../logger'
import { NotFoundError } from './errors'
import { timeout } from '../util'
import { parse as parseUrl, format as stringifyUrl } from 'url'

// Should be configurable, perhaps?
const TABLE_NAME = 'api'
const CONNECT_TIMEOUT = 5000
const DEFAULT_LIMIT = 100

export default class PostgresStore {
  constructor({ postgresUrl }) {
    if (!postgresUrl) {
      throw new Error('no postgres url provided')
    }
    this.ready = (async () => {
      await timeout(CONNECT_TIMEOUT, async () => {
        await ensureDatabase(postgresUrl)
        await ensureTable(postgresUrl)
        this.pool = new Pool({
          connectionString: postgresUrl,
        })
        await this.pool.query('SELECT NOW()')
      })
    })()
  }

  async close() {
    // lol remove this
    await this.pool.end()
  }

  async listKeys(prefix = '', cursor, limit = DEFAULT_LIMIT) {
    const listRes = await this.list(prefix, cursor, limit)
    const keys = listRes.data.map(item => Object.keys(item)[0])
    return [keys, listRes.cursor]
  }

  async list(prefix = '', cursor = null, limit = DEFAULT_LIMIT) {
    let res = null

    if (cursor) {
      res = await this.pool.query(
        `SELECT * FROM ${TABLE_NAME} WHERE id LIKE $1 AND id > $2 ORDER BY id ASC LIMIT $3 `,
        [`${prefix}%`, `${cursor}`, `${limit}`],
      )
    } else {
      res = await this.pool.query(
        `SELECT * FROM ${TABLE_NAME} WHERE id LIKE $1 ORDER BY id ASC LIMIT $2 `,
        [`${prefix}%`, `${limit}`],
      )
    }

    const data = res.rows.map(({id, data}) => ({ [id]: data }) )

    if (data.length < 1) {
      return { data, cursor: null }
    }

    return { data, cursor: res.rows[data.length - 1].id }
  }

  async get(id) {
    const res = await this.pool.query(
      `SELECT data FROM ${TABLE_NAME} WHERE id=$1`,
      [id],
    )

    if (res.rowCount < 1) {
      return null
    }
    return res.rows[0].data
  }

  async create(key, data) {
    try {
      await this.pool.query(
        `INSERT INTO ${TABLE_NAME} VALUES ($1, $2)`, //p
        [key, JSON.stringify(data)], //p
      )
    } catch (e) {
      if (e.message.includes('duplicate key value')) {
        throw new Error(`${data.id} already exists`)
      }
      throw e
    }
    return data
  }

  async replace(key, data) {
    const res = await this.pool.query(
      `UPDATE ${TABLE_NAME} SET data = $1 WHERE id = $2`,
      [JSON.stringify(data), key],
    )

    if (res.rowCount < 1) {
      throw new NotFoundError()
    }
  }

  async delete(id) {
    const res = await this.pool.query(
      `DELETE FROM ${TABLE_NAME} WHERE id = $1`,
      [id],
    )

    if (res.rowCount < 1) {
      throw new NotFoundError()
    }
  }
}

// Auto-create database if it doesn't exist
async function ensureDatabase(postgresUrl) {
  const pool = new Pool({
    connectionString: postgresUrl,
  })
  try {
    await pool.query('SELECT NOW()')
    // If we made it down here, the database exists. Cool.
    pool.end()
    return
  } catch (e) {
    // We only know how to handle one error...
    if (!e.message.includes('does not exist')) {
      throw e
    }
  }
  const parsed = parseUrl(postgresUrl)
  const dbName = parsed.pathname.slice(1)
  parsed.pathname = '/postgres'
  const adminUrl = stringifyUrl(parsed)
  const adminPool = new Pool({
    connectionString: adminUrl,
  })
  await adminPool.query('SELECT NOW()')
  await adminPool.query(`CREATE DATABASE ${dbName}`)
  logger.info(`Created database ${dbName}`)
  pool.end()
  adminPool.end()
  // const adminPool = n
}

// Auto-create table if it doesn't exist
async function ensureTable(postgresUrl) {
  const pool = new Pool({
    connectionString: postgresUrl,
  })
  const res = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM pg_tables
      WHERE  schemaname = 'public'
      AND tablename = '${TABLE_NAME}'
    )
  `)
  const { exists } = res.rows[0]
  if (!exists) {
    await pool.query(`
      CREATE TABLE ${TABLE_NAME}(
        id VARCHAR(128) PRIMARY KEY,
        data JSONB
      )
    `)
    logger.info(`Created table ${TABLE_NAME}`)
  }
  pool.end()
}
