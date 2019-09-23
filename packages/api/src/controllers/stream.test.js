import serverPromise from '../test-server'
import { get, post, fetch, clearDatabase } from '../test-helpers'
import uuid from 'uuid/v4'

let server

beforeAll(async () => {
  server = await serverPromise
})

afterEach(async () => {
  await clearDatabase(server)
})

describe('controllers/stream', () => {
  it('should create a stream', async () => {
    const res = await post(server, '/stream', {
      name: 'test-stream',
    })
    expect(res.status).toBe(201)
    const stream = await res.json()
    expect(stream.id).toBeDefined()
    expect(stream.kind).toBe('stream')
    expect(stream.name).toBe('test-stream')
    const document = await server.store.get(`stream/${stream.id}`)
    expect(document).toEqual(stream)
  })

  it('should accept empty body for creating a stream', async () => {
    const res = await fetch(server, '/stream', { method: 'POST' })
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
      const res = await get(server, `/stream/${document.id}`)
      const stream = await res.json()
      expect(stream).toEqual(document)
    }
    const res = await get(server, '/stream')
    const streams = await res.json()
    expect(streams.length).toEqual(10)
  })

  describe('webhooks', () => {
    let stream
    let data
    let res

    beforeEach(async () => {
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
        res = await post(server, '/stream/hook', { url })
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
        res = await post(server, '/stream/hook', { url })
        expect(res.status).toBe(status)
      })
    }

    it('should reject missing urls', async () => {
      res = await post(server, '/stream/hook', {})
      expect(res.status).toBe(422)
    })
  })
})
