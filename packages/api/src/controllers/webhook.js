import { parse as parseUrl } from 'url'
import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import logger from '../logger'
import uuid from 'uuid/v4'
import { makeNextHREF, trackAction } from './helpers'
import fetch from 'isomorphic-fetch'

const app = Router()

app.get('/', authMiddleware({}), async (req, res) => {
  let { limit, cursor, all } = req.query
  logger.info(`cursor params ${cursor}, limit ${limit} all ${all}`)
  
  // get a list of user defined webhooks
  const filter1 = all ? (o) => o : (o) => !o[Object.keys(o)[0]].deleted
  let filter2 = (o) => o[Object.keys(o)[0]].userId

  const resp = await req.store.list({
    prefix: `webhook/`,
    cursor,
    limit,
    filter: (o) => filter1(o) && filter2(o),
  })
  let output = resp.data
  res.status(200)

  if (output.length > 0) {
    res.links({ next: makeNextHREF(req, resp.cursor) })
  } // CF doesn't know what this means
  output = output.map((o) => o[Object.keys(o)[0]])
  res.json(output)
})

app.post('/', authMiddleware({}), validatePost('webhook'), async (req, res) => {
  // create a webhook
  if (!req.body || !req.body.name) {
    res.status(422)
    return res.json({
      errors: ['missing name'],
    })
  }

  const webhook = await req.store.get(`webhook/${req.body.id}`)
  if (
    !webhook ||
    ((webhook.userId !== req.user.id || webhook.deleted) &&
      !(req.user.admin && !stream.deleted))
  ) {
    // do not reveal that stream exists
    res.status(404)
    return res.json({ errors: ['not found'] })
  }

  const id = uuid()
  const createdAt = Date.now()

  const doc = {
    id,
    userId: req.user.id,
    kind: 'webhook',
    name: req.body.name,
    timestamp: createdAt,
    eventType: 'streamStarted', // TODO, remove hardcoding once we have mutliple webhook events
    url: req.body.url, // TODO validate this. 
  }

  try {
    await req.store.create(doc)
    trackAction(
      req.user.id,
      req.user.email,
      { name: 'Webhook Created' },
      req.config.segmentApiKey,
    )
  } catch (e) {
    console.error(e)
    throw e
  }
  res.status(201)
  res.json(doc)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  // get a specific webhook
  logger.info(`webhook params ${req.params.id}`)

  const webhook = await req.store.get(`webhook/${req.params.id}`)
  if (
    !webhook ||
    webook.deleted ||
    (webhook.userId !== req.user.id && !req.isUIAdmin)
  ) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }

  res.status(200)
  res.json(webhook)
})

app.put('/:id', authMiddleware({}), validatePost('webhook'), async (req, res) => {
  // modify a specific webhook
  res.json({})
})

app.delete('/:id', authMiddleware({}), async (req, res) => {
  // delete a specific webhook
  res.json({})
})


app.post('/trigger', authMiddleware({admin: true}), async (req, res) => {
  // TODO move this logic to /setactive endpoint
  // triggers a webhook
  const { id } = req.body
  const webhook = await req.store.get(`webhook/${id}`)
  if (
    !webhook ||
    webook.deleted ||
    (webhook.userId !== req.user.id && !req.isUIAdmin)
  ) {
    res.status(404)
    return res.json({ errors: ['not found'] })
  }

  let payload = {} //TODO get stream object, sanatize it and send it over.

  let params = {
    method: 'POST',

  }
  params.headers = {
    'content-type': 'application/json',
  }

  params.body = JSON.stringify(payload)

  let resp = await fetch(webhook.url, params)
  
  if (!resp || resp.statsCode !== 200) {
    // no 200, no stream
    res.status(400)
    return res.end()
  }

  res.status(200)
  res.end()
})

