import { authMiddleware, geolocateMiddleware } from '../middleware'
import Router from 'express/lib/router'

const app = Router()

app.get('/', geolocateMiddleware({first: false}), (req, res, next) => {
  res.json(req.region)
})

export default app
