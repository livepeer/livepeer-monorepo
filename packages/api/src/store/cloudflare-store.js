import logger from '../logger'
import { NotFoundError } from './errors'
import fetch from 'isomorphic-fetch'
import { parse as parseUrl, format as stringifyUrl } from 'url'

const querystring = require('querystring')
const cloudflareUrl = 'https://api.cloudflare.com/client/v4/accounts'
const DEFAULT_LIMIT = 10
const retryLimit = 3
let namespace
let accountId
let auth

export default class CloudflareStore {
  constructor({ cloudflareNamespace, cloudflareAccount, cloudflareAuth }) {
    if (!cloudflareNamespace || !cloudflareAccount || !cloudflareAuth) {
      throw new Error(
        'no cloudflare namespace, account id, or authorization key provided',
      )
    }
    namespace = cloudflareNamespace
    accountId = cloudflareAccount
    auth = cloudflareAuth
  }

  async list(prefix = '', cursor = null, limit = DEFAULT_LIMIT) {
    const params = querystring.stringify({
      limit: limit,
      prefix: prefix,
      cursor: cursor,
    })

    const reqUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/keys?${params}`
    const respData = await cloudFlareFetch(reqUrl, null, 'GET', 0)

    const values = []
    var i
    for (i = 0; i < respData.result.length; i++) {
      const reqUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${
        respData.result[i].name
      }`
      const resp = await cloudFlareFetch(reqUrl, null, 'GET', 0)
      await sleep(200)
      values.push(resp)
    }

    return { data: values, cursor: respData.result_info.cursor }
  }

  async get(value) {
    const reqUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${value}`
    const respData = await cloudFlareFetch(reqUrl, null, 'GET', 0)

    return respData
  }

  async create(data) {
    const { id, kind } = data

    if (!id || !kind) {
      throw new Error("object missing 'id' and/or 'kind'")
    }

    const key = `${kind}/${id}`
    const reqUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${key}`
    const respData = await cloudFlareFetch(reqUrl, data, 'PUT', 0)

    return respData
  }

  async replace(data) {
    const { id, kind } = data

    if (!id || !kind) {
      throw new Error("object missing 'id' and/or 'kind'")
    }
    const key = `${kind}/${id}`
    const reqUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${key}`
    const respData = await cloudFlareFetch(reqUrl, data, 'PUT', 0) // can we not declare?
  }

  async delete(id) {
    const reqUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${id}`
    const respData = await cloudFlareFetch(reqUrl, null, 'DELETE', 0)
  }
}

async function cloudFlareFetch(reqUrl, data, method, retries) {
  const req = {
    method: method,
    headers: {
      authorization: `${auth}`,
    },
  }
  if (data) {
    req.body = JSON.stringify(data)
  }

  const res = await fetch(reqUrl, req)
  const respData = await res.json()
  const errorMessage = `Cloudflare ${res.status} error: ${
    res.statusText
  }, error_messages: ${JSON.stringify(respData.errors)}`

  if (res.status != 200) {
    console.log(errorMessage)

    if (res.status == 404) {
      throw new NotFoundError()
    } else if (res.status == 429) {
      console.log('Sleeping for 3 seconds')
      await sleep(3000)
      if (retries < retryLimit) {
        retries++
        await cloudFlareFetch(reqUrl, data, method, retries)
      }
    } else {
      throw new Error(errorMessage)
    }
  }

  return respData
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
