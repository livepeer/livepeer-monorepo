import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import { Router } from 'express'
import logger from '../logger'
import uuid from 'uuid/v4'

const app = Router()

app.get('/:userId', authMiddleware({}), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)

  const resp = await req.store.list(
    `streaminstance/${req.params.userId}`,
    cursor,
    limit,
  )

  // TO DO: add call to broadcaster status endpoints, and only select stream_instances active.
  // Need to add a `lastActive` field here, and finalize way to keep that field updated to serve as a
  // kind of cache.

  let output = resp.data
  const nextCursor = resp.cursor
  res.status(200)

  if (output.length > 0) {
    res.links({ next: makeNextHREF(req, nextCursor) })
  }

  res.json(output)
})

app.get('/:userId/:id', authMiddleware({}), async (req, res) => {
  const { id } = req.params
  const streamInstance = await req.store.get(`streaminstance/${userId}/${id}`)
  res.status(200)
  res.json(streamInstance)
})

app.post(
  '/',
  authMiddleware({}),
  validatePost('streaminstance'),
  async (req, res) => {
    const id = uuid()

    const stream = await req.store.get(`stream/${req.body.streamId}`)
    // const broadcaster = await req.store.get(`broadcasters/${req.body.streamId}`) // added when broadcaster endpoint is merged
    if (!stream) {
      res.status(403)
      res.json({ error: `no stream found with id ${req.body.streamId}` })
      return
    }

    await req.store.create({
      id: id,
      streamId: req.body.streamId,
      broadcasterId: req.body.broadcasterId,
      userId: req.user.id,
      kind: 'streaminstance',
    })

    const streamInstance = await req.store.get(`streaminstance/${id}`)

    if (streamInstance) {
      res.status(201)
      res.json(streamInstance)
    } else {
      res.status(403)
      res.json({})
    }
  },
)

function makeNextHREF(req, nextCursor) {
  let baseUrl = new URL(
    `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  )
  let next = baseUrl
  next.searchParams.set('cursor', nextCursor)
  return next.href
}

export default app
