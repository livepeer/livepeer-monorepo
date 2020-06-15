import Router from 'express/lib/router'
import { geolocateMiddleware } from '../middleware'
import { amalgamate } from './broadcaster'
import { shuffle } from '../util'

const app = Router()

app.get('/', geolocateMiddleware({}), async (req, res, next) => {
  let ingestPoints
  if (req.region && req.region.servers) {
    ingestPoints = await amalgamate(req, 'ingest')
  } else {
    ingestPoints = await req.getIngest(req)
  }
  res.json(shuffle(ingestPoints))
})

export default app
