import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import logger from '../logger'
import uuid from 'uuid/v4'

const app = Router()

app.get('/', authMiddleware({ admin: true }), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)

  const resp = await req.store.list(`apitoken/`, cursor, limit)
  let output = resp.data
  const nextCursor = resp.cursor
  res.status(200)

  if (output.length > 0) {
    res.links({ next: makeNextHREF(req, nextCursor) })
  }

  res.json(output)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const { id } = req.params
  const apiToken = await req.store.get(`apitoken/${id}`)
  res.status(200)
  res.json(apiToken)
})

app.get('/:userId/tokens', authMiddleware({}), async (req, res) => {
  const { userId } = req.params
  const tokenIds = await req.store.query('apitoken', { userId: userId })
  const userTokens = []
  for (let i = 0; i < tokenIds.length; i++) {
    const token = await req.store.get(`apitoken/${tokenIds[i]}`, false)
    userTokens.push(token)
  }

  if (req.user.admin !== true && req.user.id !== userId) {
    res.status(403)
    res.json({
      errors: ['user can only request information on their own tokens'],
    })
  } else {
    res.status(200)
    res.json(userTokens)
  }
})

app.post(
  '/',
  authMiddleware({}),
  validatePost('apitoken'),
  async (req, res) => {
    const id = uuid()
    await req.store.create({
      id: id,
      userId: req.user.id,
      kind: 'apitoken',
    })

    const apiToken = await req.store.get(`apitoken/${id}`)

    if (apiToken) {
      res.status(201)
      res.json(apiToken)
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
