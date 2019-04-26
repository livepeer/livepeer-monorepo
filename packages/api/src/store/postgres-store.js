import { Pool } from 'pg'
import logger from '../logger'
import { NotFoundError } from './errors'

// Should be configurable, perhaps?
const TABLE_NAME = 'api'

export default class PostgresStore {
  constructor({ postgresUrl }) {
    if (!postgresUrl) {
      throw new Error('no postgres url provided')
    }
    this.pool = new Pool({
      connectionString: postgresUrl,
    })
    this.ready = (async () => {
      await this.pool.query('SELECT NOW()')
      const res = await this.pool.query(`
        SELECT EXISTS (
          SELECT 1 
          FROM   pg_tables
          WHERE  schemaname = 'public'
          AND    tablename = '${TABLE_NAME}'
        );
      `)
      const { exists } = res.rows[0]
      if (!exists) {
        await this.pool.query(`
          CREATE TABLE ${TABLE_NAME}(
            id VARCHAR(128) PRIMARY KEY,
            data JSONB
          )
        `)
        logger.info(`Created table ${TABLE_NAME}`)
      }
    })()
  }

  async close() {
    // lol remove this
    await this.pool.end()
  }

  async list(prefix = '') {
    const res = await this.pool.query(
      `SELECT data FROM ${TABLE_NAME} WHERE id LIKE $1;`,
      [`${prefix}%`],
    )
    return res.rows.map(({ data }) => data)
  }

  async get(id) {
    const res = await this.pool.query(
      `SELECT data FROM ${TABLE_NAME} WHERE id=$1;`,
      [id],
    )

    if (res.rowCount < 1) {
      throw new NotFoundError()
    }
    return res.rows[0].data
  }

  async create(data) {
    try {
      await this.pool.query(
        `INSERT INTO ${TABLE_NAME} VALUES ($1, $2);`, //p
        [data.id, JSON.stringify(data)], //p
      )
    } catch (e) {
      if (e.message.includes('duplicate key value')) {
        throw new Error(`${data.id} already exists`)
      }
      throw e
    }
    return data
  }

  async replace(data) {
    const res = await this.pool.query(
      `UPDATE ${TABLE_NAME} SET data = $1 WHERE id = $2`,
      [JSON.stringify(data), data.id],
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
