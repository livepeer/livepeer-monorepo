// Slight variation - this one lives at the /stream endpoint, rather than the
// /api/* that everything else lives at. This makes it follow the naming
// conventions on the broadcasters themselves.

import { Router } from 'express'
import { checkKubernetes } from '../middleware'
import { getBroadcasterStatuses } from './broadcaster'
import fetch from 'isomorphic-fetch'

const app = Router()

app.use(checkKubernetes())

const TS = '.ts'
const M3U8 = '.m3u8'

app.get('/*', async (req, res) => {
  let file = req.params[0]
  const id = file.split(/[\.\/]/)[0]
  if (!id || (!file.endsWith(TS) && !file.endsWith(M3U8))) {
    res.status(404)
    return res.json({
      errors: ['file not found'],
    })
  }
  const broadcasters = await getBroadcasterStatuses(req)
  const broadcasterUrl = Object.keys(broadcasters).find(url => {
    return !!broadcasters[url].Manifests[id]
  })
  if (!broadcasterUrl) {
    res.status(404)
    return res.json({
      errors: ['file not found'],
    })
  }
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  const getUrl = `${broadcasterUrl}/stream/${file}`
  if (file.endsWith(M3U8)) {
    const innerRes = await fetch(getUrl)
    const text = await innerRes.text()
    res.header('content-type', innerRes.headers.get('content-type'))
    res.status(innerRes.status)
    res.send(text)
    res.end()
  } else if (file.endsWith(TS)) {
    res.redirect(getUrl)
  }
})

export default app
