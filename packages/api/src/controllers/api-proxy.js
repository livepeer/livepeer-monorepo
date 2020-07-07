/**
 * Special controller for forwarding all incoming requests to a geolocated API region
 */

import Router from 'express/lib/router'
import geolocateMiddleware from '../middleware/geolocate'
import fetch from 'isomorphic-fetch'
import qs from 'qs'

const app = Router()

app.use(geolocateMiddleware({ region: 'api-region' }), async (req, res) => {
  const upstreamUrl = new URL(req.region.chosenServer)
  upstreamUrl.pathname = req.originalUrl
  if (req.query) {
    upstreamUrl.search = `?${qs.stringify(req.query)}`
  }
  const upstreamHeaders = {
    ...req.headers,
    host: upstreamUrl.hostname,
  }
  // This can change slightly...
  delete upstreamHeaders['content-length']
  const params = {
    method: req.method,
    headers: upstreamHeaders,
  }
  // Oddly, req.body seems present even during GET and HEAD, so double-check
  if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
    params.body = JSON.stringify(req.body)
  }
  const upstreamRes = await fetch(upstreamUrl.toString(), params)
  res.status(upstreamRes.status)
  if (res.status === 204) {
    return res.end()
  }
  const resBody = await upstreamRes.json()
  res.json(resBody)
})

export default app
