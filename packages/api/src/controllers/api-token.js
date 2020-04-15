import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import logger from '../logger'
import uuid from 'uuid/v4'

const app = Router()

app.get('/:id', authMiddleware({}), async (req, res) => {
  const { id } = req.params
  const apiToken = await req.store.get(`api-token/${id}`)
  res.status(200)
  res.json(apiToken)
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

  const tokenIds = await req.store.query('api-token', { userId: userId })
  console.log(tokenIds)
  const userTokens = []
  for (let i = 0; i < tokenIds.length; i++) {
    const token = await req.store.get(`api-token/${tokenIds[i]}`, false)
    userTokens.push(token)
  }

  res.status(200)
  res.json(userTokens)
})

app.post(
  '/',
  authMiddleware({}),
  validatePost('api-token'),
  async (req, res) => {
    const id = uuid()
    await req.store.create({
      id: id,
      userId: req.user.id,
      kind: 'api-token',
    })

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
