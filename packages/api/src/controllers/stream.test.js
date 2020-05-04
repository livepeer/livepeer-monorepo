import serverPromise from '../test-server'
import { TestClient, clearDatabase } from '../test-helpers'
import uuid from 'uuid/v4'

let server
let store
let mockUser
let mockAdminUser
let mockNonAdminUser
let postMockStream
// jest.setTimeout(70000)

beforeAll(async () => {
  server = await serverPromise
  postMockStream = require('./wowza-hydrate.test-data.json').stream
  delete postMockStream.id
  delete postMockStream.kind
  postMockStream.presets = ['P360p30fps16x9', 'P144p30fps16x9']
  postMockStream.renditions = {
    bbb_360p:
      '/stream/305b9fa7-c6b3-4690-8b2e-5652a2556524/P360p30fps16x9.m3u8',
    thesource_bbb: '/stream/305b9fa7-c6b3-4690-8b2e-5652a2556524/source.m3u8',
    random_prefix_bbb_160p:
      '/stream/305b9fa7-c6b3-4690-8b2e-5652a2556524/P144p30fps16x9.m3u8',
  }
  postMockStream.objectStoreId = 'mock_store_stream'
  postMockStream.wowza.streamNameGroups = [
    {
      name: 'bbb_all',
      renditions: ['thesource_bbb', 'bbb_360p', 'random_prefix_bbb_160p'],
    },
    {
      name: 'bbb_mobile',
      renditions: ['random_prefix_bbb_160p'],
    },
  ]

  mockUser = {
    email: `mock_user@gmail.com`,
    password: 'z'.repeat(64),
  }

  mockAdminUser = {
    email: 'user_admin@gmail.com',
    password: 'x'.repeat(64),
  }

  mockNonAdminUser = {
    email: 'user_non_admin@gmail.com',
    password: 'y'.repeat(64),
  }

  store = {
    id: 'mock_store',
    credentials: 'abc123/abc123',
    path: 'us-west-1/my-bucket',
    userId: mockAdminUser.id,
    type: 's3',
    kind: 'object-store',
  }
})

afterEach(async () => {
  await clearDatabase(server)
})

async function setupUsers(server) {
  const client = new TestClient({
    server,
  })
  // setting up admin user and token
  const userRes = await client.post(`/user/`, { ...mockAdminUser })
  let adminUser = await userRes.json()

  let tokenRes = await client.post(`/user/token`, { ...mockAdminUser })
  const adminToken = await tokenRes.json()
  client.jwtAuth = `${adminToken['token']}`

  const user = await server.store.get(`user/${adminUser.id}`, false)
  adminUser = { ...user, admin: true, emailValid: true }
  await server.store.replace(adminUser)

  const resNonAdmin = await client.post(`/user/`, { ...mockNonAdminUser })
  let nonAdminUser = await resNonAdmin.json()

  tokenRes = await client.post(`/user/token`, { ...mockNonAdminUser })
  const nonAdminToken = await tokenRes.json()

  const nonAdminUserRes = await server.store.get(
    `user/${nonAdminUser.id}`,
    false,
  )
  nonAdminUser = { ...nonAdminUserRes, emailValid: true }
  await server.store.replace(nonAdminUser)
  return { client, adminUser, adminToken, nonAdminUser, nonAdminToken }
}

