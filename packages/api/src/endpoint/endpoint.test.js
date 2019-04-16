import isoFetch from 'isomorphic-fetch'
import makeApp from '../index'
import uuid from 'uuid/v4'
import fs from 'fs-extra'

describe('Endpoint', function() {
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
