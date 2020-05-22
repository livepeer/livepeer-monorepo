import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import { trackAction } from './helpers'
import logger from '../logger'
import uuid from 'uuid/v4'

const app = Router()

app.get('/:id', authMiddleware({}), async (req, res) => {
  const { id } = req.params
  const apiToken = await req.store.get(`api-token/${id}`)
  if (!apiToken) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  if (!req.user.admin && req.user.id !== apiToken.userId) {
    // This would only come up if someone was brute-forcing; let's give them a 404
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  res.status(200)
  res.json(apiToken)
})

app.delete('/:id', authMiddleware({}), async (req, res) => {
  const { id } = req.params
  const apiToken = await req.store.get(`api-token/${id}`)
  if (!apiToken) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  if (!req.user.admin && req.user.id !== apiToken.userId) {
    res.status(403)
    return res.json({ errors: ['users may only delete their own API tokens'] })
  }
  await req.store.delete(`api-token/${id}`)
  res.status(204)
  res.end()
})

app.get('/', authMiddleware({}), async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    res.status(400)
    return res.json({
      errors: ['missing query parameter: userId'],
    })
  }

  if (req.user.admin !== true && req.user.id !== userId) {
    res.status(403)
    return res.json({
      errors: ['user can only request information on their own tokens'],
    })
  }

  const { data: userTokens } = await req.store.queryObjects({
    kind: 'api-token',
    query: { userId: userId },
  })
  res.status(200)
  res.json(userTokens)
})

app.post(
  '/',
  authMiddleware({}),
  validatePost('api-token'),
  async (req, res) => {
    const id = uuid()
    const userId = req.user.id

    await Promise.all([
      req.store.create({
        id: id,
        userId: userId,
        kind: 'api-token',
        name: req.body.name,
      }),
      trackAction(
        userId,
        req.user.email,
        { name: 'Api Token Created' },
        req.config.segmentApiKey,
      ),
    ])

    const apiToken = await req.store.get(`api-token/${id}`)

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
