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
    storage: {
      describe: 'storage engine to use',
      default: 'level',
      demandOption: true,
      type: 'string',
      choices: ['level', 'postgres'],
    },
    'db-path': {
      describe: 'path to LevelDB database',
      default: path.resolve(os.homedir(), '.livepeer', 'api'),
      type: 'string',
    },
    'postgres-url': {
      describe: 'url of a postgres database',
      type: 'string',
    },
    'kube-namespace': {
      describe:
        "namespace of the Kubernetes cluster we're in. required for Kubernetes service discovery.",
      type: 'string',
    },
    'kube-broadcaster-service': {
      describe: 'name of the service we should look at for broadcasters.',
      type: 'string',
    },
    'kube-broadcaster-template': {
      describe:
        'template string of the form https://{nodeName}.example.com to give broadcasters external identity.',
      type: 'string',
      default: 'https://{nodeName}.livepeer.live',
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
