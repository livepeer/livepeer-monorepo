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
  const { limit, cursor, userId } = req.query
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

  const { data, cursor: newCursor } = await req.store.queryObjects({
    kind: 'object-store',
    query: { userId: userId },
    limit,
    cursor,
  })

  res.status(200)
  if (data.length > 0 && newCursor) {
    res.links({ next: makeNextHREF(req, newCursor) })
  }
  res.json(data)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const os = await req.store.get(`object-store/${req.params.id}`)
  if (!os) {
    res.status(404)
    return res.json({
      errors: ['not found'],
    })
  }

  if (req.user.admin !== true && req.user.id !== os.userId) {
    res.status(403)
    return res.json({
      errors: ['user can only request information on their own object stores'],
    })
  }

  res.json(os)
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
