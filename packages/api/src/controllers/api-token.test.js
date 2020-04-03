import serverPromise from '../test-server'
import { TestClient, clearDatabase } from '../test-helpers'
import uuid from 'uuid/v4'

let server
let mockUser
let mockAdminUser
let mockNonAdminUser

jest.setTimeout(70000)

beforeAll(async () => {
  server = await serverPromise
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

describe('controllers/apitoken', () => {
  describe('basic CRUD with JWT authorization', () => {
    let client
    let adminUser
    let nonAdminToken
    let nonAdminUser

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

      const nonAdminRes = await client.post(`/user/`, { ...mockNonAdminUser })
      nonAdminUser = await nonAdminRes.json()

      tokenRes = await client.post(`/user/token`, { ...mockNonAdminUser })
      nonAdminToken = await tokenRes.json()
    })

    it('should get all tokens with admin authorization', async () => {
      for (let i = 0; i < 4; i += 1) {
        const u = {
          userId: adminUser.id,
          id: uuid(),
          kind: 'apitoken',
        }
        await server.store.create(u)
        const res = await client.get(`/apitoken/${u.id}`)
        expect(res.status).toBe(200)
        const apiTokenRes = await res.json()
        expect(apiTokenRes.userId).toEqual(adminUser.id)
        expect(apiTokenRes.id).toEqual(u.id)
      }

      const res = await client.get('/apitoken')
      expect(res.status).toBe(200)
      const apiTokens = await res.json()
      expect(apiTokens.length).toEqual(4)
    })

    it('should get some of the users & get a working next Link', async () => {
      for (let i = 0; i < 13; i += 1) {
        const u = {
          userId: adminUser.id,
          id: uuid(),
          kind: 'apitoken',
        }
        await server.store.create(u)
        const res = await client.get(`/apitoken/${u.id}`)
        expect(res.status).toBe(200)
        const apiTokenRes = await res.json()
        expect(apiTokenRes.userId).toEqual(adminUser.id)
        expect(apiTokenRes.id).toEqual(u.id)
      }
      const res = await client.get(`/apitoken?limit=11`)
      const apiTokens = await res.json()
      expect(res.headers._headers.link).toBeDefined()
      expect(res.headers._headers.link.length).toBe(1)
      expect(apiTokens.length).toEqual(11)
    })

    it('should accept empty body for creating an apiToken', async () => {
      const res = await client.post('/apitoken')
      expect(res.status).toBe(201)
    })

    it('should not accept additional properties for creating an apiToken', async () => {
      const res = await client.post('/apitoken', { livepeer: 'livepeer' })
      expect(res.status).toBe(422)
      const apiToken = await res.json()
      expect(apiToken.id).toBeUndefined()
    })

    it('should create an apiToken, delete it, and error when attempting additional detele or replace', async () => {
      const res = await client.post('/apitoken')
      expect(res.status).toBe(201)
      const tokenRes = await res.json()
      expect(tokenRes.id).toBeDefined()

      const resGet = await server.store.get(`apitoken/${tokenRes.id}`)
      expect(resGet.id).toEqual(tokenRes.id)

      // test for creation of index on apitokenuserId object
      const tokenIds = await server.store.getPropertyIds(
        `apitokenuserId/${tokenRes.userId}`,
      )
      expect(tokenIds.length).toEqual(1)
      expect(tokenIds[0]).toEqual(tokenRes.id)

      // test that apiToken is deleted
      await server.store.delete(`apitoken/${tokenRes.id}`)
      const deleted = await server.store.get(`apitoken/${tokenRes.id}`)
      expect(deleted).toBe(null)

      // it should return a NotFound Error when trying to delete a record that doesn't exist
      try {
        await server.store.deleteKey(`apitoken/${tokenRes.id}`)
      } catch (err) {
        expect(err.status).toBe(404)
      }

      // it should return a NotFound Error when trying to delete a record that doesn't exist
      try {
        await server.store.deleteKey(
          `apitokenuserId/${tokenRes.userId}/${tokenIds[0]}`,
        )
      } catch (err) {
        expect(err.status).toBe(404)
      }

      // it should return a 500 Error when trying to use replace method
      try {
        await server.store.replace(tokenRes)
      } catch (err) {
        expect(err.status).toBe(500)
      }
    })

    it('should not get all apiTokens with non-admin user', async () => {
      // setting up non-admin user
      client.jwtAuth = nonAdminToken['token']

      for (let i = 0; i < 3; i += 1) {
        const u = {
          userId: adminUser.id,
          id: uuid(),
          kind: 'apitoken',
        }
        await server.store.create(u)
        const res = await client.get(`/apitoken/${u.id}`)
        expect(res.status).toBe(200)
      }

      let res = await client.get('/apitoken')
      expect(res.status).toBe(403)
    })

    it('should return all user apiTokens that belong to a user', async () => {
      for (let i = 0; i < 4; i += 1) {
        const u = {
          userId: adminUser.id,
          id: uuid(),
          kind: 'apitoken',
        }
        await server.store.create(u)
        const res = await client.get(`/apitoken/${u.id}`)
        expect(res.status).toBe(200)
        const apiTokenRes = await res.json()
        expect(apiTokenRes.userId).toEqual(adminUser.id)
        expect(apiTokenRes.id).toEqual(u.id)
      }

      let res = await client.get('/apitoken')
      expect(res.status).toBe(200)
      let apiTokens = await res.json()
      expect(apiTokens.length).toEqual(4)

      // create apiToken belonging to nonadmin user
      const u = {
        userId: nonAdminUser.id,
        id: uuid(),
        kind: 'apitoken',
      }
      await server.store.create(u)
      res = await client.get(`/apitoken/${u.id}`)
      expect(res.status).toBe(200)

      // should return all apiTokens that belong to admin user
      res = await client.get(`/apitoken/${adminUser.id}/tokens`)
      expect(res.status).toBe(200)
      let tokenRes = await res.json()

      expect(tokenRes.length).toEqual(4)

      // should return all apiTokens that belong to nonAdmin user as admin user
      res = await client.get(`/apitoken/${nonAdminUser.id}/tokens`)
      expect(res.status).toBe(200)
      tokenRes = await res.json()
      expect(tokenRes.length).toEqual(1)

      // should return all apiTokens that belong to nonAdmin user as nonAdmin user
      client.jwtAuth = `${nonAdminToken['token']}`
      res = await client.get(`/apitoken/${nonAdminUser.id}/tokens`)
      expect(res.status).toBe(200)
      tokenRes = await res.json()
      expect(tokenRes.length).toEqual(1)

      // should not return all apiTokens that belong to admin user as nonAdmin user
      res = await client.get(`/apitoken/${adminUser.id}/tokens`)
      expect(res.status).toBe(403)
    })
  })

  describe('user endpoint with api key', () => {
    let client
    const adminApiKey = uuid()
    const nonAdminApiKey = uuid()

    beforeEach(async () => {
      client = new TestClient({
        server,
        apiKey: uuid(),
      })

      const userRes = await client.post(`/user/`, { ...mockAdminUser })
      const adminUser = await userRes.json()

      const nonAdminRes = await client.post(`/user/`, { ...mockNonAdminUser })
      const nonAdminUser = await nonAdminRes.json()

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
    })

    it('should not get all apiTokens', async () => {
      client.apiKey = nonAdminApiKey
      let res = await client.get('/apitoken')
      expect(res.status).toBe(403)

      client.apiKey = adminApiKey
      res = await client.get('/apitoken')
      expect(res.status).toBe(403)
    })
  })
})
