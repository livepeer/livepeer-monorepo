import { Router } from 'express'
import uuid from 'uuid/v4'
import logger from '../logger'

const app = Router()

app.get('/', async (req, res) => {
  const output = await req.store.list('wowza')
  res.status(200)
  res.json(output)
})

app.post('/', async (req, res) => {
  const id = `wowza/${uuid()}`
  const doc = {
    ...(req.body || {}),
    id,
  }
  await req.store.create(doc)
  res.status(201)
  res.json(doc)
})

export default app
