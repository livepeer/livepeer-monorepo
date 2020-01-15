import router from 'express/lib/router'
import { Client } from 'minio'
import httpProxy from 'http-proxy'
import fetch from 'isomorphic-fetch'
import { getClientIp } from 'request-ip'

var proxy = httpProxy.createProxyServer({})

export default ({ s3Url, s3Access, s3Secret }) => {
  const url = new URL(s3Url)
  const client = new Client({
    endPoint: url.hostname,
    port: 9000,
    useSSL: url.protocol === 'https:',
    accessKey: s3Access,
    secretKey: s3Secret,
  })

  const app = router()
  proxy.on('proxyRes', function(proxyRes, req, res) {
    if (req.method !== 'POST') {
      return
    }
    proxyRes.on('end', function() {
      console.log('res from proxied server:', proxyRes.headers.location)
      res.status(400)
      res.end()
    })
  })

  app.post('*', async (req, res) => {
    const ip = getClientIp(req)
    console.log(req.url)

    await new Promise((resolve, reject) => {
      proxy.web(req, res, { target: 'localhost:3085' }, err => {
        if (err) {
          console.log('post err', err)
          reject(err)
        }
        resolve()
      })
    })
    res.on('end', () => {
      console.log('post done')
    })
  })

  app.put('*', (req, res) => {
    console.log('put', req.url)
    res.status(200)
    res.end()
  })

  return app
}
