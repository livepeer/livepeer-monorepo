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
  }
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

  const id = uuid()
  const createdAt = Date.now()

  const doc = {
    id,
    userId: req.user.id,
    kind: 'webhook',
    name: req.body.name,
    timestamp: createdAt,
    eventType: req.body.eventType,
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
  const webhook = await req.store.get(`webhook/${req.body.id}`)
  if (
    !webhook ||
    ((webhook.userId !== req.user.id || webhook.deleted) &&
      !(req.user.admin && !stream.deleted))
  ) {
    // do not reveal that webhooks exists
    res.status(404)
    return res.json({ errors: ['not found'] })
  }

  try {
    await req.store.replace(req.body.id, req.body)
  } catch (e) {
    console.error(e)
    throw e
  }
  res.status(200)
  res.json({})
})

app.delete('/:id', authMiddleware({}), async (req, res) => {
  // delete a specific webhook
  const webhook = await req.store.get(`webhook/${req.body.id}`)
  if (
    !webhook ||
    (
      webhook.userId !== req.user.id  &&
      !(req.user.admin && !stream.deleted)
    )
  ) {
    // do not reveal that webhooks exists
    res.status(404)
    return res.json({ errors: ['not found'] })
  }
  webhook.deleted = true
  try {
    await req.store.replace(req.body.id, webhook)
  } catch (e) {
    console.error(e)
    throw e
  }
  res.status(200)
  res.json({})
})


app.post('/trigger', authMiddleware({admin: true}), async (req, res) => {
  // TODO move this logic to /setactive endpoint
  // triggers a webhook
  const { id } = req.body
  const all = false // TODO remove hardcoding here 
  const limit = 10 // hard limit so we won't spam endpoints, TODO , have a better adjustable limit 
  // get a list of user defined webhooks
  const filter1 = all ? (o) => o : (o) => !o[Object.keys(o)[0]].deleted
  let filter2 = (o) => o[Object.keys(o)[0]].userId

  const resp = await req.store.list({
    prefix: `webhook/`,
    limit,
    filter: (o) => filter1(o) && filter2(o),
  })
  let output = resp.data
  res.status(200)

  output.forEach(async (webhook) => {

  })

  let payload = {} //TODO get stream object, sanatize it and send it over.

  let params = {
    method: 'POST',

  }

  params.headers = {
    'content-type': 'application/json',
    'user-agent': 'livepeer.com'
  }

  params.body = JSON.stringify(payload)

  let resp = await fetch(webhook.url, params)
  
  if (!resp || resp.status !== 200) {
    // no 200, no stream
    res.status(400)
    return res.json()
  }

  res.status(200)
  res.json({})
})

