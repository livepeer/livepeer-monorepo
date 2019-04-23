import isoFetch from 'isomorphic-fetch'
import makeApp from '../index'
import uuid from 'uuid/v4'
import fs from 'fs-extra'
import schema from './schema.json'
import Ajv from 'ajv'
import path from 'path'

describe('Endpoint', function() {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  let server
  let dbPath

  const fetch = (path, args) =>
    isoFetch(`http://localhost:${server.port}${path}`, args)

  beforeEach(async () => {
    dbPath = path.resolve(__dirname, '..', 'data', 'test', uuid())
    server = await makeApp({ port: 0, dbPath, httpPrefix: '/' })
    await server.store.create({
      id: `unrelated/${uuid()}`,
    })
  })

  afterEach(async () => {
    await server.close()
    await fs.remove(dbPath)
  })

  describe('POST', () => {
    const post = body =>
      fetch('/endpoint', {
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
    const get = id => fetch(`/${id}`)
    let testObj
    beforeEach(async () => {
      testObj = {
        id: `endpoint/${uuid()}`,
        key: uuid(),
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
      await server.store.create(testObj)
    })

    it('should retrieve endpoints', async () => {
      const res = await get(testObj.id)
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toEqual(testObj)
      expect(validate(data)).toBe(true)
    })

    it('should 404 if not exist', async () => {
      const res = await get(`endpoint/${uuid()}`)
      expect(res.status).toBe(404)
      await res.json()
    })
  })

  describe('GET /', () => {
    let testObjs

    beforeEach(async () => {
      testObjs = [...new Array(3)].map(() => ({
        id: `endpoint/${uuid()}`,
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
      for (const obj of testObjs) {
        await server.store.create(obj)
      }
    })

    it('should list streams', async () => {
      const res = await fetch(`/endpoint`)
      expect(res.status).toEqual(200)
      const data = await res.json()
      expect(data.length).toEqual(testObjs.length)
      expect(data).toEqual(expect.arrayContaining(testObjs))
    })
  })

  describe('PUT /:id', () => {
    let testObjs

    const put = (id, body) =>
      fetch(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
        },
      })

    beforeEach(async () => {
      testObjs = [...new Array(3)].map(() => ({
        id: `endpoint/${uuid()}`,
        streamKey: uuid(),
        key: uuid(),
        outputs: [
          {
            width: 1920,
            height: 1080,
            fps: 30,
            bitrate: 6000,
          },
        ],
      }))
      for (const obj of testObjs) {
        await server.store.create(obj)
      }
    })

    it('should replace streams', async () => {
      const newObj = {
        ...testObjs[0],
        outputs: [
          ...testObjs[0].outputs,
          {
            width: 1280,
            height: 720,
            fps: 30,
            bitrate: 3000,
          },
        ],
      }
      const res = await put(newObj.id, newObj)
      expect(res.status).toEqual(200)
      const data = await res.json()
      expect(data).toEqual(newObj)
      const newTestObjs = [newObj, ...testObjs.slice(1)]
      const dbContents = await server.store.list('endpoint/')
      expect(dbContents.length).toEqual(newTestObjs.length)
      expect(dbContents).toEqual(expect.arrayContaining(newTestObjs))
    })

    it("should 404 for streams that don't exist", async () => {
      const fakeId = `endpoint/${uuid()}`
      const res = await put(fakeId, {
        ...testObjs[0],
        id: fakeId,
      })
      expect(res.status).toEqual(404)
      await res.json()
    })

    it('should fail on object id mismatch', async () => {
      let res = await put(`endpoint/${uuid()}`, testObjs[0])
      expect(res.status).toEqual(409)
      await res.json()
      res = await put(testObjs[0].id, {
        ...testObjs[0],
        id: `endpoint/${uuid()}`,
      })
      expect(res.status).toEqual(409)
      await res.json()
    })
    it('should enforce the schema', async () => {
      const res = await put(testObjs[0].id, {
        ...testObjs[0],
        extraField: 'nonsense data',
      })
      expect(res.status).toEqual(422)
      await res.json()
    })
  })

  describe('DELETE /:id', () => {
    let testObjs

    beforeEach(async () => {
      testObjs = [...new Array(3)].map(() => ({
        id: `endpoint/${uuid()}`,
        key: uuid(),
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
      for (const obj of testObjs) {
        await server.store.create(obj)
      }
    })

    it('should delete streams', async () => {
      const res = await fetch(`/${testObjs[0].id}`, {
        method: 'DELETE',
      })
      expect(res.status).toEqual(204)
      const text = await res.text()
      expect(text).toEqual('')
      const dbContents = await server.store.list('endpoint/')
      expect(dbContents.length).toEqual(testObjs.length - 1)
      expect(dbContents).toEqual(expect.arrayContaining(testObjs.slice(1)))
    })

    it("should 404 for endpoints that don't exist", async () => {
      const res = await fetch(`/endpoint/${uuid()}`, {
        method: 'DELETE',
      })
      expect(res.status).toEqual(404)
      await res.json()
    })
  })
})
