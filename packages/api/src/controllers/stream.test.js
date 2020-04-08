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
    admin: true,
  }

  mockNonAdminUser = {
    email: 'user_non_admin@gmail.com',
    password: 'y'.repeat(64),
    admin: false,
  }

  store = {
    id: 'mock_store',
    credentials: 'abc123/abc123',
    path: 'us-west-1/my-bucket',
    userId: mockAdminUser.id,
    type: 's3',
    kind: 'objectstores',
  }
})

afterEach(async () => {
  await clearDatabase(server)
})

describe('controllers/stream', () => {
  describe('basic CRUD with JWT authorization', () => {
    let client

    beforeEach(async () => {
      client = new TestClient({
        server,
      })
      // setting up admin user and token
      const userRes = await client.post(`/user/`, { ...mockAdminUser })

      let tokenRes = await client.post(`/user/token`, { ...mockAdminUser })
      const adminToken = await tokenRes.json()
      client.jwtAuth = `${adminToken['token']}`
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
        expect(err.status).toBe(500)
      }
    })

    it('should not get all streams with non-admin user', async () => {
      // setting up non-admin user
      await client.post(`/user/`, { ...mockNonAdminUser })
      const tokenRes = await client.post(`/user/token`, { ...mockNonAdminUser })
      const nonAdminToken = await tokenRes.json()
      client.jwtAuth = nonAdminToken['token']

      for (let i = 0; i < 3; i += 1) {
        const document = {
          id: uuid(),
          kind: 'stream',
        }
        await server.store.create(document)
        const res = await client.get(`/stream/${document.id}`)
        expect(res.status).toBe(200)
      }

      let res = await client.get('/stream')
      expect(res.status).toBe(403)
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

  describe('object stores endpoint with api key', () => {
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

    it('should not get all object stores', async () => {
      client.apiKey = nonAdminApiKey
      let res = await client.get(`/stream`)
      expect(res.status).toBe(403)

      client.apiKey = adminApiKey
      res = await client.get(`/stream`)
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
