import serverPromise from '../test-server'
import { TestClient, clearDatabase } from '../test-helpers'
import uuid from 'uuid/v4'

let server
let store
let postMockStore
jest.setTimeout(70000)

beforeAll(async () => {
  server = await serverPromise
  postMockStore = {
    type: 's3',
    path: 'us-west-2/my-bucket',
    credentials: 'abc123/abc123',
  }

  store = {
    id: 'mock_store',
    credentials: 'abc123/abc123',
    path: 'us-west-1/my-bucket',
    userId: 'mock_user_store',
    type: 's3',
    kind: 'objectstores',
  }
})

afterEach(async () => {
  await clearDatabase(server)
})

describe('controllers/object-stores', () => {
  describe('basic CRUD with google auth', () => {
    let client

    beforeEach(() => {
      client = new TestClient({
        server,
        googleAuthorization: 'EXPECTED_TOKEN',
      })
    })

    let user = {
      id: 'mock_sub_store',
      name: 'User Name',
      email: 'user@livepeer.org',
      domain: 'livepeer.org',
      kind: 'user',
    }

    it('should not get all object stores without googleAuthorization', async () => {
      client.googleAuthorization = ''
      await server.store.create(user)
      for (let i = 0; i < 10; i += 1) {
        const storeChangeId = JSON.parse(JSON.stringify(store))
        storeChangeId.id = uuid()
        await server.store.create(storeChangeId)
        const res = await client.get(`/objectstores/${store.id}`)
        expect(res.status).toBe(401)
      }

      const res = await client.get('/objectstores')
      expect(res.status).toBe(403)
    })

    it('should get all object stores with prior user created', async () => {
      const storeGoogleAuthMockUser = JSON.parse(JSON.stringify(store))
      storeGoogleAuthMockUser.userId = 'mock_sub'
      for (let i = 0; i < 4; i += 1) {
        const storeChangeId = JSON.parse(
          JSON.stringify(storeGoogleAuthMockUser),
        )
        storeChangeId.id = uuid()
        await server.store.create(storeChangeId)
        const res = await client.get(`/objectstores/${storeChangeId.id}`)
        expect(res.status).toBe(200)
        const objStore = await res.json()
        expect(objStore.id).toEqual(storeChangeId.id)
      }

      const res = await client.get('/objectstores')
      expect(res.status).toBe(200)
      const objStores = await res.json()
      expect(objStores.length).toEqual(4)
      expect(objStores[0].credentials).toEqual(null)
    })

    it('should get some of the object stores & get a working next Link', async () => {
      const storeGoogleAuthMockUser = JSON.parse(JSON.stringify(store))
      storeGoogleAuthMockUser.userId = 'mock_sub'
      for (let i = 0; i < 13; i += 1) {
        const storeChangeId = JSON.parse(
          JSON.stringify(storeGoogleAuthMockUser),
        )
        storeChangeId.id = uuid()
        await server.store.create(storeChangeId)
        const res = await client.get(`/objectstores/${storeChangeId.id}`)
        expect(res.status).toBe(200)
        const objStore = await res.json()
        expect(objStore.id).toEqual(storeChangeId.id)
      }
      const res = await client.get(`/objectstores?limit=11`)
      const objStores = await res.json()
      expect(res.headers._headers.link).toBeDefined()
      expect(res.headers._headers.link.length).toBe(1)
      expect(objStores.length).toEqual(11)
    })

    it('should create an object stores', async () => {
      const res = await client.post('/objectstores', { ...postMockStore })
      expect(res.status).toBe(201)
      const objStore = await res.json()
      expect(objStore.id).toBeDefined()
      expect(objStore.kind).toBe('objectstores')
      expect(objStore.userId).toBe('mock_sub')
      expect(objStore.path).toBe(postMockStore.path)

      const resp = await client.get(`/objectstores/${objStore.id}`)
      const objStoreGet = await resp.json()
      expect(objStore.path).toEqual(objStoreGet.path)
      expect(objStore.userId).toBe(objStoreGet.userId)
    })

    it('should not get all object stores with non-admin user', async () => {
      client.googleAuthorization = ''
      let user = {
        id: 'user_sub',
        name: 'User Name',
        email: 'user@angie.org',
        domain: 'angie.org',
        kind: 'user',
      }
      await server.store.create(user)
      for (let i = 0; i < 3; i += 1) {
        const storeChangeId = JSON.parse(JSON.stringify(store))
        storeChangeId.id = uuid()
        await server.store.create(storeChangeId)
        const res = await client.get(`/objectstores/${storeChangeId.id}`)
        expect(res.status).toBe(401)
      }
      let res = await client.get('/objectstores')
      expect(res.status).toBe(403)
    })
  })

  describe('basic CRUD without valid logged in user', () => {
    let client

    beforeEach(() => {
      client = new TestClient({
        server,
        googleAuthorization: 'nonsense',
      })
    })

    it('should not get all object stores', async () => {
      const res = await client.get('/objectstores')
      expect(res.status).toBe(403)
    })
  })

  describe('basic CRUD with apiKey', () => {
    let client
    beforeEach(async () => {
      client = new TestClient({
        server,
        apiKey: uuid(),
      })
    })

    it('should create an object store, no `token` registered', async () => {
      const res = await client.post('/objectstores', { ...postMockStore })
      expect(res.status).toBe(201)
      const objStore = await res.json()
      expect(objStore.id).toBeDefined()
      expect(objStore.kind).toBe('objectstores')
      expect(objStore.userId).toBeDefined()
      expect(objStore.path).toBe(postMockStore.path)

      const tokenObject = await server.store.get(`apitoken/${client.apiKey}`)
      expect(tokenObject.userId).toBe(objStore.userId)

      const resp = await client.get(`/objectstores/${objStore.id}`)
      expect(resp.status).toBe(200)
      const objStoreGet = await resp.json()
      expect(objStore.path).toEqual(objStoreGet.path)
      expect(objStore.userId).toBe(objStoreGet.userId)
    })

    it('should create an object store, `token` registered, no userId', async () => {
      await server.store.create({
        id: 'token_id',
        kind: 'apitoken',
      })
      let res = await client.post('/objectstores', { ...postMockStore })
      expect(res.status).toBe(201)
      const objStore = await res.json()
      expect(objStore.id).toBeDefined()
      expect(objStore.kind).toBe('objectstores')
      expect(objStore.userId).toBeDefined()
      expect(objStore.path).toBe(postMockStore.path)

      const tokenObject = await server.store.get(`apitoken/${client.apiKey}`)
      expect(tokenObject.userId).toBe(objStore.userId)

      const resp = await client.get(`/objectstores/${objStore.id}`)
      expect(resp.status).toBe(200)
      const objStoreGet = await resp.json()
      expect(objStore.path).toEqual(objStoreGet.path)
      expect(objStore.userId).toBe(objStoreGet.userId)

      // if same request is made, should return a 201
      res = await client.post('/objectstores', { ...postMockStore })
      expect(res.status).toBe(201)
    })

    it('should not accept empty body for creating an object store', async () => {
      const res = await client.post('/objectstores')
      expect(res.status).toBe(422)
    })

    it('should not accept missing property for creating an object store', async () => {
      const postMockStoreMissingProp = JSON.parse(JSON.stringify(postMockStore))
      delete postMockStoreMissingProp['credentials']
      const res = await client.post('/objectstores', {
        ...postMockStoreMissingProp,
      })
      expect(res.status).toBe(422)
      expect(res.statusText).toBe('Unprocessable Entity')
    })

    it('should not accept additional properties for creating an object store', async () => {
      const postMockStoreExtraField = JSON.parse(JSON.stringify(postMockStore))
      postMockStoreExtraField.extraField = 'extra field'
      const res = await client.post('/objectstores', {
        ...postMockStoreExtraField,
      })
      expect(res.status).toBe(422)
      expect(res.statusText).toBe('Unprocessable Entity')
    })

    it('should not accept wrong type of field for creating an object store', async () => {
      const postMockStoreWrongType = JSON.parse(JSON.stringify(postMockStore))
      postMockStoreWrongType.credentials = 123
      const res = await client.post('/objectstores', {
        ...postMockStoreWrongType,
      })
      expect(res.status).toBe(422)
      expect(res.statusText).toBe('Unprocessable Entity')
    })
  })
})
