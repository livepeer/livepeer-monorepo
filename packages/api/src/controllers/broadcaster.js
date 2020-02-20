import Router from 'express/lib/router'
import fetch from 'isomorphic-fetch'
import { authMiddleware } from '../middleware'
import { request } from 'graphql-request'


const app = Router()

export const getBroadcasterStatuses = async req => {
  const broadcasters = await req.getBroadcasters()
  const statuses = {}
  for (const broadcaster of broadcasters) {
    const statusRes = await fetch(`${broadcaster.cliAddress}/status`)
    statuses[broadcaster.address] = await statusRes.json()
  }
  return statuses
}

// Right now this is very deployment-specific
app.get('/', async (req, res, next) => {
  const broadcasters = await req.getBroadcasters(req)

  return res.json(broadcasters.map(({ address }) => ({ address })))
})

app.get('/status', authMiddleware({}), async (req, res, next) => {
  const statuses = await getBroadcasterStatuses(req)
  res.json(statuses)
})

app.get('/addresses', async (req, res, next) => {
  const broadcasters = await req.getBroadcasters(req)
  let ethAddresses = {}
  for (const broadcaster of broadcasters) {
    // Fetch Eth Addresses of all available Broadcasters
    const addrRes = await fetch(`${broadcaster.cliAddress}/ethAddr`)

    let ethAddr
    try {
      ethAddr = addrRes.body._readableState.buffer.head.data
    } catch (e) {
      console.log(`broadcaster/addresses error: ${JSON.stringify(e)}`)
      break
    }

    if (ethAddr) {
      ethAddresses[ethAddr] = {broadcasterAddress: `${broadcaster.address}`, deposit: 0, reserve: 0}
    }
  }

  // Request funds of all available Broadcasters using their Eth Addresses
  const addresses = Object.keys(ethAddresses)
  const graphUrl = 'https://api.thegraph.com/subgraphs/name/livepeer/livepeer-canary'
  const query = `{
    broadcasters(where: {id_in: ${JSON.stringify(addresses)}}) {
      id
      deposit
      reserve
    }
  }`

  request(graphUrl, query)
    .then(broadcasterFunds => {
      const bFunded = broadcasterFunds['broadcasters']
      for (const b of bFunded) {
        if (ethAddresses[b['id']]) {
          ethAddresses[b['id']]['deposit'] = b['deposit']
          ethAddresses[b['id']]['reserve'] = b['reserve']
        }
      }
      res.json(ethAddresses)
    })
    .catch(e => {
      console.error(`Error fetching dataa from GraphQL: ${e}`)
    })
})

export default app
