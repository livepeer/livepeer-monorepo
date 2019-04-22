import express from 'express'
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import { LevelStore } from './store'
import path from 'path'
import logger from './logger'
import endpoint from './endpoint'

export default async function makeApp(opts) {
  const store = new LevelStore({ dbPath: opts.dbPath })
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

  await new Promise((resolve, reject) => {
    listener = app.listen(opts.port, err => {
      if (err) {
        logger.error('Error starting server', err)
        return reject(err)
      }
      port = listener.address().port
      logger.info(`API server listening on ${port}`)
      resolve()
    })
  })

  const close = async () => {
    listener.close()
    await store.close()
  }
  return { app, listener, port, close, store }
}

process.on('unhandledRejection', err => {
  // Will print "unhandledRejection err is not defined"
  logger.error('fatal, unhandled promise rejection', err)
  process.exit(1)
})
