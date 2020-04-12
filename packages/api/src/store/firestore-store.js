import fetch from 'isomorphic-fetch'
import { generateJWT, prepareConfig } from './firestore-helpers'
import * as qs from 'query-string'

const DEFAULT_LIMIT = 100

export default class FirestoreStore {
  constructor({ firestoreCredentials, firestoreCollection }) {
    if (!firestoreCredentials) {
      throw new Error('missing --firestore-credentials')
    }
    if (!firestoreCollection) {
      throw new Error('missing --firestore-collection')
    }
    this.config = prepareConfig(firestoreCredentials)
    this.url = this.config.url
    this.collection = firestoreCollection
    // Key prefix for stripping out in list operations
    this.keyPrefix = `${this.config.docsPath}/docs/${firestoreCollection}/`
    this.token = null
    this.tokenExpires = 0
  }

  // Firestore's paths work like: collection/document/collection/document. So we can't store at,
  // say, /staging/user/ABC123; we have to store at /staging/docs/user/ABC123
  // For our join keys, we store e.g. `user+email/example@livepeer.org/ABC123` at `user+email_example@livepeer.org/ABC123`.
  getPath(key) {
    const parts = [...key.split('/')].filter(x => !!x)
    if (parts[0] && parts[0].includes('+')) {
      parts[1] = `${parts[0]}_${parts[1]}`
      parts.shift()
    }
    return [this.collection, 'docs', ...parts].join('/')
  }

  async fetch(url, opts = {}) {
    // Regenerate token if it's within a minute of expiring
    if (this.tokenExpires - 60000 < Date.now()) {
      const [token, expiry] = generateJWT(this.config)
      this.token = token
      this.tokenExpires = expiry
    }
    opts.headers = opts.headers || {}
    opts.headers.authorization = `Bearer ${this.token}`
    opts.method = opts.method || 'GET'
    const res = await fetch(url, opts)
    console.log(`${res.status} ${opts.method} ${url}`)
    return res
  }

  async get(key) {
    const path = this.getPath(key)
    const res = await this.fetch(`${this.url}/${path}`)
    if (res.status === 404) {
      return null
    } else if (res.status !== 200) {
      throw new Error(await res.text())
    }
    const text = await res.text()
    const doc = JSON.parse(text)
    if (!doc.fields) {
      return null
    }
    return JSON.parse(doc.fields.data.stringValue)
  }

  async replace(key, data) {
    const fields = {
      id: {
        stringValue: key,
      },
      data: {
        stringValue: JSON.stringify(data),
      },
    }
    const url = `${this.url}/${this.getPath(key)}`
    const res = await this.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({
        fields,
      }),
    })
    if (res.status !== 200) {
      throw new Error(await res.text())
    }
  }

  async create(key, data) {
    const fields = {
      id: {
        stringValue: key,
      },
      data: {
        stringValue: JSON.stringify(data),
      },
    }
    const path = this.getPath(key)
    const split = path.split('/')
    const documentId = split.pop()
    const collectionId = split.join('/')
    const query = qs.stringify({ documentId })
    const url = `${this.url}/${collectionId}?${query}`
    const res = await this.fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        fields,
      }),
    })
    if (res.status !== 200) {
      throw new Error(await res.text())
    }
  }

  // Only needed for the test harness so it's a little hacky
  async listWholeDatabase() {
    const path = this.getPath('')
    const url = `${this.url}/${path}:listCollectionIds`
    const res = await this.fetch(url, { method: 'POST' })
    const data = await res.json()
    const output = []
    for (const record of data.collectionIds) {
      const [docs] = await this.doList(record)
      output.push(...docs)
    }
    return [output, null]
  }

  // Helper for list() and listKeys()
  async doList(prefix = '', cursor = null, limit = DEFAULT_LIMIT) {
    if (prefix === '') {
      return this.listWholeDatabase()
    }
    const query = {
      orderBy: 'id',
      pageSize: limit,
    }
    if (cursor) {
      query.pageToken = cursor
    }
    const path = this.getPath(prefix)
    const url = `${this.url}/${path}?${qs.stringify(query)}`
    const res = await this.fetch(url, {
      method: 'GET',
    })
    if (res.status === 404) {
      return [[], null]
    } else if (res.status !== 200) {
      throw new Error(await res.text())
    }
    const data = await res.json()
    let { documents, nextPageToken } = data
    // Firestore doesn't even return the key if there's nothing
    if (!documents) {
      documents = []
    }
    return [documents, nextPageToken]
  }

  async list(prefix, cursor, limit) {
    const [results, nextPageToken] = await this.doList(prefix, cursor, limit)
    const data = results.map(doc => {
      return JSON.parse(doc.fields.data.stringValue)
    })
    return {
      data,
      cursor: nextPageToken,
    }
  }

  async listKeys(prefix, cursor, limit) {
    const [results, nextPageToken] = await this.doList(prefix, cursor, limit)
    const data = results.map(doc => {
      return doc.name.slice(this.keyPrefix.length)
    })
    return [data, nextPageToken]
  }

  async delete(key) {
    const path = this.getPath(key)
    const res = await this.fetch(`${this.url}/${path}`, {
      method: 'DELETE',
    })
    if (res.status !== 200) {
      throw new Error(await res.text())
    }
  }

  async close() {}
}
