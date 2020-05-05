
import makeApp from './app/stream-info/stream-info-app'
import yargs from 'yargs'
import path from 'path'
import os from 'os'

function parseCli() {
  return (
    yargs
      .usage(
        `
    Livepeer Stream Info fetcher

    Options my also be provided as LP_ prefixed environment variables, e.g. LP_PORT=5000 is the same as --port=5000.

    `,
      )
      .env('LP_')
      //.strict(true)
      .options({
        port: {
          describe: 'port to listen on',
          default: 3010,
          demandOption: true,
          type: 'number',
        },
        host: {
          describe:
            'host to bind to',
          type: 'string',
          default: 'localhost',
        },
        broadcaster: {
          describe:
            'broadcaster host:port to fetch info from',
          type: 'string',
          default: 'localhost:7935',
        },
        storage: {
          describe: 'storage engine to use',
          default: 'level',
          demandOption: true,
          type: 'string',
          choices: [
            'level',
            'postgres',
            'cloudflare',
            'cloudflare-cluster',
            'firestore',
          ],
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
        'cloudflare-namespace': {
          describe: 'namespace of a cloudflare database',
          type: 'string',
        },
        'cloudflare-account': {
          describe: 'account id of a cloudflare database',
          type: 'string',
        },
        'cloudflare-auth': {
          describe: 'auth of a cloudflare database',
          type: 'string',
        },
        'firestore-credentials': {
          describe:
            'JSON string of service account credentials for a GCP account',
          type: 'string',
        },
        'firestore-collection': {
          describe:
            'name of the top-level firestore collection for storing our data',
          type: 'string',
        },
      })
      .help()
      .parse()
  )
}


function main() {
  require('dotenv').config()
  makeApp(parseCli())
}

main()
