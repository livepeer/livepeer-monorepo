import router from 'express/lib/router'
import fetch from 'isomorphic-fetch'
import { Parser } from 'm3u8-parser'
import composeM3U8 from './compose-m3u8'
import minioClient from './minio-client'
import path from 'path'

export default ({
  s3Url,
  s3UrlExternal,
  s3Access,
  s3Secret,
  upstreamBroadcaster,
}) => {
  const client = minioClient({
    s3Url,
    s3Access,
    s3Secret,
  })

  const app = router()

  app.get('/*.m3u8', async (req, res) => {
    const parts = await client.list(`${req.url}/part`)
    if (parts.length === 0) {
      res.status(404)
      return res.json({ errors: ['not found'] })
    }
    const urls = parts.map(p => `${s3Url}${p.name}`)
    console.log(urls)
    const composed = await composeM3U8(urls)
    console.log(composed)
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET')
    res.header('Content-Type', 'application/vnd.apple.mpegurl')
    res.send(composed)
    res.end()
  })

  return app
}
