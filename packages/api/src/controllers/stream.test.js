import uuid from 'uuid/v4'
import { generateStreamKey } from '../util'
import isoFetch from 'isomorphic-fetch'
import makeApp from '../index'
import path from 'path'
import fs from 'fs-extra'

describe('/stream', () => {
  let server
  let dbPath

  const fetch = (path, args) =>
    isoFetch(`http://localhost:${server.port}${path}`, args)

  beforeEach(async () => {
    dbPath = path.resolve(__dirname, '..', 'data', 'test', uuid())
    server = await makeApp({
      port: 0,
      httpPrefix: '/',
      storage: 'postgres',
      postgresUrl: 'postgresql://postgres@localhost/livepeerapi',
    })
    await server.store.create({
      id: `unrelated/${uuid()}`,
    })
  })

  afterEach(async () => {
    await server.close()
    await fs.remove(dbPath)
  })

  describe('POST /stream/hook', () => {
    let endpoint

    const hook = path =>
      fetch('/stream/hook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          url: `rtmp://example.com/${path}`,
        }),
      })

    beforeEach(async () => {
      const id = `${uuid()}`
      const key = await generateStreamKey()
      endpoint = {
        id: `endpoint/${id}`,
        key,
        streamKey: `${id}?key=${key}`,
        outputs: [{ width: 1920, height: 1080, bitrate: 4000, fps: 30 }],
      }
      await server.store.create(endpoint)
    })

    it('should handle valid webhooks', async () => {
      const res = await hook(endpoint.streamKey)
      expect(res.status).toEqual(200)
      const data = await res.json()
      expect(data.manifestId).toEqual(endpoint.id)
      expect(data.outputs).toEqual(endpoint.outputs)
    })

    it('should 403 invalid stream key', async () => {
      const res = await hook(`${endpoint.id.split('/')[1]}?key=wrong`)
      expect(res.status).toEqual(403)
      await res.json()
    })

    it('should 404 unknown id', async () => {
      const res = await hook(`${uuid()}?key=whatever`)
      expect(res.status).toEqual(404)
      await res.json()
    })
  })
})
