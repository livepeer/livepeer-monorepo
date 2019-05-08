import { Router } from 'express'
import uuid from 'uuid/v4'
import { generateStreamKey } from '../util'
import { validatePost } from '../middleware'

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

router.put('/:id', async (req, res) => {
  const data = req.body

  if (data.id !== `ingress/${req.params.id}`) {
    res.status(409)
    return res.json({ errors: ['id in URL and body must match'] })
  }

  const validate = req.validators.ingress

  const valid = validate(data)
  if (!valid) {
    res.status(422)
    return res.json({
      errors: validate.errors.map(({ message }) => message),
    })
  }

  await req.store.replace(data)
  res.status(200)
  res.json(data)
})

router.delete('/:id', async (req, res) => {
  await req.store.delete(`ingress/${req.params.id}`)
  res.sendStatus(204)
})

export default router
