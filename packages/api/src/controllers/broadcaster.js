import { Router } from 'express'
import fetch from 'isomorphic-fetch'
import { authMiddleware } from '../middleware'

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

export default app
