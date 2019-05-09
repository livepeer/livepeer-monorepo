import { Router } from 'express'
import uuid from 'uuid/v4'
import { generateStreamKey } from '../util'
import { validatePost, validatePut } from '../middleware'

const router = Router()

router.get('/', async (req, res) => {
  const output = await req.store.list('ingress/')
  res.status(200)
  res.json(output)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const data = await req.store.get(`ingress/${id}`)
  res.status(200)
  res.json(data)
})

router.post('/', validatePost('ingress'), async (req, res) => {
  const { body } = req

  const data = {
    id: `ingress/${uuid()}`,
    key: await generateStreamKey(),
    ...body,
  }

  await req.store.create(data)

  res.status(201)
  res.json(data)
})

router.put('/:id', validatePut('ingress'), async (req, res) => {
  const data = req.body
  await req.store.replace(data)
  res.status(200)
  res.json(data)
})

router.delete('/:id', async (req, res) => {
  await req.store.delete(`ingress/${req.params.id}`)
  res.sendStatus(204)
})

export default router
