import isoFetch from 'isomorphic-fetch'

/**
 * Clear the entire database! Not to be used outside of tests
 */
export async function clearDatabase(server) {
  let [keys] = await server.store.listKeys('', undefined, undefined, false)
  for (const key of keys) {
    await server.store.deleteKey(key)
  }
}

export class TestClient {
  constructor(opts) {
    if (!opts.server) {
      throw new Error('TestClient missing server')
    }

    this.server = opts.server

    if (opts.apiKey) {
      this.apiKey = opts.apiKey
    }

    if (opts.googleAuthorization) {
      this.googleAuthorization = opts.googleAuthorization
    }
  }

  async fetch(path, args = {}) {
    let headers = args.headers || {}
    if (this.apiKey) {
      headers = {
        ...headers,
        authorization: `Bearer ${this.apiKey}`,
      }
    }
    if (this.jwtAuth) {
      headers = {
        ...headers,
        authorization: `JWT ${this.jwtAuth}`,
      }
    }
    const res = await isoFetch(
      `${this.server.host}${this.server.httpPrefix}${path}`,
      {
        ...args,
        headers,
      },
    )
    if (res.status === 500) {
      const text = await res.text()
      throw new Error(`500 ${text}`)
    }
    return res
  }

  async get(path) {
    return await this.fetch(path, { method: 'GET' })
  }

  async post(path, data) {
    const params = {
      method: 'POST',
    }
    if (data) {
      params.headers = {
        'content-type': 'application/json',
      }
      params.body = JSON.stringify(data)
    }
    return await this.fetch(path, params)
  }
}
