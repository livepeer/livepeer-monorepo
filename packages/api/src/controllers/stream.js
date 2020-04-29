import { parse as parsePath } from 'path'
import { parse as parseQS } from 'querystring'
import { parse as parseUrl } from 'url'
import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import logger from '../logger'
import uuid from 'uuid/v4'
import wowzaHydrate from './wowza-hydrate'
import path from 'path'

const app = Router()

app.get('/', authMiddleware({}), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)
  if (req.user.admin !== true) {
    const streamIds = await req.store.query('stream', { userId: req.user.id }, cursor, limit)
    const streams = []
    for (let i = 0; i < streamIds.length; i++) {
      const token = await req.store.get(`stream/${streamIds[i]}`, false)
      streams.push(token)
    }
    res.status(200)
    res.json(streams)
    return
  }

  if (req.authTokenType != 'JWT') {
    res.status(403)
    return res.json({ errors: ['admin can only use JWT'] })
  }

  const resp = await req.store.list(`stream/`, cursor, limit)
  let output = resp.data
  const nextCursor = resp.cursor
  res.status(200)

  let baseUrl = new URL(
    `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  )
  if (output.length > 0) {
    let next = baseUrl
    next.searchParams.set('cursor', nextCursor)
    res.links({
      next: next.href,
    })
    output = output.map(o => o[Object.keys(o)[0]])
  } // CF doesn't know what this means
  res.json(output)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const output = await req.store.get(`stream/${req.params.id}`)
  if (!output || output.userId !== req.user.id && !(req.user.admin && req.authTokenType == 'JWT')) {
    // do not reveal that stream exists
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  res.status(200)
  res.json(output)
})

app.post('/', authMiddleware({}), validatePost('stream'), async (req, res) => {
  const id = uuid()

  let objectStoreID
  if (req.body.objectStoreId) {
    await req.store.get(`objectstores/${req.user.id}/${req.body.objectStoreId}`)
    objectStoreID = req.body.objectStoreId
  }

  const doc = wowzaHydrate({
    ...req.body,
    kind: 'stream',
    userId: req.user.id,
    renditions: {},
    objectStoreId: objectStoreID,
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
  // logger.info(`got webhook: ${JSON.stringify(req.body)}`)
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
  if (!stream) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  let objectStore = undefined
  if (stream.objectStoreId && stream.userId) {
    const store = await req.store.get(
      `objectstores/${stream.userId}/${stream.objectStoreId}`,
    )
    if (store && 'type' in store && 'path' in store) {
      objectStore = {
        type: store.type,
        path: store.path,
        credentials: store.credentials,
      }
    }
  }

  res.json({
    manifestId: streamId,
    presets: stream.presets,
    profiles: stream.profiles,
    objectStore: objectStore,
  })
})

export default app
