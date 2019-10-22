// Slight variation - this one lives at the /stream endpoint, rather than the
// /api/* that everything else lives at. This makes it follow the naming
// conventions on the broadcasters themselves.

import { Router } from 'express'
import { getBroadcasterStatuses } from './broadcaster'
import fetch from 'isomorphic-fetch'
import { Parser } from 'm3u8-parser'
import { basename } from 'path'

const app = Router()

const TS = '.ts'
const M3U8 = '.m3u8'

app.get('/:streamId.m3u8', async (req, res) => {
  await req.store.get(`stream/${req.params.streamId}`)
  res.sendStatus(503)
})

// Endpoint for renditions
app.get('/:streamId/:rendition.m3u8', async (req, res) => {
  // Fires 404 if we can't find it
  const { streamId, rendition } = req.params
  await req.store.get(`stream/${streamId}`)
  let file = `${streamId}/${rendition}.m3u8`
  const broadcasters = await req.getBroadcasters()
  const responses = await Promise.all(
    broadcasters.map(async ({ address }) => {
      const url = `${address}/stream/${file}`
      const res = await fetch(url)
      const text = await res.text()
      return [res, address, text]
    }),
  )
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.header('Content-Type', 'application/x-mpegurl')
  const pertinentBroadcasters = responses.filter(([response]) => {
    return response.status === 200
  })
  if (pertinentBroadcasters.length === 0) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  let header = []
  let haveHeader = false
  let min = Infinity
  let max = -1
  const segments = []
  for (const [response, address, text] of pertinentBroadcasters) {
    const parser = new Parser()
    parser.push(text)
    parser.end()
    for (const segment of parser.manifest.segments) {
      const seq = parseInt(basename(segment.uri, '.ts'))
      if (seq < min) {
        min = seq
      }
      if (seq > max) {
        max = seq
      }
      segments.push({
        ...segment,
        seq,
        address,
      })
    }
  }
  segments.sort((a, b) => a.seq - b.seq)
  let idx = 0
  let currentRun = null
  // All the sequential segment numbers in order
  const runs = []
  for (let i = min; i <= max; i += 1) {
    if (segments[idx].seq === i) {
      // We have ${i}.ts!
      if (currentRun === null) {
        currentRun = []
        runs.unshift(currentRun)
      }
      currentRun.push(segments[idx])
      idx += 1
    } else {
      // We do not have ${i}.ts
      currentRun = null
    }
  }
  let bestRun = runs[0]
  // OK so this is something of an ad-hoc algorithm for "best" run, but
  // we have a few objectives...
  for (const run of runs) {
    // If a few recent segments arrived out-of-order, hold off until
    // we have everything. "Having everything" will be defined for now
    // as a run of 5 contigious segments.
    if (bestRun.length < 5 && run.length > bestRun.length) {
      bestRun = run
    }
  }
  let targetDuration = 0
  let output = []
  for (const segment of bestRun) {
    if (segment.duration > targetDuration) {
      targetDuration = segment.duration
    }
    output.push(`#EXTINF:${segment.duration},`)
    output.push(`${segment.address}${segment.uri}`)
  }
  output = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    `#EXT-X-MEDIA-SEQUENCE:${bestRun[0].seq}`,
    `#EXT-X-TARGETDURATION:${targetDuration}`,
    ...output,
  ]
  res.end(output.join('\n'))
  return
  if (!broadcasterUrl) {
    res.status(404)
    return res.json({
      errors: ['file not found'],
    })
  }
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  const getUrl = `${broadcasterUrl}/stream/${file}`
  if (file.endsWith(M3U8)) {
    const innerRes = await fetch(getUrl)
    const text = await innerRes.text()
    res.header('content-type', innerRes.headers.get('content-type'))
    res.status(innerRes.status)
    res.send(text)
    res.end()
  } else if (file.endsWith(TS)) {
    res.redirect(getUrl)
  }
})

export default app
