import { parse as parseUrl } from 'url'
import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import logger from '../logger'
import uuid from 'uuid/v4'
import wowzaHydrate from './wowza-hydrate'
import { makeNextHREF, trackAction } from './helpers'
import { generateStreamKey } from './generate-stream-key'
import { geolocateMiddleware } from '../middleware'
import { getBroadcasterHandler } from './broadcaster'

const app = Router()

const hackMistSettings = (req, profiles) => {
  // FIXME: tempoarily, Mist can only make passthrough FPS streams with 2-second gop sizes
  if (
    !req.headers['user-agent'] ||
    !req.headers['user-agent'].toLowerCase().includes('mistserver')
  ) {
    return profiles
  }
  profiles = profiles || []
  return profiles.map((profile) => {
    profile = {
      ...profile,
      fps: 0,
    }
    if (typeof profile.gop === 'undefined') {
      profile.gop = '2.0'
    }
    return profile
  })
}

app.get('/', authMiddleware({ admin: true }), async (req, res) => {
  let { limit, cursor, streamsonly, sessionsonly, all } = req.query

  logger.info(`cursor params ${cursor}, limit ${limit} all ${all}`)
  const filter1 = all ? (o) => o : (o) => !o[Object.keys(o)[0]].deleted
  let filter2 = (o) => o
  if (streamsonly) {
    filter2 = (o) => !o[Object.keys(o)[0]].parentId
  } else if (sessionsonly) {
    filter2 = (o) => o[Object.keys(o)[0]].parentId
  }

  const resp = await req.store.list({
    prefix: `stream/`,
    cursor,
    limit,
    filter: (o) => filter1(o) && filter2(o),
  })
  let output = resp.data
  res.status(200)

  if (output.length > 0) {
    res.links({ next: makeNextHREF(req, resp.cursor) })
  } // CF doesn't know what this means
  output = output.map((o) => o[Object.keys(o)[0]])
  res.json(output)
})

app.get('/sessions/:parentId', authMiddleware({}), async (req, res) => {
  const { parentId, limit, cursor } = req.params
  logger.info(`cursor params ${cursor}, limit ${limit}`)

  const stream = await req.store.get(`stream/${parentId}`)
  if (
    !stream ||
    stream.deleted ||
    (stream.userId !== req.user.id && !req.isUIAdmin)
  ) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }

  const { data: streams, cursor: cursorOut } = await req.store.queryObjects({
    kind: 'stream',
    query: { parentId },
    cursor,
    limit,
  })
  res.status(200)
  if (streams.length > 0 && cursorOut) {
    res.links({ next: makeNextHREF(req, cursorOut) })
  }
  res.json(streams)
})

app.get('/user/:userId', authMiddleware({}), async (req, res) => {
  let { limit, cursor, streamsonly, sessionsonly } = req.query
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)

  if (req.user.admin !== true && req.user.id !== req.params.userId) {
    res.status(403)
    return res.json({
      errors: ['user can only request information on their own streams'],
    })
  }

  let filter = (o) => !o.deleted
  if (streamsonly) {
    filter = (o) => !o.deleted && !o.parentId
  } else if (sessionsonly) {
    filter = (o) => !o.deleted && o.parentId
  }

  const { data: streams, cursor: cursorOut } = await req.store.queryObjects({
    kind: 'stream',
    query: { userId: req.params.userId },
    cursor,
    limit,
    filter,
  })
  res.status(200)
  if (streams.length > 0 && cursorOut) {
    res.links({ next: makeNextHREF(req, cursorOut) })
  }
  res.json(streams)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const stream = await req.store.get(`stream/${req.params.id}`)
  if (
    !stream ||
    ((stream.userId !== req.user.id || stream.deleted) && !req.isUIAdmin)
  ) {
    // do not reveal that stream exists
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  res.status(200)
  res.json(stream)
})

// returns stream by steamKey
app.get('/playback/:playbackId', authMiddleware({}), async (req, res) => {
  const {
    data: [stream],
  } = await req.store.queryObjects({
    kind: 'stream',
    query: { playbackId: req.params.playbackId },
  })
  if (
    !stream ||
    ((stream.userId !== req.user.id || stream.deleted) && !req.user.admin)
  ) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  res.status(200)
  res.json(stream)
})

// returns stream by steamKey
app.get('/key/:streamKey', authMiddleware({}), async (req, res) => {
  const {
    data: [stream],
  } = await req.store.queryObjects({
    kind: 'stream',
    query: { streamKey: req.params.streamKey },
  })
  if (
    !stream ||
    ((stream.userId !== req.user.id || stream.deleted) && !req.user.admin)
  ) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  res.status(200)
  res.json(stream)
})

