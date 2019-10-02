import isoFetch from 'isomorphic-fetch'

/**
 * Clear the entire database! Not to be used outside of tests
 */
export async function clearDatabase(server) {
  let output = await server.store.list()
  for (const doc of output.data) {
    await server.store.delete(`${doc.kind}/${doc.id}`)
  }
}

export class TestClient {
  constructor(opts) {
    if (!opts.server) {
      throw new Error('TestClient missing server')
    }
    this.server = opts.server
    // same as apiKey , but with google token
    // here: https://jestjs.io/docs/en/manual-mocks.html#mocking-node-modules
    if (opts.apiKey) {
      this.apiKey = opts.apiKey
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
