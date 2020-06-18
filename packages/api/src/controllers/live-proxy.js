import router from 'express/lib/router'
import fetch from 'isomorphic-fetch'
import { Parser } from 'm3u8-parser'
import composeM3U8 from './compose-m3u8'
import minioClient from './minio-client'

export default ({
  s3Url,
  s3UrlExternal,
  s3Access,
  s3Secret,
  upstreamBroadcaster,
  hostname,
}) => {
  const client = minioClient({
    s3Url,
    s3Access,
    s3Secret,
  })

  const app = router()

  const handleUpload = async (req, res) => {
    const { id } = req.params
    const proxyRes = await fetch(`${upstreamBroadcaster}/live${req.url}`, {
      method: req.method,
      body: req,
      headers: req.headers,
    })

    // Finish request
    proxyRes.text()

    const manifestRes = await fetch(`${upstreamBroadcaster}/stream/${id}.m3u8`)
    const manifestText = await manifestRes.text()

    const parser = new Parser()
    parser.push(manifestText)
    parser.end()
    let rewrite
    if (s3UrlExternal) {
      rewrite = {
        from: s3Url,
        to: s3UrlExternal,
      }
    }

    await Promise.all([
      client.put(`${id}.m3u8/part/${hostname}`, manifestText),
      ...parser.manifest.playlists.map(async (playlist) => {
        const manifestRes = await fetch(
          `${upstreamBroadcaster}/stream/${playlist.uri}`,
        )
        const mediaManifest = await manifestRes.text()
        await client.put(`${playlist.uri}/part/${hostname}`, mediaManifest)
      }),
    ])

    res.sendStatus(204)
  }

  app.put('/:id/:num.ts', handleUpload)
  app.post('/:id/:num.ts', handleUpload)

  // Ignore manifests entirely
  const noop = (req, res) => {
    res.sendStatus(204)
  }

  app.post('/:id/*.m3u8', noop)
  app.put('/:id/*.m3u8', noop)

  return app
}
