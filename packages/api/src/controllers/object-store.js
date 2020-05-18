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

app.get('/:userId', authMiddleware({ admin: true }), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  logger.info(`cursor params ${cursor}, limit ${limit}`)

  const { data: objStores, cursor: cursorOut } = await req.store.queryObjects({
    kind: 'object-store',
    query: { userId: req.params.userId },
    cursor,
    limit,
  })

  res.status(200)

  if (objStores.length > 0 && cursorOut) {
    res.links({ next: makeNextHREF(req, cursorOut) })
  }

  res.json(objStores)
})

app.get('/:userId/:id', authMiddleware({}), async (req, res) => {
  const { id, userId } = req.params
  const { data: objStoreIds } = await req.store.query({
    kind: 'object-store',
    query: { userId: userId }
  })

  if (!objStoreIds.includes(id)) {
    res.status(404)
    return res.json({
      errors: [
        `user id ${userId} does not have any object stores associated with it`,
      ],
    })
  }

  if (objStoreIds.includes(id)) {
    const objStore = await req.store.get(`object-store/${id}`)

    if (req.user.admin !== true && req.user.id !== objStore.userId) {
      res.status(403)
      return res.json({
        errors: [
          'user can only request information on their own object stores',
        ],
      })
    }

    res.status(200)
    res.json(objStore)
  }
})

app.post(
  '/',
  authMiddleware({}),
  validatePost('object-store'),
  async (req, res) => {
    const id = uuid()

    await req.store.create({
      id: id,
      credentials: req.body.credentials,
      path: req.body.path,
      userId: req.user.id,
      type: req.body.type,
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
