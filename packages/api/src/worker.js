/**
 * Entrypoint for our CloudFlare worker.
 */

// First, some shims to polyfill expectations elsewhere...
process.hrtime = require('browser-process-hrtime')
self.setImmediate = (fn, ...args) => setTimeout(() => fn(...args), 0)

import 'express-async-errors' // it monkeypatches, i guess
import parseCli from './parse-cli.js'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import composeM3U8 from './controllers/compose-m3u8'
import appRouter from './app-router'
import workerSecrets from './worker-secrets.json'
import camelcase from 'camelcase'
import Router from 'express/lib/router'
import EE from 'wolfy87-eventemitter'

// Populate env with precompiled secrets for yargs
process.env = workerSecrets
const params = parseCli()
const routerPromise = appRouter(params)

// staging, prod, and dev sets of secrets
// env variables in a JSON blob, turn into file, import file as we're building worker
const mapRequestToAsset = request => {
  const parsedUrl = new URL(request.url)
  let pathname = parsedUrl.pathname
  if (pathname === '/') {
    pathname = 'index.html'
  } else {
    const lastSegment = pathname
      .split('/')
      .filter(x => !!x)
      .pop()

    // To handle next.js-style routes, we need to send e.g. /login to /login.html
    if (lastSegment && !lastSegment.includes('.')) {
      pathname = `${pathname}.html`
    }
  }

  parsedUrl.pathname = pathname
  return new Request(parsedUrl, request)
}

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

const API_PREFIXES = ['/stream', '/api', '/live']

const startsWithApiPrefix = pathname => {
  for (const prefix of API_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return true
    }
  }
  return false
}

const geolocate = async (url, first = false) => {
  // Sometimes comes in as a string? Normalize.
  url = new URL(url)
  let servers = [
    'esh-staging.livepeer-staging.live',
    'mcw-staging.livepeer-staging.live',
  ]
  if (url.hostname === 'livepeer.live') {
    servers = ['esh.livepeer.live', 'chi.livepeer-ac.live']
  }

  let smallestServer
  let smallestDuration = Infinity

  const promises = servers.map(async server => {
    const start = Date.now()
    const res = await fetch(`https://${server}/api`)
    const duration = Date.now() - start
    if (duration < smallestDuration) {
      smallestDuration = duration
      smallestServer = server
    }
    return {
      server,
      duration,
    }
  })
  let data
  if (first) {
    data = await Promise.race(promises)
  } else {
    data = await Promise.all(promises)
  }
  const ret = {
    chosenServer: smallestServer,
    servers: data,
  }
  return ret
}

// Combine a response from all the regions into one.
const amalgamate = async req => {
  const url = req.url
  const { servers } = await geolocate(url)
  let responses = await Promise.all(
    servers.map(async ({ server }) => {
      const newUrl = new URL(url)
      newUrl.hostname = server
      const newReq = new Request(newUrl, req)
      const serverRes = await fetch(newReq)
      const data = await serverRes.json()
      return data
    }),
  )
  let output
  if (responses.length === 0) {
    responses = [[]]
  } else if (Array.isArray(responses[0])) {
    output = responses.reduce((arr1, arr2) => arr1.concat(arr2), [])
  } else {
    // Object, assume all unique keys
    output = responses.reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {})
  }
  return new Response(JSON.stringify(output), {
    headers: {
      'content-type': 'application/json',
    },
  })
}

function headersAsObject(inputHeaders) {
  const headers = {}
  const keyVals = [...inputHeaders.entries()]
  keyVals.forEach(([key, val]) => {
    headers[key] = val
  })
  return headers
}

// Similar to amalgamate, but for m3u8 files instead of JSON.
const amalgamateM3U8 = async req => {
  const url = req.url
  const { servers } = await geolocate(url)
  const composed = await composeM3U8(
    servers.map(({ server }) => {
      const newUrl = new URL(req.url)
      newUrl.hostname = server
      newUrl.port = newUrl.protocol === 'https:' ? 443 : 80
      return newUrl.toString()
    }),
  )
  if (composed === null) {
    return new Response('not found', { status: 404 })
  }
  return new Response(composed, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'application/x-mpegurl',
    },
  })
}

/**
 * Serve a static asset or 404
 */
async function serveStaticAsset(event) {
  try {
    return await getAssetFromKV(event, { mapRequestToAsset })
  } catch (e) {
    let pathname = new URL(event.request.url).pathname
    return new Response(`"${pathname}" not found: ${e.message}`, {
      status: 404,
    })
  }
}

