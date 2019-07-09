import { Router } from 'express'
import { parse as parseUrl } from 'url'
import { parse as parsePath } from 'path'
import { parse as parseQS } from 'querystring'
import logger from '../logger'

const app = Router()

app.post('/hook', async (req, res) => {
  if (!req.body || !req.body.url) {
    res.status(422)
    return res.json({ errors: ['missing url'] })
  }
  logger.info(`got webhook: ${JSON.stringify(req.body)}`)
  // These are of the form /live/:manifestId/:segmentNum.ts
  const manifestId = req.body.url.split('/')[2]

  res.json({ manifestId })

  // xxx fixme, this was the logic for RTMP handling
  return

  const { query, pathname } = parseUrl(req.body.url)
  const { key } = parseQS(query)
  const { name } = parsePath(pathname)
  let doc
  try {
    doc = await req.store.get(`endpoint/${name}`)
  } catch (err) {
    if (err.type !== 'NotFoundError') {
      throw err
    }
    res.status(404)
    return res.json({ errors: ['not found'] })
  }

  if (key !== doc.key) {
    res.status(403)
    return res.json({ errors: ['incorrect stream key'] })
  }
  // rtmp://localhost/180064f3-c148-4cdc-a160-4b1bb00dae52?key=bsg6-zc46-dltu
  res.json({
    manifestId: doc.id,
    outputs: doc.outputs,
  })
})

export default app
