/**
 * This file is imported from all the integration tests. It boots up a server based on the provided argv.
 */

import argParser from './cli'
import makeApp from './index'

const DEFAULT_PARAMS = ['--storage=level']

const dashes = process.argv.indexOf('--')
let argv
if (dashes === -1) {
  argv = DEFAULT_PARAMS
} else {
  argv = process.argv.slice(dashes + 1)
}

const [binary, script] = process.argv
const params = argParser([binary, script, ...argv])

// Some overrides... we want to run on a random port for parallel reasons
delete params.port

let server

console.log(`test run parameters: ${JSON.stringify(params)}`)

export default makeApp(params).then(s => {
  server = s
  return s
})

afterAll(() => {
  server.close()
})
