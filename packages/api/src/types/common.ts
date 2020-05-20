
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
  filter?: (obj: { [key: string]: StoredObject }) => boolean
}

export interface IStoreQueryArgs {
  kind: string,
  query: object,
  cursor?: any,
  limit?: number,
  cleanWriteOnly?: boolean
}

export interface IStoreQueryObjectsArgs {
  kind: string,
  query: object,
  cursor?: any,
  limit?: number,
  cleanWriteOnly?: boolean,
  filter?: (obj: StoredObject) => boolean
}

export interface IStore {
  ready: Promise<void>

  get<T extends StoredObject>(id: string, cleanWriteOnly?: boolean): Promise<T>
  close(): Promise<void>
  replace(data: StoredObject): Promise<void>
  list(args: IStoreListArgs): Promise<{ data: Array<StoredObject>, cursor: string }>
  listKeys(prefix: string, cursor?: string, limit?: number): Promise<[Array<string>, string]>
  query(args: IStoreQueryArgs): Promise<{ data: Promise<Array<string>>, cursor: string }>
  queryObjects(args: IStoreQueryObjectsArgs): Promise<{ data: Array<StoredObject>, cursor: string }>
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
