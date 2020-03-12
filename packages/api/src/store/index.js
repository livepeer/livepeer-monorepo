import Model from "./model"

import LevelStoreBackend from './level-store'
import PostgresStoreBackend from './postgres-store'
import CloudflareStoreBackend from './cloudflare-store'

export const LevelStore = new Model(LevelStoreBackend)
export const PostgresStore = new Model(PostgresStoreBackend)
export const CloudflareSTore = new Model(CloudflareStoreBackend)
