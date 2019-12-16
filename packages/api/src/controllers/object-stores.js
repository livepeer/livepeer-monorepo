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
    const creds = req.body.awsCredentials

    await req.store.create({
      id: id,
      host: creds.host,
      region: creds.region,
      bucket: creds.bucket,
      accessKeyID: creds.accessKeyID,
      secretAccessKey: creds.secretAccessKey,
      userId: req.user.id,
      kind: 'objectstores',
    })

    const credentials = await req.store.get(`objectstores/${id}`)
    res.status(201)
    res.json(credentials)
  },
)

export default app
