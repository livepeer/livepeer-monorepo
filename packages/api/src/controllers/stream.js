import { parse as parsePath } from 'path'
import { parse as parseQS } from 'querystring'
import { parse as parseUrl } from 'url'
import { Router } from 'express'
import logger from '../logger'
import uuid from 'uuid/v4'
import wowzaHydrate from './wowza-hydrate'

const app = Router()

app.get('/', async (req, res) => {
  const output = await req.store.list(`stream/`)
  res.status(200)
  res.json(output)
})

app.get('/:id', async (req, res) => {
  const output = await req.store.get(`stream/${req.params.id}`)
  res.status(200)
  res.json(output)
})

app.post('/', async (req, res) => {
  const id = uuid()
  const doc = wowzaHydrate({
    ...(req.body || {}),
    kind: 'stream',
    presets: [],
    renditions: {},
    id,
  })
  await req.store.create(doc)
  res.status(201)
  res.json(doc)
})

app.post('/hook', async (req, res) => {
  if (!req.body || !req.body.url) {
    res.status(422)
    return res.json({
      errors: ['missing url'],
    })
  }
  logger.info(`got webhook: ${JSON.stringify(req.body)}`)
  // These are of the form /live/:manifestId/:segmentNum.ts
  let { query, pathname, protocol } = parseUrl(req.body.url)
  // Protocol is sometimes undefined, due to https://github.com/livepeer/go-livepeer/issues/1006
  if (!protocol) {
    protocol = 'http:'
  }
  if (protocol === 'https:') {
    protocol = 'http:'
  }
  if (protocol !== 'http:' && protocol !== 'rtmp:') {
    res.status(422)
    return res.json({ errors: [`unknown protocol: ${protocol}`] })
  }

  // Allowed patterns, for now:
  // http(s)://broadcaster.example.com/live/:streamId/:segNum.ts
  // rtmp://broadcaster.example.com/live/:streamId
  const [live, streamId, ...rest] = pathname.split('/').filter(x => !!x)
  if (protocol === 'rtmp:' && rest.length > 0) {
    res.status(422)
    return res.json({
      errors: [
        'RTMP address should be rtmp://example.com/live. Stream key should be a UUID.',
      ],
    })
  } else if (protocol === 'http:' && rest.length > 1) {
    res.status(422)
    return res.json({
      errors: [
        'acceptable URL format: http://example.com/live/:streamId/:number.ts',
      ],
    })
  }

  if (live !== 'live') {
    res.status(404)
    return res.json({ errors: ['ingest url must start with /live/'] })
  }

  const stream = await req.store.get(`stream/${streamId}`)

  res.json({
    manifestId: streamId,
    presets: stream.presets,
  })
})

export default app
