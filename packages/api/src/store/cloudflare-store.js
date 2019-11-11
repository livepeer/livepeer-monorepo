import logger from '../logger'
import { NotFoundError } from './errors'
import fetch from 'isomorphic-fetch'
// import { timeout } from '../util'
import { parse as parseUrl, format as stringifyUrl } from 'url'

// const CONNECT_TIMEOUT = 5000
const DEFAULT_LIMIT = 10
const cloudflareUrl = 'https://api.cloudflare.com/client/v4/accounts'
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
    const requestUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/keys?limit=${limit}&prefix=${prefix}`
    const cursorParam = `&cursor=${cursor}`
    if (cursor) {
      requestUrl.concat(cursorParam)
    }

    const res = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        authorization: `${auth}`,
      },
    })

    const data = await res.json()
    checkStatus(res, data)
    return { data: data.result, cursor: data.result_info.cursor }
  }

  async get(value) {
    const requestUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${value}`
    const res = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: `${auth}`,
      },
    })

    const data = await res.json()
    checkStatus(res, data)
    return data
  }

  async create(data) {
    const { id, kind } = data

    if (!id || !kind) {
      throw new Error("object missing 'id' and/or 'kind'")
    }

    const key = `${kind}/${id}`
    const requestUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${key}`
    const res = await fetch(requestUrl, {
      method: 'PUT',
      headers: {
        Authorization: `${auth}`,
      },
      body: JSON.stringify(data),
    })

    data = await res.json()
    checkStatus(res, data)

    return data
  }

  async replace(data) {
    const { id, kind } = data

    if (!id || !kind) {
      throw new Error("object missing 'id' and/or 'kind'")
    }
    const key = `${kind}/${id}`
    const requestUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${key}`
    const res = await fetch(requestUrl, {
      method: 'PUT',
      headers: {
        authorization: `${auth}`,
      },
      body: JSON.stringify(data),
    })
    data = await res.json()
    checkStatus(res, data)
  }

  async delete(id) {
    const requestUrl = `${cloudflareUrl}/${accountId}/storage/kv/namespaces/${namespace}/values/${id}`
    const res = await fetch(requestUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `${auth}`,
      },
    })

    const data = await res.json()
    checkStatus(res, data)
  }
}

function checkStatus(res, data) {
  if (res.status < 500 && res.status >= 400) {
    console.log(
      `Cloudflare ${res.status} error: ${
        res.statusText
      }, error_messages: ${JSON.stringify(data.errors)}`,
    )
    throw new NotFoundError()
  }
  if (res.status < 200 || res.status > 300) {
    throw new Error(
      `Cloudflare ${res.status} error: ${
        res.statusText
      }, error_messages: ${JSON.stringify(data.errors)}`,
    )
  }
}
