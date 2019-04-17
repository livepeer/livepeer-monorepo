import isoFetch from 'isomorphic-fetch'
import makeApp from '../index'
import uuid from 'uuid/v4'
import fs from 'fs-extra'
import schema from './schema.json'
import Ajv from 'ajv'

describe('Endpoint', function() {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  let server
  let dataDir

  const fetch = (path, args) =>
    isoFetch(`http://localhost:${server.port}${path}`, args)

  beforeEach(async () => {
    dataDir = uuid()
    server = await makeApp({ port: 0, store: dataDir })
  })

  afterEach(async () => {
    await server.close()
    await fs.remove(dataDir)
  })

  describe('POST', () => {
    const post = body =>
      fetch('/endpoints', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      })

    it('should create endpoints', async () => {
      const outputs = [
        {
          width: 1920,
          height: 1080,
          fps: 30,
          bitrate: 6000,
        },
      ]
      const res = await post({
        outputs,
      })
      expect(res.status).toEqual(201)
      const data = await res.json()
      expect(typeof data.id).toEqual('string')
      expect(typeof data.streamKey).toEqual('string')
      expect(data.outputs).toEqual(outputs)
      const obj = await server.store.get(data.id)
      expect(obj).toEqual(data)
    })

    it('should reject if no outputs', async () => {
      const res = await post({})
      expect(res.status).toEqual(422)
    })

    it('should reject nonsense', async () => {
      const res = await post({ 'this is nonsense': 'yes it is', outputs: [] })
      expect(res.status).toEqual(422)
    })

    it('should reject server-generated fields', async () => {
      for (const field of ['id', 'streamKey']) {
        const res = await post({
          [field]: 'not allowed',
          outputs: [],
        })
        expect(res.status).toEqual(422)
      }
    })
  })

  describe('GET /:id', () => {
    const get = id => fetch(`/endpoints/${id}`)
    let testObj
    beforeEach(async () => {
      testObj = {
        id: uuid(),
        streamKey: uuid(),
        outputs: [
          {
            width: 1920,
            height: 1080,
            fps: 30,
            bitrate: 6000,
          },
        ],
      }
      await server.store.create(testObj.id, testObj)
    })

    it('should retrieve endpoints', async () => {
      const res = await get(testObj.id)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual(testObj)
      expect(validate(data)).toBe(true)
    })

    it('should 404 if not exist', async () => {
      const res = await get(uuid())
      expect(res.status).toBe(404)
      await res.json()
    })
  })

  describe('GET /:id', () => {
    const get = id => fetch(`/endpoints/${id}`)
    let testObj
    beforeEach(async () => {
      testObj = {
        id: uuid(),
        streamKey: uuid(),
        outputs: [
          {
            width: 1920,
            height: 1080,
            fps: 30,
            bitrate: 6000,
          },
        ],
      }
      await server.store.create(testObj.id, testObj)
    })

    it('should retrieve endpoints', async () => {
      const res = await get(testObj.id)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual(testObj)
      expect(validate(data)).toBe(true)
    })

    it('should 404 if not exist', async () => {
      const res = await get(uuid())
      expect(res.status).toBe(404)
      await res.json()
    })
  })

  describe('GET /', () => {
    let testObjs

    beforeEach(() => {
      testObjs = [...new Array(3)].map(() => ({
        id: uuid(),
        streamKey: uuid(),
        outputs: [
          {
            width: 1920,
            height: 1080,
            fps: 30,
            bitrate: 6000,
          },
        ],
      }))
    })

    it('should list streams', async () => {
      for (const obj of testObjs) {
        await server.store.create(obj.id, obj)
      }
      const res = await fetch(`/endpoints`)
      expect(res.status).toEqual(200)
      const data = await res.json()
      expect(data.length).toEqual(testObjs.length)
      expect(data).toEqual(expect.arrayContaining(testObjs))
    })
  })
})