class ExpressRequest {
  constructor(args) {
    this.handlers = {}
    for (const [key, value] of Object.entries(args)) {
      this[key] = value
    }
  }

  on(name, fn) {
    if (!this.handlers[name]) {
      this.handlers[name] = []
    }
    this.handlers[name].push(fn)
  }

  emit(name, ...args) {
    if (!this.handlers[name]) {
      return
    }
    for (const fn of this.handlers[name]) {
      fn(...args)
    }
  }

  removeListener(name, fn) {
    this.handlers[name] = this.handlers[name].filter(x => x !== fn)
  }

  listeners(name) {
    return this.handlers[name]
  }

  resume() {}
}

class ExpressResponse {
  constructor(args) {
    this.headers = {}
    for (const [key, value] of Object.entries(args)) {
      this[key] = value
    }
  }

  links(links) {
    var link = this.get('Link') || ''
    if (link) link += ', '
    return this.set(
      'Link',
      link +
        Object.keys(links)
          .map(function(rel) {
            return '<' + links[rel] + '>; rel="' + rel + '"'
          })
          .join(', '),
    )
  }

  get(key) {
    return this.headers[key]
  }

  set(key, value) {
    this.headers[key] = value
  }
}

/**
 * Fetch and log a request
 * @param {Request} request
 */

async function expressRequest(cfReq, router) {
  const buf = Buffer.from(await cfReq.arrayBuffer())
  return new Promise((resolve, reject) => {
    let status = 200
    const { pathname, searchParams } = new URL(cfReq.url)
    const req = new ExpressRequest({
      url: pathname,
      query: headersAsObject(searchParams),
      path: pathname,
      params: pathname.split('/').filter(x => x),
      protocol: 'http',
      method: cfReq.method,
      headers: headersAsObject(cfReq.headers),
      get: header => cfReq.headers[header],
    })
    const res = new ExpressResponse({
      status: stat => {
        status = stat
      },
      json: jsonObj => {
        resolve(
          new Response(JSON.stringify(jsonObj), {
            status: status,
            headers: res.headers,
          }),
        )
      },
    })

    router(req, res, err => {
      if (!err) {
        res.status(404)
        res.json({ errors: ['not found'] })
      } else {
        res.status(500)
        res.json({ errors: [err.message || err] })
      }
    })

    setTimeout(() => {
      req.emit('data', buf)
      req.emit('end')
      setImmediate(() => {
        req.emit('close')
      })
    }, 10)
  })
}
async function handleEvent(event) {
  const req = event.request

  try {
    const { router, store } = await routerPromise
    return await expressRequest(req, router)
  } catch (error) {
    console.log(error)
    return new Response('error', { status: 500 })
  }

  const url = new URL(req.url)
  if (url.hostname.startsWith('docs.')) {
    if (url.pathname === '/') {
      return fetch('http://docs.livepeer.live/index.html')
    }
  }
  if (url.pathname.startsWith('/.well-known')) {
    try {
      const newReq = new Request(req.url, {
        headers: req.headers,
        cf: { resolveOverride: 'mcw-command.livepeer-staging.live' },
      })
      return fetch(newReq)
    } catch (err) {
      console.log(err)
      return new Response(err.stack, { status: 500 })
    }
  }
  if (url.hostname.startsWith('build.')) {
    return fetch(req)
  }
  if (url.pathname === '/api/geolocate') {
    const data = await geolocate(url, false)
    const res = new Response(JSON.stringify(data, null, 2), {
      headers: { 'content-type': 'application/json' },
    })
    return res
  }
  if (url.pathname === '/test.mp4') {
    return Response.redirect(
      'https://storage.googleapis.com/lp_testharness_assets/official_test_source_2s_keys_24pfs.mp4',
      302,
    )
  }
  if (url.pathname.startsWith('/api/broadcaster/status')) {
    return amalgamate(req)
  }
  if (url.pathname.startsWith('/stream')) {
    return amalgamateM3U8(req)
  }
  if (!startsWithApiPrefix(url.pathname)) {
    // Serve the front-end to non-api stuff
    if (url.protocol === 'http:') {
      return Response.redirect(`https://${url.hostname}${url.pathname}`, 302)
    }
    return serveStaticAsset(event)
  }
  const newUrl = new URL(req.url)
  const { chosenServer } = await geolocate(url, true)
  newUrl.hostname = chosenServer
  newUrl.protocol = 'https:'
  newUrl.port = 443
  const newRequest = new Request(newUrl.toString(), new Request(req))
  return fetch(newRequest)
}

console.log('Worker started.')
