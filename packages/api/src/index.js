import express, { Router } from 'express'
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import { LevelStore, PostgresStore } from './store'
import path from 'path'
import logger from './logger'
import endpoint from './endpoint'
import stream from './stream'
import winston from 'winston'

export default async function makeApp({
  storage,
  dbPath,
  httpPrefix,
  port,
  postgresUrl,
}) {
  let store
  if (storage === 'level') {
    store = new LevelStore({ dbPath })
  } else if (storage === 'postgres') {
    store = new PostgresStore({ postgresUrl })
  }
  const app = express()
  app.use(morgan('dev'))
  app.use(jsonParser())
  app.use((req, res, next) => {
    req.store = store
    next()
  })

  const prefixRouter = Router()
  prefixRouter.use('/endpoint', endpoint)
  prefixRouter.use('/stream', stream)
  app.use(httpPrefix, prefixRouter)

  let listener
  let listenPort

  await new Promise((resolve, reject) => {
    listener = app.listen(port, err => {
      if (err) {
        logger.error('Error starting server', err)
        return reject(err)
      }
      listenPort = listener.address().port
      logger.info(
        `API server listening on http://0.0.0.0:${listenPort}${httpPrefix}`,
      )
      resolve()
    })
  })

  const close = async () => {
    listener.close()
    await store.close()
  }

  // Handle SIGTERM gracefully. It's polite, and Kubernetes likes it.
  process.on('SIGTERM', async function onSigterm() {
    logger.info('Got SIGTERM. Graceful shutdown start')
    let timeout = setTimeout(() => {
      logger.warn("Didn't gracefully exit in 5s, forcing")
      process.exit(1)
    }, 5000)
    try {
      await Promise.all([store.close(), new Promise(r => listener.close(r))])
    } catch (err) {
      logger.error('Error closing store', err)
      process.exit(1)
    }
    clearTimeout(timeout)
    logger.info('Graceful shutdown complete, exiting cleanly')
    process.exit(0)
  })

  // Health check. This one is basically just here for Kubernetes, but that's okay.
  const healthcheck = (req, res) => {
    res.status(200)
    // idk, say something cheerful to the health checker
    res.json({ ok: true })
  }
  app.get('/healthz', healthcheck)
  app.get('/', healthcheck)

  return { app, listener, port: listenPort, close, store }
}

process.on('unhandledRejection', err => {
  // Will print "unhandledRejection err is not defined"
  logger.error('fatal, unhandled promise rejection', err)
  process.exit(1)
})
