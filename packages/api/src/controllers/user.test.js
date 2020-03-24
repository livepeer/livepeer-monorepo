import serverPromise from '../test-server'
import { TestClient, clearDatabase } from '../test-helpers'
import uuid from 'uuid/v4'

let server
let mockUser
jest.setTimeout(70000)

beforeAll(async () => {
  server = await serverPromise
  mockUser = {
    email: 'user@gmail.com',
    password: 'x'.repeat(63),
  }
})

afterEach(async () => {
  await clearDatabase(server)
})

describe('controllersuser', () => {
  describe('basic CRUD with google auth', () => {
    let client

    beforeEach(() => {
      client = new TestClient({
        server,
        googleAuthorization: 'EXPECTED_TOKEN',
      })
    })

    let user = {
      id: 'mock_sub_user',
      email: 'user@livepeer.org',
      domain: 'livepeer.org',
      kind: 'user',
    }

    it('should not get all users without googleAuthorization', async () => {
      client.googleAuthorization = ''
      await server.store.create(user)
      const u = {
        email: 'user@gmail.com',
        password: 'mypassword',
        id: uuid(),
        kind: 'user',
      }
      await server.store.create(u)
      let res = await client.get(`/user/${u.id}`)
      expect(res.status).toBe(401)
      res = await client.get(`/user`)
      expect(res.status).toBe(403)
    })

    it('should get all users with googleAuthorization', async () => {
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
        const user = await res.json()
        expect(user.id).toEqual(u.id)
      }
      const res = await client.get(`/user?limit=11`)
      const users = await res.json()
      expect(res.headers._headers.link).toBeDefined()
      expect(res.headers._headers.link.length).toBe(1)
      expect(users.length).toEqual(11)
    })

    it('should create a user', async () => {
      const res = await client.post('/user', { ...mockUser })
      expect(res.status).toBe(201)
      const user = await res.json()
      expect(user.id).toBeDefined()
      expect(user.kind).toBe('user')
      expect(user.email).toBe(mockUser.email)
      const resUser = await server.store.get(`user/${user.id}`)
      expect(resUser.email).toEqual(user.email)
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
        await server.store.delete(`user/${user.id}`)
      } catch (err) {
        expect(err.status).toBe(404)
      }

      // it should return a NotFound Error when trying to replace a record that doesn't exist
      try {
        await server.store.replace(user)
      } catch (err) {
        expect(err.status).toBe(404)
      }
    })

    it('should not get all users with non-admin user', async () => {
      client.googleAuthorization = ''
      user = {
        id: 'mock_sub_user2',
        name: 'User Name',
        email: 'user@angie.org',
        domain: 'angie.org',
        kind: 'user',
      }
      await server.store.create(user)

      for (let i = 0; i < 3; i += 1) {
        const u = {
          email: `user${i}@gmail.com`,
          password: 'mypassword',
          id: uuid(),
          kind: 'user',
        }
        await server.store.create(u)
        const res = await client.get(`/user/${u.id}`)
        expect(res.status).toBe(401)
      }

      let res = await client.get('/user')
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

    it('should not get all users', async () => {
      const res = await client.get('/user')
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

    it('should create a user, no `token` registered', async () => {
      const res = await client.post('/user', {
        ...mockUser,
      })
      expect(res.status).toBe(201)
      const user = await res.json()
      expect(user.id).toBeDefined()
      expect(user.kind).toBe('user')
      expect(user.email).toBe(mockUser.email)
      const resUser = await server.store.get(`user/${user.id}`)
      expect(resUser.id).toEqual(user.id)
    })

    it('should create a user, `token` registered, no userId', async () => {
      await server.store.create({
        id: client.apiKey,
        kind: 'apitoken',
      })
      let res = await client.post('/user', {
        ...mockUser,
      })
      expect(res.status).toBe(201)
      const user = await res.json()
      expect(user.id).toBeDefined()
      expect(user.kind).toBe('user')
      expect(user.email).toBe(mockUser.email)
      const resUser = await server.store.get(`user/${user.id}`)
      expect(resUser.id).toEqual(user.id)

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
  })

  describe('basic CRUD /token endpoint with apiKey', () => {
    let client
    beforeEach(async () => {
      client = new TestClient({
        server,
        apiKey: uuid(),
      })
    })

    it('should return an token, no `authtoken` previously created', async () => {
      // response should contain error - no user previously created
      let res = await client.post('/user/token', {
        ...mockUser,
      })
      expect(res.status).toBe(404)
      let tokenRes = await res.json()
      expect(tokenRes.error).toBe(`user ${mockUser.email} not found`)

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
      expect(res.status).toBe(422)

      tokenRes = await res.json()

      // token request wrong password, should return error
      const postMockUserWrongPassword = JSON.parse(JSON.stringify(mockUser))
      postMockUserWrongPassword.password = 'wrongpassword'
      res = await client.post('/user/token', {
        ...postMockUserWrongPassword,
      })
      expect(res.status).toBe(422)

      // token request additional properties, should return error
      const postMockUserAdditionalProp = JSON.parse(JSON.stringify(mockUser))
      postMockUserAdditionalProp.livepeer = 'livepeer'
      res = await client.post('/user/token', {
        ...postMockUserAdditionalProp,
      })
      expect(res.status).toBe(422)

      // should not accept empty body for requesting a token
      res = await client.post('/user/token')
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
})
