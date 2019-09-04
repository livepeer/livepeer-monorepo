import express, { Router } from 'express'
import 'express-async-errors' // it monkeypatches, i guess
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import { LevelStore, PostgresStore } from './store'
import { healthCheck, authMiddleware } from './middleware'
import logger from './logger'
import schema from './schema'
import * as controllers from './controllers'
import * as k8s from '@kubernetes/client-node'

export default async function makeApp({
  storage,
  dbPath,
  httpPrefix,
  port,
  postgresUrl,
  listen = true,
  kubeNamespace,
  kubeBroadcasterService,
}) {
  // Storage init
  let store
  if (storage === 'level') {
    store = new LevelStore({ dbPath })
  } else if (storage === 'postgres') {
    store = new PostgresStore({ postgresUrl })
  }
  await store.ready

  // Logging, JSON parsing, store injection
  const app = express()
  app.use(healthCheck)
  app.use(morgan('combined'))
  app.use(jsonParser())
  app.use((req, res, next) => {
    req.store = store
    next()
  })

  app.use('/authtoken', authMiddleware)

  if (kubeNamespace && kubeBroadcasterService) {
    const kc = new k8s.KubeConfig()
    kc.loadFromDefault()

    const kubeApi = kc.makeApiClient(k8s.CoreV1Api)
    app.use((req, res, next) => {
      req.kubeApi = kubeApi
      req.kubeNamespace = kubeNamespace
      req.kubeBroadcasterService = kubeBroadcasterService
      next()
    })
  }

  // Add a controller for each route at the /${httpPrefix} route
  const prefixRouter = Router()
  for (const [name, controller] of Object.entries(controllers)) {
    prefixRouter.use(`/${name}`, controller)
  }
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
    process.off('SIGTERM', sigterm)
    listener.close()
    await store.close()
  }

  // Handle SIGTERM gracefully. It's polite, and Kubernetes likes it.
  const sigterm = handleSigterm(close)
  process.on('SIGTERM', sigterm)

  // If we throw any errors with numerical statuses, use them.
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
  logger.error('fatal, unhandled promise rejection: ', err)
  err.stack && logger.error(err.stack)
  // process.exit(1)
})

const handleSigterm = close => async () => {
  // Handle SIGTERM gracefully. It's polite, and Kubernetes likes it.
  logger.info('Got SIGTERM. Graceful shutdown start')
  let timeout = setTimeout(() => {
    logger.warn("Didn't gracefully exit in 5s, forcing")
    process.exit(1)
  }, 5000)
  try {
    await close()
  } catch (err) {
    logger.error('Error closing store', err)
    process.exit(1)
  }
  clearTimeout(timeout)
  logger.info('Graceful shutdown complete, exiting cleanly')
  process.exit(0)
}
