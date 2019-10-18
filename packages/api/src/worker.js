/**
 * Entrypoint for our CloudFlare worker. Eventually will have bits of the API compiled into it, for now it's
 * just separate.
 */
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

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

/**
 * Serve a static asset or 404
 */
async function serveStaticAsset(event) {
  try {
    return await getAssetFromKV(event)
  } catch (e) {
    const newEvent = { ...event }
    let pathname = new URL(event.request.url).pathname
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: 'not found',
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
  // Serve the front-end to non-api stuff
  if (!startsWithApiPrefix(url.pathname)) {
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
