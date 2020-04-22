import { authMiddleware, validatePost } from '../middleware'
import Router from 'express/lib/router'

const app = Router()

app.get('/geolocate', authMiddleware({}), async (req, res, next) => {
  // Sometimes comes in as a string? Normalize.
  let first = req.query.first || true
  let url = new URL(req.url)
  let servers = req.config.ingests || []

  let smallestServer
  let smallestDuration = Infinity

  const promises = servers.map(async server => {
    const start = Date.now()
    const res = await fetch(`https://${server}/api`)
    const duration = Date.now() - start
    if (duration < smallestDuration) {
      smallestDuration = duration
      smallestServer = server
    }
    return {
      server,
      duration,
    }
  })
  let data
  if (first) {
    data = await Promise.race(promises)
  } else {
    data = await Promise.all(promises)
  }
  const ret = {
    chosenServer: smallestServer,
    servers: data,
  }
  return res.json(ret)
})