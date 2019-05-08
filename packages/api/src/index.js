import express, { Router } from 'express'
import 'express-async-errors' // it monkeypatches, i guess
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import { LevelStore, PostgresStore } from './store'
import logger from './logger'
import ingress from './ingress'
import stream from './stream'
import Ajv from 'ajv'
import schema from './schema'

export default async function makeApp({
  storage,
  dbPath,
  httpPrefix,
  port,
  postgresUrl,
  listen = true,
}) {
  const ajv = new Ajv()
  let store
  if (storage === 'level') {
    store = new LevelStore({ dbPath })
  } else if (storage === 'postgres') {
    store = new PostgresStore({ postgresUrl })
  }
  const app = express()
  app.use(morgan('dev'))
  app.use(jsonParser())
  const prefixRouter = Router()
  const validators = {}
  const routes = { ingress, stream }
  for (const [name, route] of Object.entries(routes)) {
    validators[name] = ajv.compile(schema.components.schemas[name])
    prefixRouter.use(`/${name}`, route)
  }
  app.use((req, res, next) => {
    req.store = store
    req.validators = validators
    next()
  })

  // prefixRouter.use('/endpoint', endpoint)
  // prefixRouter.use('/stream', stream)
  app.use(httpPrefix, prefixRouter)

  let listener
  let listenPort

  if (listen) {
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
  }

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

  app.use((err, req, res, next) => {
    if (typeof err.status === 'number') {
      res.status(err.status)
      res.json({ errors: [err.message] })
    }

    next(err)
  })

  return { app, listener, port: listenPort, close, store }
}

process.on('unhandledRejection', err => {
  logger.error('fatal, unhandled promise rejection', err)
  err.stack && logger.error(err.stack)
  process.exit(1)
})
