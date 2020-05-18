
import {
  Stream,
  User,
  ApiToken,
} from '../schema/types'

export enum AuthTokenType {
  JWT = 'JWT',
  Bearer = 'Bearer',
}

declare global {
  namespace Express {
    // add custom properties to Request object
    export interface Request {
      config?: any
      store?: IStore
      authTokenType?: AuthTokenType
    }
  }
}

export type StoredObject = Stream | User | ApiToken

export interface IStoreListArgs {
  prefix: string,
  cursor?: any,
  limit?: number,
  cleanWriteOnly?: boolean
}

export interface IStoreQueryArgs {
  kind: string,
  query: object,
  cursor?: any,
  limit?: number,
  cleanWriteOnly?: boolean
}

export interface IStore {
  ready: Promise<void>

  get(id: string, cleanWriteOnly?: boolean): Promise<StoredObject>
  close(): Promise<void>
  replace(data: StoredObject): Promise<void>
  list(args: IStoreListArgs): Promise<{ data: Array<StoredObject>, cursor: any }>
  listKeys(prefix: string, cursor?: any, limit?: number): Promise<[Array<string>, any]>
  query(args: IStoreQueryArgs): Promise<Array<string>>
  deleteKey(key: string): Promise<void>
  delete(id: string): Promise<void>
  create(data: StoredObject): Promise<StoredObject>
}

export interface IStoreBackend {
  close(): Promise<void>
  listKeys(prefix: string, cursor: any, limit: number): Promise<[Array<string>, any]>
  list(prefix: string, cursor: any, limit: number): Promise<{ data: Array<StoredObject>, cursor: any }>
  get(id: string): Promise<StoredObject>
  create(key: string, data: StoredObject): Promise<StoredObject>
  replace(key: string, data: StoredObject): Promise<void>
  delete(id: string): Promise<void>
}
