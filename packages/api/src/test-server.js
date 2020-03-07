/**
 * This file is imported from all the integration tests. It boots up a server based on the provided argv.
 */

import argParser from './parse-cli'
import makeApp from './index'
import fs from 'fs-extra'
import uuid from 'uuid/v4'
import path from 'path'
import os from 'os'

const dbPath = path.resolve(os.tmpdir(), 'livepeer', uuid())
const clientId = 'EXPECTED_AUDIENCE'
const trustedDomain = 'livepeer.org'

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

// Some overrides... we want to run on a random port for parallel reasons
delete params.port
params.dbPath = dbPath
params.clientId = clientId
params.trustedDomain = trustedDomain
let server

console.log(`test run parameters: ${JSON.stringify(params)}`)

export default makeApp(params).then(s => {
  server = s
  return { ...s, port: 3011 }
})

afterAll(() => {
  if (server) {
    server.close()
  }
  fs.removeSync(dbPath)
})
