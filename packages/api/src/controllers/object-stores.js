import { parse as parsePath } from 'path'
import { parse as parseQS } from 'querystring'
import { parse as parseUrl } from 'url'
import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import { Router } from 'express'
import logger from '../logger'
import uuid from 'uuid/v4'
import wowzaHydrate from './wowza-hydrate'
import path from 'path'

const app = Router()

app.get('/', authMiddleware({ admin: true }), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)

  const resp = await req.store.list(`objectstores/`, cursor, limit)
  const output = resp.data
  const nextCursor = resp.cursor
  res.status(200)

  let baseUrl = new URL(
    `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  )
  if (output.length > 0) {
    let next = baseUrl
    next.searchParams.set('cursor', nextCursor)
    res.links({
      next: next.href,
    })
  }
  res.json(output)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const credentials = await req.store.get(`objectstores/${req.params.id}`)
  res.status(200)
  res.json(credentials)
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
      kind: 'objectstores',
    })

    const store = await req.store.get(`objectstores/${id}`)
    store.credentials = 'xxx'
    res.status(201)
    res.json(store)
  },
)

export default app
