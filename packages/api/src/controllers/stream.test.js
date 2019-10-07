import serverPromise from '../test-server'
import { TestClient, clearDatabase } from '../test-helpers'
import uuid from 'uuid/v4'

let server

beforeAll(async () => {
  server = await serverPromise
})

afterEach(async () => {
  await clearDatabase(server)
})

describe('controllers/stream', () => {
  describe('basic CRUD', () => {
    let client

    beforeEach(() => {
      client = new TestClient({
        server,
        apiKey: uuid(),
      })
    })

    it('should create a stream', async () => {
      const res = await client.post('/stream', { name: 'test-stream' })
      expect(res.status).toBe(201)
      const stream = await res.json()
      expect(stream.id).toBeDefined()
      expect(stream.kind).toBe('stream')
      expect(stream.name).toBe('test-stream')
      const document = await server.store.get(`stream/${stream.id}`)
      expect(document).toEqual(stream)
    })

    it('should accept empty body for creating a stream', async () => {
      const res = await client.post('/stream')
      expect(res.status).toBe(201)
      const stream = await res.json()
      expect(stream.id).toBeDefined()
    })

    it('should get all streams', async () => {
      for (let i = 0; i < 10; i += 1) {
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
      console.log('res: ', res)
      const streams = await res.json()
      expect(streams.length).toEqual(10)
    })

    it('should get some of the streams', async () => {
      const ids = []
      for (let i = 0; i < 10; i += 1) {
        const document = {
          id: uuid(),
          kind: 'stream',
        }
        await server.store.create(document)
        const res = await client.get(`/stream/${document.id}`)
        ids.push(document.id)
        const stream = await res.json()
        expect(stream).toEqual(document)
      }
      const res = await client.get(`/stream?cursor=${ids[2]}&limit=5`)
      const streams = await res.json()
      // console.log(streams)
      expect(streams.length).toBeLessThan(6)
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
      stream = {
        id: uuid(),
        kind: 'stream',
        presets: ['P720p30fps16x9', 'P360p30fps4x3', 'P144p30fps16x9'],
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
