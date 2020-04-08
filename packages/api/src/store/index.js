import Model from './model'

import LevelStoreBackend from './level-store'
import PostgresStoreBackend from './postgres-store'
import CloudflareStoreBackend from './cloudflare-store'
import CloudflareClusterStoreBackend from './cloudflare-cluster-store'

export const LevelStore = dbPath => {
  var backend = new LevelStoreBackend(dbPath)
  return new Model(backend)
}
export const PostgresStore = dbPath => {
  var backend = new PostgresStoreBackend(dbPath)
  return new Model(backend)
}
export const CloudflareStore = dbPath => {
  var backend = new CloudflareStoreBackend(dbPath)
  return new Model(backend)
}
export const CloudflareClusterStore = opts => {
  const backend = new CloudflareClusterStoreBackend(opts)
  return new Model(backend)
}
