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
  const ethAddresses = {}
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
      ethAddresses[broadcaster.address] = `${ethAddr}`
    }
  }

  // Request funds of all available Broadcasters using their Eth Addresses
  const addresses = Object.keys(ethAddresses)
  const graphUrl = 'https://api.thegraph.com/subgraphs/name/livepeer/livepeer'
  const query = `{
    broadcasters(where: {id_in: ["${addresses}"]}) {
      balance
    }
  }`

  request(graphUrl, query)
    // TO DO: once GraphQL supports this query, parse through data, add to ethAddresses object (renamed),
    // and return in res.json. Perhaps also refactor this bit into another function. Confirmed: request works, though errs.
    .then(broadcasterFunds => console.log(`broadcaster wallet funds: ${JSON.stringify(broadcasterFunds)}`))
    .catch(e => {
      console.error(`Error fetching data from GraphQL: ${e}`)
    })

  res.json(ethAddresses)
})

export default app
