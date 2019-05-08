import path from 'path'
import fs from 'fs-extra'
import ingressTest from './ingress/ingress.test-helper'
import uuid from 'uuid/v4'

describe('leveldb store', () => {
  const dbPath = path.resolve(__dirname, '..', 'data', 'test', uuid())

  beforeEach(async () => {
    await fs.ensureDir(dbPath)
  })

  afterEach(async () => {
    await fs.remove(dbPath)
  })

  ingressTest({
    storage: 'level',
    dbPath,
  })
})

describe('postgres store', () => {
  ingressTest({
    storage: 'postgres',
    postgresUrl: 'postgresql://postgres@localhost/livepeerapi',
  })
})
