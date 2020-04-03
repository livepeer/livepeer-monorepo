import { parse as parsePath } from 'path'
import { parse as parseQS } from 'querystring'
import { parse as parseUrl } from 'url'
import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import { Router } from 'express'
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

  const objStoreIds = await req.store.getPropertyIds(
    `objectstoresuserId/${req.params.userId}`,
    cursor,
    limit,
  )

  const objStores = []
  for (let i = 0; i < objStoreIds.length; i++) {
    const objStore = await req.store.get(`objectstores/${objStoreIds[i]}`)
    if (objStore) {
      objStores.push(objStore)
    }
  }

  res.status(200)

  if (objStores.length > 0) {
    res.links({ next: makeNextHREF(req, objStoreIds.cursor) })
  }

  res.json(objStores)
})

app.get('/:userId/:id', authMiddleware({}), async (req, res) => {
  const { id, userId } = req.params
  const objStoreIds = await req.store.getPropertyIds(
    `objectstoresuserId/${userId}`,
  )

  if (objStoreIds.includes(id)) {
    const objStore = await req.store.get(`objectstores/${id}`)

    if (req.user.admin !== true && req.user.id !== objStore.userId) {
      res.status(403)
      res.json({
        errors: ['user can only request information on their own object stores'],
      })
    } else {
      res.status(200)
      res.json(objStore)
    }
  }
})

app.post(
  '/',
  authMiddleware({}),
  validatePost('objectstores'),
  async (req, res) => {
    const id = uuid()

    await req.store.create({
      id: id,
      credentials: req.body.credentials,
      path: req.body.path,
      userId: req.user.id,
      type: req.body.type,
      kind: `objectstores`,
    })

    const store = await req.store.get(`objectstores/${id}`)

    if (store) {
      res.status(201)
      res.json(store)
    } else {
      res.status(403)
      res.json({errors: ['store not created']})
    }
  },
)

export default app
