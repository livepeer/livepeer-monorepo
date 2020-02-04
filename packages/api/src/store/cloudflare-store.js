import logger from '../logger'
import fetch from 'isomorphic-fetch'
import { parse as parseUrl, format as stringifyUrl } from 'url'
import querystring from 'querystring'
import { NotFoundError } from './errors'

const CLOUDFLARE_URL = 'https://api.cloudflare.com/client/v4/accounts'
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

    const reqUrl = `${CLOUDFLARE_URL}/${accountId}/storage/kv/namespaces/${namespace}/keys?${params}`
    const respData = await cloudflareFetch(reqUrl)

    const values = []
    for (let i = 0; i < respData.result.length; i++) {
      const reqUrl = `${CLOUDFLARE_URL}/${accountId}/storage/kv/namespaces/${namespace}/values/${respData.result[i].name}`
      const resp = await cloudflareFetch(reqUrl)
      await sleep(200)
      values.push(resp)
    }

    return { data: values, cursor: respData.result_info.cursor }
  }

  async get(value) {
    const reqUrl = `${CLOUDFLARE_URL}/${accountId}/storage/kv/namespaces/${namespace}/values/${value}`
    const respData = await cloudflareFetch(reqUrl)

    return respData
  }

  async create(data) {
    const { id, kind } = data

    if (!id || !kind) {
      throw new Error("object missing 'id' and/or 'kind'")
    }

    const key = `${kind}/${id}`
    const reqUrl = `${CLOUDFLARE_URL}/${accountId}/storage/kv/namespaces/${namespace}/values/${key}`
    const respData = await cloudflareFetch(reqUrl, {
      data: data,
      method: 'PUT',
      retries: 0,
    })
    return respData
  }

  async replace(data) {
    const { id, kind } = data

    if (!id || !kind) {
      throw new Error("object missing 'id' and/or 'kind'")
    }
    const key = `${kind}/${id}`
    const reqUrl = `${CLOUDFLARE_URL}/${accountId}/storage/kv/namespaces/${namespace}/values/${key}`
    const resp = await cloudflareFetch(reqUrl, {
      data: data,
      method: 'PUT',
      retries: 0,
    })
    if (!resp) {
      throw new NotFoundError()
    }
  }

  async delete(id) {
    const reqUrl = `${CLOUDFLARE_URL}/${accountId}/storage/kv/namespaces/${namespace}/values/${id}`
    const resp = await cloudflareFetch(reqUrl, {
      data: null,
      method: 'DELETE',
      retries: 0,
    })
    if (!resp) {
      throw new NotFoundError()
    }
  }
}

async function cloudflareFetch(
  reqUrl,
  { method = 'GET', retries = 0, data = null } = {},
) {
  const req = {
    method: method,
    headers: {
      authorization: `Bearer ${auth}`,
    },
  }
  if (data) {
    req.body = JSON.stringify(data)
  }

  const res = await fetch(reqUrl, req)
  const respData = await res.json()

  if (res.status != 200) {
    const errorMessage = `Cloudflare ${res.status} error: ${
      res.statusText
    }, error_messages: ${JSON.stringify(respData.errors)}`
    console.log(errorMessage)

    if (res.status == 404) {
      return null
    } else if (res.status == 429) {
      console.log('Sleeping for 3 seconds')
      await sleep(3000)
      if (retries < retryLimit) {
        retries++
        await cloudflareFetch(reqUrl, {
          data: data,
          method: method,
          retries: retries,
        })
      } else {
        throw new Error(errorMessage)
      }
    }

    return respData
  }

  return respData
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
