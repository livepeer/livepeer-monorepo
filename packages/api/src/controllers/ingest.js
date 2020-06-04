import Router from 'express/lib/router'
import { authMiddleware } from '../middleware'

const app = Router()

app.get('/', async (req, res, next) => {
  const ingest = await req.getIngest(req)
  res.json(ingest)
})

export default app
