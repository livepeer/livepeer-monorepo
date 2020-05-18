import { parse as parsePath } from 'path'
import { parse as parseQS } from 'querystring'
import { parse as parseUrl } from 'url'
import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import logger from '../logger'
import uuid from 'uuid/v4'
import wowzaHydrate from './wowza-hydrate'
import { makeNextHREF, trackAction } from './helpers'
import path from 'path'

const app = Router()

app.get('/', authMiddleware({ admin: true }), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  let all = req.query.all // return all streams, including deleted ones
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)
  const filter = all ? undefined : o => !o[Object.keys(o)[0]].deleted

  const resp = await req.store.list({ prefix: `stream/`, cursor, limit, filter })
  let output = resp.data
  res.status(200)

  if (output.length > 0) {
    res.links({ next: makeNextHREF(req, resp.cursor) })
  } // CF doesn't know what this means
  output = output.map(o => o[Object.keys(o)[0]])
  res.json(output)
})

app.get('/user/:userId', authMiddleware({}), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)

  if (req.user.admin !== true && req.user.id !== req.params.userId) {
    res.status(403)
    return res.json({
      errors: ['user can only request information on their own streams'],
    })
  }

  const { data: streamIds, cursor: cursorOut } = await req.store.query({
    kind: 'stream',
    query: { userId: req.params.userId },
    cursor,
    limit
  })
  const streams = []
  for (let i = 0; i < streamIds.length; i++) {
    const stream = await req.store.get(`stream/${streamIds[i]}`, false)
    if (!stream.deleted) {
      streams.push(stream)
    }
  }
  res.status(200)
  if (streamIds.length > 0 && cursorOut) {
    res.links({ next: makeNextHREF(req, cursorOut) })
  }
  res.json(streams)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const stream = await req.store.get(`stream/${req.params.id}`)
  if (!stream || (stream.userId !== req.user.id || stream.deleted) && !req.isUIAdmin) {
    // do not reveal that stream exists
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  res.status(200)
  res.json(stream)
})

app.post('/', authMiddleware({}), validatePost('stream'), async (req, res) => {
  const id = uuid()
  const createdAt = Date.now()

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
    createdAt,
  })

  await req.store.create(doc)
  trackAction(
    req.user.id,
    req.user.email,
    { name: 'Stream Created' },
    req.config.segmentApiKey,
  )

  res.status(201)
  res.json(doc)
})

app.delete('/:id', authMiddleware({}), async (req, res) => {
  const { id } = req.params
  const stream = await req.store.get(`stream/${id}`, false)
  if (!stream || stream.userId !== req.user.id && !(req.user.admin && req.authTokenType == 'JWT')) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }

  stream.deleted = true
  await req.store.replace(stream)

  res.status(204)
  res.end()
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
