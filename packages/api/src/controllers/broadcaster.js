import Router from 'express/lib/router'
import fetch from 'isomorphic-fetch'
import { authMiddleware, geolocateMiddleware } from '../middleware'
import { shuffle } from '../util'

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

export const amalgamate = async (req, endpoint) => {
  const { servers } = req.region
  let responses = await Promise.all(
    servers.map(async ({ server }) => {
      const serverRes = await fetch(`http://${server}/api/${endpoint}`, {
        headers: {
          authorization: req.headers.authorization,
        },
      })
      const data = await serverRes.json()
      return data
    }),
  )
  let output
  if (responses.length === 0) {
    responses = [[]]
  } else if (Array.isArray(responses[0])) {
    output = responses.reduce((arr1, arr2) => arr1.concat(arr2), [])
  } else {
    // Object, assume all unique keys
    output = responses.reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {})
  }

  return output
}

export async function getBroadcasterHandler(req, res) {
  let broadcasters
  if (req.region && req.region.servers) {
    broadcasters = await amalgamate(req, 'broadcaster')
  } else {
    broadcasters = await req.getBroadcasters(req)
  }
  const broadcasterData = broadcasters.map(({ address }) => ({ address }))
  return res.json(shuffle(broadcasterData))
}

app.get('/', geolocateMiddleware({}), getBroadcasterHandler)

app.get('/status', authMiddleware({}), async (req, res, next) => {
  const statuses = await getBroadcasterStatuses(req)
  res.json(statuses)
})

export default app
