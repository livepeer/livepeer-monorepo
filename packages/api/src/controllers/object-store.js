import { parse as parsePath } from 'path'
import { parse as parseQS } from 'querystring'
import { parse as parseUrl } from 'url'
import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import { makeNextHREF } from './helpers'
import logger from '../logger'
import uuid from 'uuid/v4'
import wowzaHydrate from './wowza-hydrate'
import path from 'path'

const app = Router()

app.get('/', authMiddleware({}), async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    res.status(400)
    return res.json({
      errors: [`required query parameter: userId`],
    })
  }

  if (req.user.admin !== true && req.user.id !== userId) {
    res.status(403)
    return res.json({
      errors: ['user can only request information on their own object stores'],
    })
  }

  const { data, cursor } = await req.store.queryObjects({
    kind: 'object-store',
    query: { userId: userId },
  })

  res.status(200)
  if (data.length > 0 && cursor) {
    res.links({ next: makeNextHREF(req, cursor) })
  }
  res.json(data)
})

app.post(
  '/',
  authMiddleware({}),
  validatePost('object-store'),
  async (req, res) => {
    const id = uuid()

    await req.store.create({
      id: id,
      url: req.body.url,
      userId: req.user.id,
      kind: `object-store`,
    })

    const store = await req.store.get(`object-store/${id}`)

    if (store) {
      res.status(201)
      res.json(store)
    } else {
      res.status(403)
      res.json({ errors: ['store not created'] })
    }
  },
)

export default app
