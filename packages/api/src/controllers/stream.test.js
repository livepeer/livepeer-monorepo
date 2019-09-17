import serverPromise from '../test-server'
import { get, post, clearDatabase } from '../test-helpers'
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
    const stream = await post(server, '/stream', {
      name: 'test-stream',
    })
    expect(stream.id).toBeDefined()
    expect(stream.kind).toBe('stream')
    expect(stream.name).toBe('test-stream')
    const document = await server.store.get(`stream/${stream.id}`)
    expect(document).toEqual(stream)
  })

  it('should get all streams', async () => {
    for (let i = 0; i < 10; i += 1) {
      const document = {
        id: uuid(),
        kind: 'stream',
      }
      await server.store.create(document)
      const stream = await get(server, `/stream/${document.id}`)
      expect(stream).toEqual(document)
    }
    const streams = await get(server, '/stream')
    expect(streams.length).toEqual(10)
  })
})
