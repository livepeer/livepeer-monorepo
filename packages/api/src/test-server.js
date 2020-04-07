/**
 * This file is imported from all the integration tests. It boots up a server based on the provided argv.
 */

import argParser from './parse-cli'
import makeApp from './index'
import fs from 'fs-extra'
import uuid from 'uuid/v4'
import path from 'path'
import os from 'os'
import fetch from 'isomorphic-fetch'

const dbPath = path.resolve(os.tmpdir(), 'livepeer', uuid())
const clientId = 'EXPECTED_AUDIENCE'
const trustedDomain = 'livepeer.org'
const jwtAudience = 'livepeer'
const jwtSecret = 'secret'

fs.ensureDirSync(dbPath)

const DEFAULT_PARAMS = ['--storage=level']

const dashes = process.argv.indexOf('--')
let argv
if (process.env.TEST_PARAMS) {
  argv = JSON.parse(process.env.TEST_PARAMS)
} else if (dashes !== -1) {
  argv = process.argv.slice(dashes + 1)
} else {
  argv = DEFAULT_PARAMS
}

const [binary, script] = process.argv
const params = argParser([binary, script, ...argv])

// Secret code used for back-door DB access in test env
const insecureTestToken = uuid()

// Some overrides... we want to run on a random port for parallel reasons
delete params.port
params.dbPath = dbPath
params.clientId = clientId
params.trustedDomain = trustedDomain
params.jwtAudience = jwtAudience
params.jwtSecret = jwtSecret
params.insecureTestToken = insecureTestToken
params.listen = true
let server

console.log(`test run parameters: ${JSON.stringify(params)}`)

export default makeApp(params).then(s => {
  server = s
  // Make an RPC call to the server to have it do this store thing
  const doStore = action => async (...args) => {
    args = args.map(x => (x === undefined ? 'UNDEFINED' : x))
    // console.log(`client: ${action} ${JSON.stringify(args)}`)
    const result = await fetch(
      `http://localhost:${server.port}/${insecureTestToken}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ action, args }),
      },
    )
    if (result.status === 204) {
      return null
    }
    if (result.status !== 200) {
      const text = await result.text()
      const err = new Error(text)
      err.status = result.status
      throw err
    }
    return await result.json()
  }
  return {
    ...params,
    port: server.port,
    store: {
      create: doStore('create'),
      delete: doStore('delete'),
      get: doStore('get'),
      list: doStore('list'),
      replace: doStore('replace'),
      delete: doStore('delete'),
      deleteKey: doStore('deleteKey'),
      close: () => {},
    },
    async close() {
      await server.close()
    },
  }
})

afterAll(() => {
  if (server) {
    server.close()
  }
  fs.removeSync(dbPath)
})
