import isoFetch from 'isomorphic-fetch'
import makeApp from '../index'
import uuid from 'uuid/v4'
import schema from '../schema'
import Ajv from 'ajv'

export default function ingressTest(params) {
  describe('ingress', function() {
    const ajv = new Ajv()
    const validate = ajv.compile(schema.components.schemas.ingress)

    let server

    const fetch = async (path, args) => {
      const res = await isoFetch(`http://localhost:${server.port}${path}`, args)
      if (res.status === 500) {
        throw new Error(await res.text())
      }
      return res
    }

    beforeEach(async () => {
      server = await makeApp({
        port: 0,
        httpPrefix: '/',
        ...params,
      })
      await server.store.create({
        id: `unrelated/${uuid()}`,
      })
    })

    afterEach(async () => {
      for (const doc of await server.store.list()) {
        await server.store.delete(doc.id)
      }
      await server.close()
    })

    describe('POST', () => {
      const post = body =>
        fetch('/ingress', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        })

      it('should create ingresses', async () => {
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
        for (const field of ['id', 'key']) {
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
          id: `ingress/${uuid()}`,
          key: uuid(),
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

      it('should retrieve ingresss', async () => {
        const res = await get(testObj.id)
        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data).toEqual(testObj)
        expect(validate(data)).toBe(true)
      })

      it('should 404 if not exist', async () => {
        const res = await get(`ingress/${uuid()}`)
        expect(res.status).toBe(404)
        await res.json()
      })
    })

    describe('GET /', () => {
      let testObjs

      beforeEach(async () => {
        testObjs = [...new Array(3)].map(() => ({
          id: `ingress/${uuid()}`,
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

      it('should list streams', async () => {
        const res = await fetch(`/ingress`)
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
          id: `ingress/${uuid()}`,
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
        const dbContents = await server.store.list('ingress/')
        expect(dbContents.length).toEqual(newTestObjs.length)
        expect(dbContents).toEqual(expect.arrayContaining(newTestObjs))
      })

      it("should 404 for streams that don't exist", async () => {
        const fakeId = `ingress/${uuid()}`
        const res = await put(fakeId, {
          ...testObjs[0],
          id: fakeId,
        })
        expect(res.status).toEqual(404)
        await res.json()
      })

      it('should fail on object id mismatch', async () => {
        let res = await put(`ingress/${uuid()}`, testObjs[0])
        expect(res.status).toEqual(409)
        await res.json()
        res = await put(testObjs[0].id, {
          ...testObjs[0],
          id: `ingress/${uuid()}`,
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
          id: `ingress/${uuid()}`,
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

      it('should delete streams', async () => {
        const res = await fetch(`/${testObjs[0].id}`, {
          method: 'DELETE',
        })
        expect(res.status).toEqual(204)
        const text = await res.text()
        expect(text).toEqual('')
        const dbContents = await server.store.list('ingress/')
        expect(dbContents.length).toEqual(testObjs.length - 1)
        expect(dbContents).toEqual(expect.arrayContaining(testObjs.slice(1)))
      })

      it("should 404 for ingresss that don't exist", async () => {
        const res = await fetch(`/ingress/${uuid()}`, {
          method: 'DELETE',
        })
        expect(res.status).toEqual(404)
        await res.json()
      })
    })
  })
}
