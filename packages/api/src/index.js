import express, { Router } from 'express'
import 'express-async-errors' // it monkeypatches, i guess
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import bearerToken from 'express-bearer-token'
import { LevelStore, PostgresStore } from './store'
import { healthCheck } from './middleware'
import logger from './logger'
import * as controllers from './controllers'
import streamProxy from './controllers/stream-proxy'
import * as k8s from '@kubernetes/client-node'

export default async function makeApp(params) {
  const {
    storage,
    dbPath,
    httpPrefix,
    port,
    postgresUrl,
    listen = true,
    kubeNamespace,
    kubeBroadcasterService,
    kubeBroadcasterTemplate,
    kubeOrchestratorService,
    kubeOrchestratorTemplate,
  } = params
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
  app.use(bearerToken())

  // Populate Kubernetes stuff if present
  if (kubeNamespace && (kubeBroadcasterService || kubeOrchestratorService)) {
    const kc = new k8s.KubeConfig()
    kc.loadFromDefault()

    const kubeApi = kc.makeApiClient(k8s.CoreV1Api)
    app.use((req, res, next) => {
      req.kubeApi = kubeApi
      req.kubeNamespace = kubeNamespace
      req.kubeBroadcasterService = kubeBroadcasterService
      req.kubeOrchestratorService = kubeOrchestratorService
      req.kubeBroadcasterTemplate = kubeBroadcasterTemplate
      req.kubeOrchestratorTemplate = kubeOrchestratorTemplate
      next()
    })
  }

  // Add a controller for each route at the /${httpPrefix} route
  const prefixRouter = Router()
  for (const [name, controller] of Object.entries(controllers)) {
    prefixRouter.use(`/${name}`, controller)
  }
  app.use(httpPrefix, prefixRouter)
  // Special case: handle /stream proxies off that endpoint
  app.use('/stream', streamProxy)

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
    process.off('unhandledRejection', unhandledRejection)
    listener.close()
    await store.close()
  }

  // Handle SIGTERM gracefully. It's polite, and Kubernetes likes it.
  const sigterm = handleSigterm(close)

  process.on('SIGTERM', sigterm)

  const unhandledRejection = err => {
    logger.error('fatal, unhandled promise rejection: ', err)
    err.stack && logger.error(err.stack)
    sigterm()
  }
  process.on('unhandledRejection', unhandledRejection)

  // If we throw any errors with numerical statuses, use them.
  app.use((err, req, res, next) => {
    if (typeof err.status === 'number') {
      res.status(err.status)
      res.json({ errors: [err.message] })
    }

    next(err)
  })

  return {
    ...params,
    app,
    listener,
    port: listenPort,
    close,
    store,
  }
}

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
