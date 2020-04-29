
import {
  LevelStore,
  PostgresStore,
  CloudflareStore,
  CloudflareClusterStore,
  FirestoreStore,
} from '../store'

import {
  IStore
} from '../types/common'

export function createStore(params: any): IStore {
  let store
  const {
    storage,
    dbPath,
    postgresUrl,
    cloudflareNamespace,
    cloudflareAccount,
    cloudflareAuth,
    firestoreCredentials,
    firestoreCollection,
  } = params

  if (storage === 'level') {
    store = LevelStore({ dbPath })
  } else if (storage === 'postgres') {
    store = PostgresStore({ postgresUrl })
  } else if (storage === 'cloudflare') {
    store = CloudflareStore({
      cloudflareNamespace,
      cloudflareAccount,
      cloudflareAuth,
    })
  } else if (storage === 'cloudflare-cluster') {
    store = CloudflareClusterStore({
      cloudflareNamespace,
    })
  } else if (storage === 'firestore') {
    store = FirestoreStore({ firestoreCredentials, firestoreCollection })
  } else {
    throw new Error('Missing storage information')
  }
  return store
}