// Needed for Mist server
app.get(
  '/:streamId/broadcaster',
  geolocateMiddleware({}),
  getBroadcasterHandler,
)

async function generateUniqueStreamKey(store, otherKeys) {
  while (true) {
    const streamId = await generateStreamKey()
    const qres = await store.query({
      kind: 'stream',
      query: { streamId },
    })
    if (!qres.data.length && !otherKeys.includes(streamId)) {
      return streamId
    }
  }
}

app.post(
  '/:streamId/stream',
  authMiddleware({}),
  validatePost('stream'),
  async (req, res) => {
    if (!req.body || !req.body.name) {
      res.status(422)
      return res.json({
        errors: ['missing name'],
      })
    }

    const stream = await req.store.get(`stream/${req.params.streamId}`)
    if (
      !stream ||
      ((stream.userId !== req.user.id || stream.deleted) &&
        !(req.user.admin && !stream.deleted))
    ) {
      // do not reveal that stream exists
      res.status(404)
      return res.json({ errors: ['not found'] })
    }

    const id = uuid()
    const createdAt = Date.now()

    const doc = wowzaHydrate({
      ...req.body,
      kind: 'stream',
      userId: stream.userId,
      renditions: {},
      objectStoreId: stream.objectStoreId,
      id,
      createdAt,
      parentId: stream.id,
    })

    doc.profiles = hackMistSettings(req, doc.profiles)

    try {
      await req.store.create(doc)
      trackAction(
        req.user.id,
        req.user.email,
        { name: 'Stream Session Created' },
        req.config.segmentApiKey,
      )
    } catch (e) {
      console.error(e)
      throw e
    }
    res.status(201)
    res.json(doc)
  },
)

app.post('/', authMiddleware({}), validatePost('stream'), async (req, res) => {
  if (!req.body || !req.body.name) {
    res.status(422)
    return res.json({
      errors: ['missing name'],
    })
  }
  const id = uuid()
  const createdAt = Date.now()
  const streamKey = await generateUniqueStreamKey(req.store, [])
  // Mist doesn't allow dashes in the URLs
  const playbackId = (
    await generateUniqueStreamKey(req.store, [streamKey])
  ).replace(/-/g, '')

  let objectStoreId
  if (req.body.objectStoreId) {
    await req.store.get(`objectstores/${req.user.id}/${req.body.objectStoreId}`)
    objectStoreId = req.body.objectStoreId
  }

  const doc = wowzaHydrate({
    ...req.body,
    kind: 'stream',
    userId: req.user.id,
    renditions: {},
    objectStoreId,
    id,
    createdAt,
    streamKey,
    playbackId,
    createdByTokenName: req.tokenName,
  })

  doc.profiles = hackMistSettings(req, doc.profiles)

  await Promise.all([
    req.store.create(doc),
    trackAction(
      req.user.id,
      req.user.email,
      { name: 'Stream Created' },
      req.config.segmentApiKey,
    ),
  ])

  res.status(201)
  res.json(doc)
})

app.put('/:id/setactive', authMiddleware({}), async (req, res) => {
  const { id } = req.params
  const stream = await req.store.get(`stream/${id}`, false)
  if (!stream || stream.deleted || !req.user.admin) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }

  stream.isActive = req.body.active
  stream.lastSeen = +new Date()
  await req.store.replace(stream)
  if (stream.parentId) {
    const pStream = await req.store.get(`stream/${id}`, false)
    if (pStream && !pStream.deleted) {
      pStream.isActive = req.body.active
      pStream.lastSeen = stream.lastSeen
      await req.store.replace(pStream)
    }
  }

  res.status(204)
  res.end()
})

app.delete('/:id', authMiddleware({}), async (req, res) => {
  const { id } = req.params
  const stream = await req.store.get(`stream/${id}`, false)
  if (
    !stream ||
    stream.deleted ||
    (stream.userId !== req.user.id && !req.isUIAdmin)
  ) {
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
  const [live, streamId, ...rest] = pathname.split('/').filter((x) => !!x)
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
  if (stream.objectStoreId) {
    const os = await req.store.get(
      `object-store/${stream.objectStoreId}`,
      false,
    )
    if (!os) {
      res.status(500)
      return res.json({
        errors: [
          `data integity error: object store ${stream.objectStoreId} not found`,
        ],
      })
    }
    objectStore = os.url
  }

  res.json({
    manifestId: streamId,
    presets: stream.presets,
    profiles: stream.profiles,
    objectStore: objectStore,
  })
})

export default app
