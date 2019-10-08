import { Router } from 'express'

const app = Router()

const getOrchestrators = async (req, res, next) => {
  const orchestrators = await req.getOrchestrators(req)

  return res.json(orchestrators.map(({ address }) => ({ address })))
}

app.get('/', getOrchestrators)
app.get('/ext/:token', getOrchestrators)

export default app
