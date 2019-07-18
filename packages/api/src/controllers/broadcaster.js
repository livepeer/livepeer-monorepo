import { Router } from 'express'
import uuid from 'uuid/v4'
import logger from '../logger'

const app = Router()

app.get('/', async (req, res) => {
  const output = await req.store.list('wowza')
  res.status(200)
  res.json(output)
})

export default app
