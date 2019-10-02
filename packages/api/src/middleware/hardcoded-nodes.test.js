import hardcodedNodes from './hardcoded-nodes'

/**
 * See also the mock implementation of @kubernetes/client-node in __mocks__
 */

describe('kubernetes middleware', () => {
  let middleware
  let req

  const broadcasters = [
    {
      address: 'https://gke-ams-prod-cpu-efde94aa-2k9f.example.com',
      cliAddress: 'http://10.40.0.46:7935',
    },
    {
      address: 'https://gke-ams-prod-cpu-efde94aa-k8lz.example.com',
      cliAddress: 'http://10.40.1.52:7935',
    },
    {
      address: 'https://gke-ams-prod-cpu-efde94aa-5sr7.example.com',
      cliAddress: 'http://10.40.2.67:7935',
    },
  ]

  const orchestrators = [
    {
      address: 'https://gke-ams-prod-cpu-efde94aa-2k9f.example.com',
      cliAddress: 'http://10.40.0.46:7935',
    },
    {
      address: 'https://gke-ams-prod-cpu-efde94aa-k8lz.example.com',
      cliAddress: 'http://10.40.1.52:7935',
    },
    {
      address: 'https://gke-ams-prod-cpu-efde94aa-5sr7.example.com',
      cliAddress: 'http://10.40.2.67:7935',
    },
  ]

  beforeEach(async () => {
    req = {}
    middleware = hardcodedNodes({
      broadcasters: JSON.stringify(broadcasters),
      orchestrators: JSON.stringify(orchestrators),
    })
    await new Promise(resolve => {
      middleware(req, {}, resolve)
    })
  })

  it('should return broadcasters from getBroadcasters()', async () => {
    const response = await req.getBroadcasters()
    expect(response).toEqual(broadcasters)
  })

  it('should return orchestrators from getOrchestrators()', async () => {
    const response = await req.getOrchestrators()
    expect(response).toEqual(orchestrators)
  })

  it('should throw an error with bad JSON', async () => {
    expect(() => {
      hardcodedNodes({
        broadcasters: 'this is not json',
        orchestrators: 'neither is this',
      })
    }).toThrow()
  })
})
