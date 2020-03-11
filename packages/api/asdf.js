const {
  Request,
  Response,
  fetch,
  Headers,
  freezeHeaders,
  bindCfProperty,
} = require('@dollarshaveclub/cloudworker/lib/runtime/fetch')
const {
  URL,
  URLSearchParams,
} = require('@dollarshaveclub/cloudworker/lib/runtime/url')
const {
  ReadableStream,
  WritableStream,
  TransformStream,
} = require('@dollarshaveclub/cloudworker/lib/runtime/stream')
const {
  FetchEvent,
} = require('@dollarshaveclub/cloudworker/lib/runtime/fetch-event')
const { crypto } = require('@dollarshaveclub/cloudworker/lib/runtime/crypto')
const {
  TextDecoder,
  TextEncoder,
} = require('@dollarshaveclub/cloudworker/lib/runtime/text-encoder')
const {
  atob,
  btoa,
} = require('@dollarshaveclub/cloudworker/lib/runtime/base64')
const {
  FunctionProxy,
} = require('@dollarshaveclub/cloudworker/lib/runtime/function')

this.self = this
this.setTimeout = setTimeout
this.clearTimeout = clearTimeout
this.setInterval = setInterval
this.clearInterval = clearInterval
// this.addEventListener = addEventListener
this.fetch = fetch
this.Request = Request
this.Response = Response
this.Headers = Headers
this.URL = URL
this.URLSearchParams = URLSearchParams
this.ReadableStream = ReadableStream
this.WritableStream = WritableStream
this.TransformStream = TransformStream
this.FetchEvent = FetchEvent
// this.caches = cacheFactory
this.crypto = crypto
this.TextDecoder = TextDecoder
this.TextEncoder = TextEncoder
this.atob = atob
this.btoa = btoa

addEventListener('fetch', event => {
  console.log('fetch event')
  throw new Error('what')
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    return new Response('Hello worker!', {
      headers: { 'content-type': 'text/plain' },
    })
  } catch (e) {
    console.log('error')
    console.log(e)
  }
}
