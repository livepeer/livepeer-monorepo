import serverPromise from '../test-server'
import { TestClient, clearDatabase } from '../test-helpers'
import uuid from 'uuid/v4'

let server
let mockBroadcaster
jest.setTimeout(70000)

beforeAll(async () => {
  server = await serverPromise

  mockBroadcaster = {
    address: 'https://chi-broadcaster-charmander.livepeer-ac.live',
  }
})

afterEach(async () => {
  await clearDatabase(server)
})

describe('controllersbroadcasters', () => {
  describe('basic CRUD with google auth', () => {
    let client

    beforeEach(() => {
      client = new TestClient({
        server,
        googleAuthorization: 'EXPECTED_TOKEN',
      })
    })

    let user = {
      id: 'mock_sub_broadcaster',
      name: 'User Name',
      email: 'user@livepeer.org',
      domain: 'livepeer.org',
      kind: 'user',
    }

    it('should not get all broadcasters without googleAuthorization', async () => {
      client.googleAuthorization = ''
      await server.store.create(user)
      for (let i = 0; i < 3; i += 1) {
        const b = {
          address: 'https://chi-broadcaster-charmander.livepeer-ac.live',
          id: uuid(),
          kind: 'broadcasters',
        }
        await server.store.create(b)
        const res = await client.get(`/broadcasters/${b.id}`)
        expect(res.status).toBe(401)
      }
      const res = await client.get(`/broadcasters`)
      expect(res.status).toBe(403)
    })

    it('should get all broadcasters with prior user created', async () => {
      for (let i = 0; i < 4; i += 1) {
        const b = {
          address: 'https://chi-broadcaster-charmander.livepeer-ac.live',
          id: uuid(),
          kind: 'broadcasters',
        }
        await server.store.create(b)
        const res = await client.get(`/broadcasters/${b.id}`)
        const broadcaster = await res.json()
        expect(broadcaster).toEqual(b)
      }

      const res = await client.get('/broadcasters')
      expect(res.status).toBe(200)
      const broadcasters = await res.json()
      expect(broadcasters.length).toEqual(4)
    })

    it('should get some of the broadcasters & get a working next Link', async () => {
      for (let i = 0; i < 13; i += 1) {
        const b = {
          address: 'https://chi-broadcaster-charmander.livepeer-ac.live',
          id: uuid(),
          kind: 'broadcasters',
        }
        await server.store.create(b)
        const res = await client.get(`/broadcasters/${b.id}`)
        const broadcaster = await res.json()
        expect(broadcaster).toEqual(b)
      }
      const res = await client.get(`/broadcasters?limit=11`)
      const broadcasters = await res.json()
      expect(res.headers._headers.link).toBeDefined()
      expect(res.headers._headers.link.length).toBe(1)
      expect(broadcasters.length).toEqual(11)
    })

    it('should create a broadcaster', async () => {
      const res = await client.post('/broadcasters', { ...mockBroadcaster })
      expect(res.status).toBe(201)
      const broadcaster = await res.json()
      expect(broadcaster.id).toBeDefined()
      expect(broadcaster.kind).toBe('broadcasters')
      expect(broadcaster.address).toBe(mockBroadcaster.address)
      const resBroadcaster = await server.store.get(
        `broadcasters/${broadcaster.id}`,
      )
      expect(resBroadcaster).toEqual(broadcaster)
    })

    it('should create a broadcaster, delete it, and error when attempting additional detele or replace', async () => {
      const res = await client.post('/broadcasters', {
        ...mockBroadcaster,
      })
      expect(res.status).toBe(201)
      const broadcaster = await res.json()
      expect(broadcaster.id).toBeDefined()

      const resBroadcaster = await server.store.get(
        `broadcasters/${broadcaster.id}`,
      )
      expect(resBroadcaster).toEqual(broadcaster)

      await server.store.delete(`broadcasters/${broadcaster.id}`)
      const deleted = await server.store.get(`broadcasters/${broadcaster.id}`)
      expect(deleted).toBe(null)

      // it should return a NotFound Error when trying to delete a record that doesn't exist
      try {
        await server.store.delete(`broadcasters/${broadcaster.id}`)
      } catch (err) {
        expect(err.status).toBe(404)
      }

      // it should return a NotFound Error when trying to replace a record that doesn't exist
      try {
        await server.store.replace(broadcaster)
      } catch (err) {
        expect(err.status).toBe(404)
      }
    })

    it('should not get all broadcasters with non-admin user', async () => {
      client.googleAuthorization = ''
      user = {
        id: 'mock_sub_broadcaster2',
        name: 'User Name',
        email: 'user@angie.org',
        domain: 'angie.org',
        kind: 'user',
      }
      await server.store.create(user)

      for (let i = 0; i < 3; i += 1) {
        const b = {
          address: 'https://chi-broadcaster-charmander.livepeer-ac.live',
          id: uuid(),
          kind: 'broadcasters',
        }
        await server.store.create(b)
        const res = await client.get(`/broadcasters/${b.id}`)
        expect(res.status).toBe(401)
      }

      let res = await client.get('/broadcasters')
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

    it('should not get all broadcasters', async () => {
      const res = await client.get('/broadcasters')
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

    it('should create a broadcaster, no `token` registered', async () => {
      const res = await client.post('/broadcasters', {
        ...mockBroadcaster,
      })
      expect(res.status).toBe(201)
      const broadcaster = await res.json()
      expect(broadcaster.id).toBeDefined()
      expect(broadcaster.kind).toBe('broadcasters')
      expect(broadcaster.address).toBe(mockBroadcaster.address)
      const resBroadcaster = await server.store.get(
        `broadcasters/${broadcaster.id}`,
      )
      expect(resBroadcaster).toEqual(broadcaster)
    })

    it('should create a broadcaster, `token` registered, no userId', async () => {
      await server.store.create({
        id: client.apiKey,
        kind: 'apitoken',
      })
      let res = await client.post('/broadcasters', {
        ...mockBroadcaster,
      })
      expect(res.status).toBe(201)
      const broadcaster = await res.json()
      expect(broadcaster.id).toBeDefined()
      expect(broadcaster.kind).toBe('broadcasters')
      expect(broadcaster.address).toBe(mockBroadcaster.address)
      const resBroadcaster = await server.store.get(
        `broadcasters/${broadcaster.id}`,
      )
      expect(resBroadcaster).toEqual(broadcaster)

      // if same request is made, should return a 201
      res = await client.post('/broadcasters', {
        ...mockBroadcaster,
      })
      expect(res.status).toBe(201)
    })

    it('should not accept empty body for creating a broadcaster', async () => {
      const res = await client.post('/broadcasters')
      expect(res.status).toBe(422)
    })

    it('should not accept additional properties for creating a broadcaster', async () => {
      const postMockLivepeerbroadcaster = JSON.parse(
        JSON.stringify(mockBroadcaster),
      )
      postMockLivepeerbroadcaster.livepeer = 'livepeer'
      const res = await client.post('/broadcasters', {
        ...postMockLivepeerbroadcaster,
      })
      expect(res.status).toBe(422)
      const broadcaster = await res.json()
      expect(broadcaster.id).toBeUndefined()
    })
  })
})