describe('controllers/stream', () => {
  describe('basic CRUD with JWT authorization', () => {
    let client, adminUser, adminToken, nonAdminUser, nonAdminToken

    beforeEach(async () => {
      ({ client, adminUser, adminToken, nonAdminUser, nonAdminToken } = await setupUsers(server))
    })

    it('should not get all streams without admin authorization', async () => {
      client.jwtAuth = ''
      for (let i = 0; i < 10; i += 1) {
        const document = {
          id: uuid(),
          kind: 'stream',
        }
        await server.store.create(document)
        const res = await client.get(`/stream/${document.id}`)
        expect(res.status).toBe(403)
      }
      const res = await client.get('/stream')
      expect(res.status).toBe(403)
    })

    it('should get all streams with admin authorization', async () => {
      for (let i = 0; i < 4; i += 1) {
        const document = {
          id: uuid(),
          kind: 'stream',
        }
        await server.store.create(document)
        const res = await client.get(`/stream/${document.id}`)
        const stream = await res.json()
        expect(stream).toEqual(document)
      }

      const res = await client.get('/stream')
      expect(res.status).toBe(200)
      const streams = await res.json()
      expect(streams.length).toEqual(4)
    })

    it('should get some of the streams & get a working next Link', async () => {
      for (let i = 0; i < 13; i += 1) {
        const document = {
          id: uuid(),
          kind: 'stream',
        }
        await server.store.create(document)
        const res = await client.get(`/stream/${document.id}`)
        const stream = await res.json()
        expect(stream).toEqual(document)
      }
      const res = await client.get(`/stream?limit=11`)
      const streams = await res.json()
      expect(res.headers._headers.link).toBeDefined()
      expect(res.headers._headers.link.length).toBe(1)
      expect(streams.length).toEqual(11)
    })

    it('should create a stream', async () => {
      const res = await client.post('/stream', { ...postMockStream })
      expect(res.status).toBe(201)
      const stream = await res.json()
      expect(stream.id).toBeDefined()
      expect(stream.kind).toBe('stream')
      expect(stream.name).toBe('test_stream')
      const document = await server.store.get(`stream/${stream.id}`)
      expect(document).toEqual(stream)
    })

    it('should create a stream, delete it, and error when attempting additional detele or replace', async () => {
      const res = await client.post('/stream', { ...postMockStream })
      expect(res.status).toBe(201)
      const stream = await res.json()
      expect(stream.id).toBeDefined()

      const document = await server.store.get(`stream/${stream.id}`)
      expect(document).toEqual(stream)

      await server.store.delete(`stream/${stream.id}`)
      const deleted = await server.store.get(`stream/${stream.id}`)
      expect(deleted).toBe(null)

      // it should return a NotFound Error when trying to delete a record that doesn't exist
      try {
        await server.store.delete(`stream/${stream.id}`)
      } catch (err) {
        expect(err.status).toBe(404)
      }

      // it should return a NotFound Error when trying to replace a record that doesn't exist
      try {
        await server.store.replace(document)
      } catch (err) {
        expect(err.status).toBe(404)
      }
    })

    it('should get only own streams with non-admin user', async () => {
      for (let i = 0; i < 5; i += 1) {
        const document = {
          id: uuid(),
          kind: 'stream',
          userId: i < 3 ? nonAdminUser.id : undefined,
        }
        await server.store.create(document)
        const res = await client.get(`/stream/${document.id}`)
        expect(res.status).toBe(200)
      }
      client.jwtAuth = nonAdminToken['token']

      const res = await client.get('/stream')
      expect(res.status).toBe(200)
      const streams = await res.json()
      expect(streams.length).toEqual(3)
      expect(streams[0].userId).toEqual(nonAdminUser.id)
    })

    it('should not accept empty body for creating a stream', async () => {
      const res = await client.post('/stream')
      expect(res.status).toBe(422)
    })

    it('should not accept additional properties for creating a stream', async () => {
      const postMockLivepeerStream = JSON.parse(JSON.stringify(postMockStream))
      postMockLivepeerStream.livepeer = 'livepeer'
      const res = await client.post('/stream', { ...postMockLivepeerStream })
      expect(res.status).toBe(422)
      const stream = await res.json()
      expect(stream.id).toBeUndefined()
    })
  })

  describe('stream endpoint with api key', () => {
    let client, adminUser, adminToken, nonAdminUser, nonAdminToken
    const adminApiKey = uuid()
    const nonAdminApiKey = uuid()

    beforeEach(async () => {
      ({ client, adminUser, adminToken, nonAdminUser, nonAdminToken } = await setupUsers(server))

      await server.store.create({
        id: adminApiKey,
        kind: 'api-token',
        userId: adminUser.id,
      })

      await server.store.create({
        id: nonAdminApiKey,
        kind: 'api-token',
        userId: nonAdminUser.id,
      })

      for (let i = 0; i < 5; i += 1) {
        const document = {
          id: uuid(),
          kind: 'stream',
          userId: i < 3 ? nonAdminUser.id : undefined,
        }
        await server.store.create(document)
        const res = await client.get(`/stream/${document.id}`)
        expect(res.status).toBe(200)
      }
      client.jwtAuth = ''
    })

    it('should get own streams', async () => {
      client.apiKey = nonAdminApiKey
      let res = await client.get(`/stream`)
      expect(res.status).toBe(200)
      const streams = await res.json()
      expect(streams.length).toEqual(3)
      expect(streams[0].userId).toEqual(nonAdminUser.id)
    })

    it('should not get all streams for admin user', async () => {
      client.apiKey = adminApiKey
      client.jwtAuth = null
      const res = await client.get(`/stream`)
      expect(res.status).toBe(403)
    })
  })

  describe('webhooks', () => {
    let stream
    let data
    let res
    let client

    beforeEach(async () => {
      client = new TestClient({
        server,
      })
      await server.store.create(store)
      stream = {
        id: uuid(),
        kind: 'stream',
        presets: ['P720p30fps16x9', 'P360p30fps4x3', 'P144p30fps16x9'],
        objectStoreId: store.id,
      }
      await server.store.create(stream)
    })

    const happyCases = [
      `rtmp://56.13.68.32/live/STREAM_ID`,
      `http://localhost/live/STREAM_ID/12354.ts`,
      `https://example.com/live/STREAM_ID/0.ts`,
      `/live/STREAM_ID/99912938429430820984294083.ts`,
    ]

    for (let url of happyCases) {
      it(`should succeed for ${url}`, async () => {
        url = url.replace('STREAM_ID', stream.id)
        res = await client.post('/stream/hook', { url })
        data = await res.json()
        expect(data.presets).toEqual(stream.presets)
      })
    }

    const sadCases = [
      [422, `rtmp://localhost/live/foo/bar/extra`],
      [422, `http://localhost/live/foo/bar/extra/13984.ts`],
      [422, 'nonsense://localhost/live'],
      [401, `https://localhost/live`],
      [404, `https://localhost/notlive/STREAM_ID/1324.ts`],
      [404, `rtmp://localhost/notlive/STREAM_ID`],
      [404, `rtmp://localhost/live/nonexists`],
      [404, `https://localhost/live/notexists/1324.ts`],
    ]

    for (let [status, url] of sadCases) {
      it(`should return ${status} for ${url}`, async () => {
        url = url.replace('STREAM_ID', stream.id)
        res = await client.post('/stream/hook', { url })
        expect(res.status).toBe(status)
      })
    }

    it('should reject missing urls', async () => {
      res = await client.post('/stream/hook', {})
      expect(res.status).toBe(422)
    })
  })
})
