import fetch from 'isomorphic-fetch'
import { generateJWT } from './firestore-helpers'
import * as qs from 'query-string'

const HARD_CONFIG = require('./config.secret.json')

const DEFAULT_LIMIT = 100

export default class FirestoreStore {
  constructor({} = {}) {
    this.config = HARD_CONFIG
    this.url = this.config.url
    this.collection = 'staging'
  }

  async authHeaders() {
    let token = await generateJWT(this.config)
    return { Authorization: `Bearer ${token}` }
  }

  // Firestore's paths work like: collection/document/collection/document. So we can't store at,
  // say, /staging/user/ABC123; we have to store at /staging/docs/user/ABC123
  // or useremails/eli@livepeer.org/ABC123 becomes /staging/docs/useremail/docs/eli@livepeer.org/ABC123
  getPath(key) {
    const parts = [this.collection, ...key.split('/')]
    const docId = parts.pop()
    const lastColl = parts.pop()
    const output = []
    for (const part of parts) {
      output.push(part, 'docs')
    }
    output.push(lastColl, docId)
    return output.join('/')
  }

  async get(key) {
    let headers = await this.authHeaders()
    const res = await fetch(`${this.url}/${this.collection}/${key}`, {
      headers,
    })
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
    let headers = await this.authHeaders()
    const fields = {
      id: {
        stringValue: key,
      },
      data: {
        stringValue: JSON.stringify(data),
      },
    }
    const url = `${this.url}/${this.collection}/${key}`
    const res = await fetch(url, {
      headers,
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
    let headers = await this.authHeaders()
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
    const res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        fields,
      }),
    })
    if (res.status !== 200) {
      throw new Error(await res.text())
    }
  }

  // Helper for list() and listKeys()
  async doList(prefix = '', cursor = null, limit = DEFAULT_LIMIT) {
    let headers = await this.authHeaders()
    const query = {
      orderBy: 'id',
      pageSize: limit,
    }
    if (cursor) {
      query.pageToken = cursor
    }
    const path = this.getPath(prefix)
    const url = `${this.url}/${path}/${prefix}?${qs.stringify(query)}`
    const res = await fetch(url, {
      headers,
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
    const keyPrefix =
      'projects/livepeerjs-231617/databases/(default)/documents/staging/'
    const data = results.map(doc => {
      return doc.name.slice(keyPrefix.length)
    })
    return [data, nextPageToken]
  }

  async delete(key) {
    let headers = await this.authHeaders()
    const path = this.getPath(key)
    const res = await fetch(`${this.url}/${path}`, {
      headers,
      method: 'DELETE',
    })
    if (res.status !== 200) {
      throw new Error(await res.text())
    }
  }

  async close() {}
}
