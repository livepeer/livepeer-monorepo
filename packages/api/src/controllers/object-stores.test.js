import serverPromise from '../test-server'
import { TestClient, clearDatabase } from '../test-helpers'
import uuid from 'uuid/v4'

// includes auth file tests

let server
let store
let postMockStore
let mockUser
let mockAdminUser
let mockNonAdminUser

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
    type: 's3',
    kind: 'objectstores',
  }

  mockUser = {
    email: `mock_user@gmail.com`,
    password: 'z'.repeat(64),
  }

  mockAdminUser = {
    email: 'user_admin@gmail.com',
    password: 'x'.repeat(64),
    admin: true,
  }

  mockNonAdminUser = {
    email: 'user_non_admin@gmail.com',
    password: 'y'.repeat(64),
    admin: false,
  }
})

afterEach(async () => {
  await clearDatabase(server)
})

describe('controllers/object-stores', () => {
  describe('basic CRUD with JWT authorization', () => {
    let client
    let nonAdminToken
    let nonAdminUser
    let adminUser

    beforeEach(async () => {
      client = new TestClient({
        server,
      })
      // setting up admin user and token
      const userRes = await client.post(`/user/`, { ...mockAdminUser })
      adminUser = await userRes.json()

      let tokenRes = await client.post(`/user/token`, { ...mockAdminUser })
      const adminToken = await tokenRes.json()
      client.jwtAuth = `${adminToken['token']}`

      const user = await server.store.get(`user/${adminUser.id}`, false)
      adminUser = { ...user, admin: true }
      await server.store.replace(adminUser)

      // setting up non-admin user
      const nonAdminRes = await client.post(`/user/`, { ...mockNonAdminUser })
      nonAdminUser = await nonAdminRes.json()
      tokenRes = await client.post(`/user/token`, { ...mockNonAdminUser })
      nonAdminToken = await tokenRes.json()
    })

    it('should not get all object stores without admin authorization', async () => {
      client.jwtAuth = ''
      for (let i = 0; i < 10; i += 1) {
        const storeChangeId = JSON.parse(JSON.stringify(store))
        storeChangeId.id = uuid()
        await server.store.create(storeChangeId)
        const res = await client.get(
          `/objectstores/${store.userId}/${store.id}`,
        )
        expect(res.status).toBe(403)
      }
      const res = await client.get(`/objectstores/${store.userId}`)
      expect(res.status).toBe(403)
    })

    it('should throw 403 error if JWT is not verified', async () => {
      client.jwtAuth = 'random_value'
      const storeChangeId = JSON.parse(JSON.stringify(store))
      storeChangeId.id = uuid()
      await server.store.create(storeChangeId)

      let res = await client.get(`/objectstores/${store.userId}/${store.id}`)
      const objStore = await res.json()
      expect(res.status).toBe(403)
      expect(objStore.errors[0]).toBe('jwt malformed')
    })

    it('should get all object stores with admin authorization', async () => {
      store.userId = adminUser.id
      for (let i = 0; i < 4; i += 1) {
        const storeChangeId = JSON.parse(JSON.stringify(store))
        storeChangeId.id = uuid()
        await server.store.create(storeChangeId)
        const res = await client.get(
          `/objectstores/${storeChangeId.userId}/${storeChangeId.id}`,
        )
        expect(res.status).toBe(200)
        const objStore = await res.json()
        expect(objStore.id).toEqual(storeChangeId.id)
      }

      const res = await client.get(`/objectstores/${store.userId}`)
      expect(res.status).toBe(200)
      const objStores = await res.json()
      expect(objStores.length).toEqual(4)

      // making sure credentials are coming back as null
      expect(objStores[0].credentials).toEqual(null)
    })

    it('should get some of the object stores & get a working next Link', async () => {
      store.userId = adminUser.id
      for (let i = 0; i < 13; i += 1) {
        const storeChangeId = JSON.parse(JSON.stringify(store))
        storeChangeId.id = uuid()
        await server.store.create(storeChangeId)
        const res = await client.get(
          `/objectstores/${storeChangeId.userId}/${storeChangeId.id}`,
        )
        expect(res.status).toBe(200)
        const objStore = await res.json()
        expect(objStore.id).toEqual(storeChangeId.id)
      }

      const res = await client.get(`/objectstores/${store.userId}?limit=11`)
      const objStores = await res.json()
      expect(res.headers._headers.link).toBeDefined()
      expect(res.headers._headers.link.length).toBe(1)
      expect(objStores.length).toEqual(11)
    })

    it('should create an object store', async () => {
      postMockStore.userId = adminUser.id
      let res = await client.post('/objectstores', { ...postMockStore })
      expect(res.status).toBe(201)
      const objStore = await res.json()
      expect(objStore.id).toBeDefined()
      expect(objStore.kind).toBe(`objectstores`)
      expect(objStore.path).toBe(postMockStore.path)
      expect(objStore.userId).toBe(adminUser.id)

      const resp = await client.get(
        `/objectstores/${adminUser.id}/${objStore.id}`,
      )
      expect(resp.status).toBe(200)
      const objStoreGet = await resp.json()
      expect(objStore.path).toEqual(objStoreGet.path)
      expect(objStore.userId).toBe(objStoreGet.userId)

      // if same request is made, should return a 201
      res = await client.post('/objectstores', { ...postMockStore })
      expect(res.status).toBe(201)
    })

    it('should not accept empty body for creating an object store', async () => {
      const id = uuid()
      const resp = await client.get(`/objectstores/${adminUser.id}/${id}`)
      expect(resp.status).toBe(404)
    })

    it('should return a 404 if objectStore not found', async () => {
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

    it('should not get all object stores with non-admin user', async () => {
      client.jwtAuth = nonAdminToken['token']
      store.userId = nonAdminUser.id
      for (let i = 0; i < 3; i += 1) {
        const storeChangeId = JSON.parse(JSON.stringify(store))
        storeChangeId.id = uuid()
        await server.store.create(storeChangeId)
        let res = await client.get(
          `/objectstores/${nonAdminUser.id}/${storeChangeId.id}`,
        )
        expect(res.status).toBe(200)

        res = await client.get(`/objectstores/${nonAdminUser.id}`)
        expect(res.status).toBe(403)
      }

      // error if non-admin user tries to get object store that belongs to another user
      store.userId = adminUser.id
      const storeChangeId = JSON.parse(JSON.stringify(store))
      storeChangeId.id = uuid()
      await server.store.create(storeChangeId)
      let res = await client.get(
        `/objectstores/${adminUser.id}/${storeChangeId.id}`,
      )
      expect(res.status).toBe(403)
    })

    it('should not get another users object store with non-admin user', async () => {
      client.jwtAuth = nonAdminToken['token']

      const storeChangeId = JSON.parse(JSON.stringify(store))
      storeChangeId.userId = adminUser.id
      storeChangeId.id = uuid()
      await server.store.create(storeChangeId)

      let res = await client.get(
        `/objectstores/${adminUser.id}/${storeChangeId.id}`,
      )
      expect(res.status).toBe(403)

      res = await client.get(`/objectstores/${nonAdminUser.id}`)
      expect(res.status).toBe(403)
    })
  })

  describe('object stores endpoint with api key', () => {
    let client
    let adminUser
    let nonAdminUser
    const adminApiKey = uuid()
    const nonAdminApiKey = uuid()

    beforeEach(async () => {
      client = new TestClient({
        server,
        apiKey: uuid(),
      })

      const userRes = await client.post(`/user/`, { ...mockAdminUser })
      adminUser = await userRes.json()

      const nonAdminRes = await client.post(`/user/`, { ...mockNonAdminUser })
      nonAdminUser = await nonAdminRes.json()

      await server.store.create({
        id: adminApiKey,
        kind: 'apitoken',
        userId: adminUser.id,
      })

      await server.store.create({
        id: nonAdminApiKey,
        kind: 'apitoken',
        userId: nonAdminUser.id,
      })

      const user = await server.store.get(`user/${adminUser.id}`, false)
      adminUser = { ...user, admin: true }
      await server.store.replace(adminUser)
    })

    it('should not get all object stores with nonadmin token', async () => {
      client.apiKey = nonAdminApiKey
      let res = await client.get(`/objectstores/${adminUser.id}`)
      const objStore = await res.json()
      expect(res.status).toBe(403)
      expect(objStore.errors[0]).toBe('user does not have admin priviledges')
    })

    it('should not get all object stores for another user with admin token and apiKey', async () => {
      client.apiKey = adminApiKey
      const res = await client.get(`/objectstores/${nonAdminUser.id}`)
      const objStore = await res.json()
      expect(res.status).toBe(403)
      expect(objStore.errors[0]).toBe('user does not have admin priviledges')
    })

    it('should throw forbidden error when using random api Key', async () => {
      client.apiKey = 'random_key'
      const res = await client.get(`/objectstores/${nonAdminUser.id}`)
      const objStore = await res.json()
      expect(res.status).toBe(403)
      expect(objStore.errors[0]).toBe(
        `no token object Bearer ${client.apiKey} found`,
      )
    })

    it('should throw 500 internal server error if user does not exist', async () => {
      // create token with no user
      const tokenId = uuid()
      await server.store.create({
        id: tokenId,
        kind: 'apitoken',
        userId: uuid(),
      })
      client.apiKey = tokenId

      const res = await client.get(`/objectstores/${adminUser.id}`)
      const objStore = await res.json()
      expect(res.status).toBe(500)
      expect(objStore.errors[0]).toBe(
        `no user found for token Bearer ${tokenId}`,
      )
    })
  })
})
