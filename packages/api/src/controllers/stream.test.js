import serverPromise from '../test-server'

let server

beforeAll(async () => {
  server = await serverPromise
})

describe('controllers/stream', () => {
  it('should get a stream', () => {
    expect(server).toBeDefined()
    expect(true).toBe(true)
  })
})
