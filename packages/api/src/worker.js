/**
 * Entrypoint for our CloudFlare worker. Eventually will have bits of the API compiled into it, for now it's
 * just separate.
 */
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import composeM3U8 from './controllers/compose-m3u8'

/**
 * maps the path of incoming request to the request pathKey to look up
 * in bucket and in cache
 * e.g.  for a path '/' returns '/index.html' which serves
 * the content of bucket/index.html
 * @param {Request} request incoming request
 */
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
  let servers = [
    'esh-staging.livepeer-staging.live',
    'mcw-staging.livepeer-staging.live',
  ]
  if (url.hostname === 'livepeer.live') {
    servers = ['esh.livepeer.live', 'mcw.livepeer.live']
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

// Similar to amalgamate, but for m3u8 files instead of JSON.
const amalgamateM3U8 = async req => {
  const url = req.url
  const { servers } = await geolocate(url)
  const composed = composeM3U8(
    servers.map(server => {
      const newUrl = new URL(req.url)
      newUrl.hostname = server
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

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleEvent(event) {
  const req = event.request
  const url = new URL(req.url)
  if (url.hostname.startsWith('docs.')) {
    if (url.pathname === '/') {
      return fetch('http://docs.livepeer.live/index.html')
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
