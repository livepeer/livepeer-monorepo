import { Router } from 'express'

const app = Router()

app.get('/', async (req, res, next) => {
  const orchestrators = await req.getOrchestrators(req)

  return res.json(orchestrators.map(({ address }) => ({ address })))
})

export default app
