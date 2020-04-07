import isoFetch from 'isomorphic-fetch'

/**
 * Clear the entire database! Not to be used outside of tests
 */
export async function clearDatabase(server) {
  let output = await server.store.list(undefined, undefined, undefined, false)
  for (const doc of output.data) {
    const key = Object.keys(doc)
    await server.store.deleteKey(key[0])
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

  fetch(path, args = {}) {
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
    return isoFetch(
      `http://localhost:${this.server.port}${this.server.httpPrefix}${path}`,
      {
        ...args,
        headers,
      },
    )
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
