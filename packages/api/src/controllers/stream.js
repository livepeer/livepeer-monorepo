import { parse as parsePath } from 'path'
import { parse as parseQS } from 'querystring'
import { parse as parseUrl } from 'url'
import { authMiddleware } from '../middleware'
import { Router } from 'express'
import logger from '../logger'
import uuid from 'uuid/v4'
import wowzaHydrate from './wowza-hydrate'

const app = Router()

app.get('/', authMiddleware({}), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)

  const output = await req.store.list(`stream/`, cursor, limit)
  res.status(200)

  let context = {}
  if (output.length > 0) {
    context.cursor = output[output.length - 1].id
  }

  res.json({ payload: output, context })
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const output = await req.store.get(`stream/${req.params.id}`)
  res.status(200)
  res.json(output)
})

app.post('/', authMiddleware({}), async (req, res) => {
  const id = uuid()
  const doc = wowzaHydrate({
    ...req.body,
    kind: 'stream',
    presets: req.body.presets || [],
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
  let { pathname, protocol } = parseUrl(req.body.url)
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
  if (!streamId) {
    res.status(401)
    return res.json({ errors: ['stream key is required'] })
  }
  if (protocol === 'rtmp:' && rest.length > 0) {
    res.status(422)
    return res.json({
      errors: [
        'RTMP address should be rtmp://example.com/live. Stream key should be a UUID.',
      ],
    })
  }
  if (protocol === 'http:' && rest.length > 1) {
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
