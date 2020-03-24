import express from 'express'
import morgan from 'morgan'
import uuid from 'uuid/v4'
import bodyParser from 'body-parser'
import fetch from 'isomorphic-fetch'
import httpProxy from 'http-proxy'
import 'express-async-errors'

const app = express()

app.use(morgan('combined'))
// app.use(bodyParser.json())

const proxy = new httpProxy.createProxyServer({
  ignorePath: true,
  secure: true,
  changeOrigin: true,
})

const doProxy = async (req, res, opts) => {
  console.log(`proxying ${req.method} ${req.url} ----> ${opts.target}`)
  return new Promise((resolve, reject) => {
    proxy.web(req, res, opts, e => {
      if (e) {
        console.log(`Fail: ${opts.target}`)
        return reject(e)
      }
      console.log(`Success: ${opts.target}`)
      resolve()
    })
  })
}

app.post('/api/stream', async (req, res) => {
  // res.json({ id: uuid() })
  await doProxy(req, res, { target: 'https://livepeer.live/api/stream' })
})

app.get('/api/broadcaster', async (req, res) => {
  const upstreamReq = await fetch('https://livepeer.live/api/broadcaster')
  const data = await upstreamReq.json()
  const outputData = data.map(broadcaster => {
    let { address } = broadcaster
    // If we only encode once, mist decodes it on the way out! So we need to encode twice
    // to pass it all the way back to the POST handler.
    address = encodeURIComponent(address)
    address = encodeURIComponent(address)
    return {
      address: `http://${req.headers.host}/${address}`,
    }
  })
  res.json(outputData)
})

app.post('/:server/live/:id/:seq.ts', async (req, res) => {
  let { server, id, seq } = req.params
  server = decodeURIComponent(server)
  const target = `${server}/live/${id}/${seq}.ts`
  await doProxy(req, res, { target })
})

app.get('/:server/stream/:id/:rendition/:seq.ts', async (req, res) => {
  let { server, id, rendition, seq } = req.params
  server = decodeURIComponent(server)
  const target = `${server}/stream/${id}/${rendition}/${seq}.ts`
  await doProxy(req, res, { target })
})

app.listen(3012)
