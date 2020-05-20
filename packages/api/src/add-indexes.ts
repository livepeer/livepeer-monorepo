
/*
  Adds index for `userId` field for existing stream objects
*/

import yargs from 'yargs'
import path from 'path'
import os from 'os'
import {
  createStore
} from './app/store'
import {
  IStore
} from './types/common'


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
      .options({
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


async function addIndex(kind: string, fieldName: string, store: IStore) {
  console.log('adding userId index to stream objects:')
  let data, cursor = null, limit = 1
  while (true) {
    ({ data, cursor } = await store.list({
      prefix: 'stream/',
      cursor,
      limit,
      cleanWriteOnly: false
    }))
    console.log(`got: cursor: ${cursor}`, data)
    if (!cursor || !data.length) {
      break
    }
    data = data.map(o => o[Object.keys(o)[0]])
    for (let obj of data) {
      const key = `${kind}+${fieldName}/${obj[fieldName]}/${obj['id']}`
      console.log(`key: ${key}`)
      try {
        await store.backend.create(key, {})
      } catch (e) {
        console.log(e)
      }
    }
  }
}

async function main() {
  require('dotenv').config()
  const params = parseCli()
  const store = createStore(params)
  await store.ready

  await addIndex('stream', 'userId', store)
  await store.close()
}

main()
