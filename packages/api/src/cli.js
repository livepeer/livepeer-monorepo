#!/usr/bin/env node

import yargs from 'yargs'
import path from 'path'
import os from 'os'
import makeApp from './index'

const args = yargs
  .usage(
    `
    Livepeer API Node

    Options my also be provided as LP_ prefixed environment variables, e.g. LP_PORT=5000 is the same as --port=5000.`,
  )
  .env('LP_')
  .strict(true)
  .options({
    port: {
      describe: 'port to listen on',
      default: 3004,
      demandOption: true,
      type: 'number',
    },
    'db-path': {
      describe: 'path to LevelDB database',
      default: path.resolve(os.homedir(), '.livepeer', 'api'),
      demandOption: true,
      type: 'string',
    },
    'http-prefix': {
      describe: 'accept requests at this prefix',
      default: '/api',
      demandOption: true,
      type: 'string',
    },
  })
  .help().argv

if (!module.parent) {
  makeApp(args)
}
