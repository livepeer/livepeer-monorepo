import path from 'path'
import fs from 'fs-extra'
import endpointTest from './endpoint/endpoint.test-helper'
import uuid from 'uuid/v4'

describe('leveldb store', () => {
  const dbPath = path.resolve(__dirname, '..', 'data', 'test', uuid())

  beforeEach(async () => {
    await fs.ensureDir(dbPath)
  })

  afterEach(async () => {
    await fs.remove(dbPath)
  })

  endpointTest({
    storage: 'level',
    dbPath,
  })
})

describe('postgres store', () => {
  endpointTest({
    storage: 'postgres',
    postgresUrl: 'postgresql://postgres@localhost/livepeerapi',
  })
})
