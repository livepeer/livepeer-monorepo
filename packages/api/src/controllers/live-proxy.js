import router from 'express/lib/router'
import { Client } from 'minio'
import fetch from 'isomorphic-fetch'
import { Parser } from 'm3u8-parser'
import composeM3U8 from './compose-m3u8'

export default ({
  s3Url,
  s3UrlExternal,
  s3Access,
  s3Secret,
  upstreamBroadcaster,
}) => {
  const url = new URL(s3Url)
  const useSSL = url.protocol === 'https:'

  let port = url.port
  if (!port) {
    port = useSSL ? '443' : '80'
  }

  const bucket = url.pathname.slice(1)

  const client = new Client({
    endPoint: url.hostname,
    port: parseInt(port),
    useSSL: useSSL,
    accessKey: s3Access,
    secretKey: s3Secret,
  })

  const upload = (path, data) =>
    new Promise((resolve, reject) => {
      client.putObject(bucket, path, data, function(err, etag) {
        if (err) {
          return reject(err)
        }
        return resolve(etag)
      })
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
      upload(`${id}.m3u8`, manifestText),
      ...parser.manifest.playlists.map(async playlist => {
        const composedManifest = await composeM3U8(
          [
            `${upstreamBroadcaster}/stream/${playlist.uri}`,
            `${s3Url}/${playlist.uri}`,
          ],
          { limit: 10, rewrite },
        )

        await upload(playlist.uri, composedManifest)
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
