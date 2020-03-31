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

describe('controllers/user', () => {
  describe('basic CRUD with JWT authorization', () => {
    let client
    let adminUser

    beforeEach(async () => {
      client = new TestClient({
        server
      })

      // setting up admin user and token
      const userRes = await client.post(`/user/`, { ...mockAdminUser })
      adminUser = await userRes.json()

      let tokenRes = await client.post(`/user/token`, { ...mockAdminUser })
      const adminToken = await tokenRes.json()
      client.jwtAuth = `${adminToken['token']}`
    })

    it('should not get all users without authorization', async () => {
      client.jwtAuth = ''
      let res = await client.get(`/user/${adminUser.id}`)
      expect(res.status).toBe(403)

      res = await client.get(`/user`)
      expect(res.status).toBe(403)
    })

    it('should get all users with admin authorization', async () => {
      for (let i = 0; i < 4; i += 1) {
        const u = {
          email: `user${i}@gmail.com`,
          password: 'mypassword',
          id: uuid(),
          kind: 'user',
        }
        await server.store.create(u)
        const res = await client.get(`/user/${u.id}`)
        expect(res.status).toBe(200)
        const userRes = await res.json()
        expect(userRes.password).toEqual(null)
        expect(userRes.salt).toEqual(null)
        expect(userRes.id).toEqual(u.id)
      }

      const res = await client.get('/user')
      expect(res.status).toBe(200)
      const users = await res.json()
      expect(users.length).toEqual(5)
    })

    it('should get some of the users & get a working next Link', async () => {
      for (let i = 0; i < 13; i += 1) {
        const u = {
          email: `user${i}@gmail.com`,
          password: 'mypassword',
          id: uuid(),
          kind: 'user',
        }
        await server.store.create(u)
        const res = await client.get(`/user/${u.id}`)
        expect(res.status).toBe(200)
        const user = await res.json()
        expect(user.id).toEqual(u.id)
      }
      const res = await client.get(`/user?limit=11`)
      const users = await res.json()
      expect(res.headers._headers.link).toBeDefined()
      expect(res.headers._headers.link.length).toBe(1)
      expect(users.length).toEqual(11)
    })

    it('should create a user without authorization and not allow repeat user creation', async () => {
      client.jwtAuth = ''
      let res = await client.post('/user/', { ...mockUser })
      expect(res.status).toBe(201)
      const user = await res.json()
      expect(user.id).toBeDefined()
      expect(user.kind).toBe('user')
      expect(user.email).toBe(mockUser.email)

      const resUser = await server.store.get(`user/${user.id}`)
      expect(resUser.email).toEqual(user.email)

      // if same request is made, should return a 403
      res = await client.post('/user', {
        ...mockUser,
      })
      expect(res.status).toBe(403)
    })

    it('should not accept empty body for creating a user', async () => {
      const res = await client.post('/user')
      expect(res.status).toBe(422)
    })

    it('should not accept a non-valid email for creating a user', async () => {
      const postMockUser = JSON.parse(JSON.stringify(mockUser))
      postMockUser.email = 'livepeer'
      const res = await client.post('/user', {
        ...postMockUser,
      })
      expect(res.status).toBe(422)
    })

    it('should not accept additional properties for creating a user', async () => {
      const postMockUser = JSON.parse(JSON.stringify(mockUser))
      postMockUser.name = 'livepeer'
      const res = await client.post('/user', {
        ...postMockUser,
      })
      expect(res.status).toBe(422)
      const user = await res.json()
      expect(user.id).toBeUndefined()
    })

    it('should create a user, delete it, and error when attempting additional detele or replace', async () => {
      const res = await client.post('/user', {
        ...mockUser,
      })
      expect(res.status).toBe(201)
      const userRes = await res.json()
      expect(userRes.id).toBeDefined()

      const resGet = await server.store.get(`user/${userRes.id}`)
      expect(resGet.id).toEqual(userRes.id)

      await server.store.delete(`user/${resGet.id}`)
      const deleted = await server.store.get(`user/${resGet.id}`)
      expect(deleted).toBe(null)

      // TO DO: test for deletion of `user-email` object as well
      // it should return a NotFound Error when trying to delete a record that doesn't exist
      try {
        await server.store.deleteKey(`user/${userRes.id}`)
      } catch (err) {
        expect(err.status).toBe(404)
      }

      // it should return a 500 Error when trying to use replace method
      try {
        await server.store.replace(userRes)
      } catch (err) {
        expect(err.status).toBe(500)
      }
    })

    it('should not get all users with non-admin user', async () => {
      // setting up non-admin user
      await client.post(`/user/`, { ...mockNonAdminUser })
      const tokenRes = await client.post(`/user/token`, { ...mockNonAdminUser })
      const nonAdminToken = await tokenRes.json()
      client.jwtAuth = nonAdminToken['token']

      for (let i = 0; i < 3; i += 1) {
        const u = {
          email: `user${i}@gmail.com`,
          password: 'mypassword',
          id: uuid(),
          kind: 'user',
        }
        await server.store.create(u)
        const res = await client.get(`/user/${u.id}`)
        expect(res.status).toBe(403)
      }

      let res = await client.get('/user')
      expect(res.status).toBe(403)
    })

    it('should return a user token', async () => {
      client.jwtAuth = ''

      // response should contain error - no user previously created
      let res = await client.post('/user/token', {
        ...mockUser,
      })
      expect(res.status).toBe(404)
      let tokenRes = await res.json()
      expect(tokenRes.errors[0]).toBe(`Not found: useremail/${mockUser.email}`)

      // create user
      res = await client.post('/user', {
        ...mockUser,
      })
      expect(res.status).toBe(201)

      // token request missing field, should return error
      const postMockUserNoPassword = JSON.parse(JSON.stringify(mockUser))
      postMockUserNoPassword.password = ''
      res = await client.post('/user/token', {
        ...postMockUserNoPassword,
      })
      tokenRes = res.json()
      expect(res.status).toBe(422)

      // token request password less than required length of 64, should return error
      const postMockUserShortPassword = JSON.parse(JSON.stringify(mockUser))
      postMockUserShortPassword.password = 'shortpassword'
      res = await client.post('/user/token', {
        ...postMockUserShortPassword,
      })
      tokenRes = res.json()
      expect(res.status).toBe(422)

      // token request wrong password, should return error
      const postMockUserWrongPassword = JSON.parse(JSON.stringify(mockUser))
      postMockUserWrongPassword.password = ('w').repeat(64)
      res = await client.post('/user/token', {
        ...postMockUserWrongPassword,
      })
      tokenRes = res.json()
      expect(res.status).toBe(403)

      // token request additional properties, should return error
      const postMockUserAdditionalProp = JSON.parse(JSON.stringify(mockUser))
      postMockUserAdditionalProp.livepeer = 'livepeer'
      res = await client.post('/user/token', {
        ...postMockUserAdditionalProp,
      })
      tokenRes = res.json()
      expect(res.status).toBe(422)

      // should not accept empty body for requesting a token
      res = await client.post('/user/token')
      tokenRes = res.json()
      expect(res.status).toBe(422)

      // token should be returned without error
      res = await client.post('/user/token', {
        ...mockUser,
      })

      expect(res.status).toBe(201)
      tokenRes = await res.json()
      expect(tokenRes.id).toBeDefined()
      expect(tokenRes.email).toBe(mockUser.email)
      expect(tokenRes.token).toBeDefined()
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

    it('should not get all users', async () => {
      client.apiKey = nonAdminApiKey
      let res = await client.get('/user')
      expect(res.status).toBe(403)

      client.apiKey = adminApiKey
      res = await client.get('/user')
      expect(res.status).toBe(403)
    })
  })
})
