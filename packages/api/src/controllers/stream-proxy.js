// Slight variation - this one lives at the /stream endpoint, rather than the
// /api/* that everything else lives at. This makes it follow the naming
// conventions on the broadcasters themselves.

import { Router } from 'express'
import { getBroadcasterStatuses } from './broadcaster'
import fetch from 'isomorphic-fetch'
import composeM3U8 from './compose-m3u8'

const app = Router()

const TS = '.ts'
const M3U8 = '.m3u8'

app.get('/:streamId.m3u8', async (req, res) => {
  await req.store.get(`stream/${req.params.streamId}`)
  res.sendStatus(503)
})

// Endpoint for renditions
app.get('/:streamId/:rendition.m3u8', async (req, res) => {
  const { streamId, rendition } = req.params
  // Fires 404 if we can't find it
  await req.store.get(`stream/${streamId}`)
  let file = `${streamId}/${rendition}.m3u8`
  const broadcasters = await req.getBroadcasters()
  const urls = broadcasters.map(({ address }) => `${address}/stream/${file}`)
  const mergedM3U8 = await composeM3U8(urls)
  if (mergedM3U8 === null) {
    res.sendStatus(404)
  }
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.header('Content-Type', 'application/x-mpegurl')
  res.end(mergedM3U8)
})

export default app
