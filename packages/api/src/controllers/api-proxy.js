/**
 * Special controller for forwarding all incoming requests to a geolocated API region
 */

import Router from 'express/lib/router'
import geolocateMiddleware from '../middleware/geolocate'
import fetch from 'isomorphic-fetch'
import path from 'path'

const app = Router()

app.use(geolocateMiddleware({ region: 'api-region' }), async (req, res) => {
  const upstreamUrl = new URL(req.region.chosenServer)
  upstreamUrl.pathname = req.originalUrl
  const upstreamUrlString = upstreamUrl.toString()
  console.log(upstreamUrlString)
  const upstreamHeaders = {
    ...req.headers,
    host: upstreamUrl.hostname,
  }
  delete upstreamHeaders['content-length']
  let body = undefined
  if (req.body) {
    body = JSON.stringify(req.body)
  }
  console.log('doing fetch', {
    method: req.method,
    body,
    headers: upstreamHeaders,
  })
  let upstreamRes
  try {
    upstreamRes = await fetch(upstreamUrl.toString(), {
      method: req.method,
      body: body,
      headers: upstreamHeaders,
    })
  } catch (e) {
    console.log(e)
  }
  console.log('back from fetch')
  res.status(upstreamRes.status)
  if (res.status === 204) {
    return res.end()
  }
  console.log('doing body')
  const resBody = await upstreamRes.json()
  console.log('back from body')
  res.json(resBody)
})

export default app
