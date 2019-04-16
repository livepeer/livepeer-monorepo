import express from 'express'
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import { LevelStore } from './store'
import path from 'path'

import endpoint from './endpoint'

export default async function makeApp(opts) {
  const store = new LevelStore({ dataDir: opts.store })
  const app = express()
  app.use(morgan('dev'))
  app.use(jsonParser())
  app.use((req, res, next) => {
    req.store = store
    next()
  })

  app.use('/endpoints', endpoint)

  let listener
  let port

  await new Promise(resolve => {
    listener = app.listen(opts.port, () => {
      port = listener.address().port
      console.log(`API server listening on ${port}`)
      resolve()
    })
  })

  const close = async () => {
    listener.close()
    await store.close()
  }
  return { app, listener, port, close, store }
}

if (!module.parent) {
  makeApp({
    port: process.env.PORT || 3004,
    store: process.env.DATA_DIR || path.resolve(__dirname, '..', 'data'), // TODO FIXME
  })
}
