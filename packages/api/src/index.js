import express, { Router } from 'express'
import 'express-async-errors' // it monkeypatches, i guess
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import bearerToken from 'express-bearer-token'
import { LevelStore, PostgresStore, CloudflareStore } from './store'
import { healthCheck, kubernetes, hardcodedNodes } from './middleware'
import logger from './logger'
import * as controllers from './controllers'
import streamProxy from './controllers/stream-proxy'
import liveProxy from './controllers/live-proxy'
import proxy from 'http-proxy-middleware'

export default async function makeApp(params) {
  const {
    storage,
    dbPath,
    httpPrefix,
    port,
    postgresUrl,
    cloudflareNamespace,
    cloudflareAccount,
    cloudflareAuth,
    listen = true,
    clientId,
    trustedDomain,
    kubeNamespace,
    kubeBroadcasterService,
    kubeBroadcasterTemplate,
    kubeOrchestratorService,
    kubeOrchestratorTemplate,
    fallbackProxy,
    orchestrators,
    broadcasters,
    s3Url,
    s3UrlExternal,
    s3Access,
    s3Secret,
    upstreamBroadcaster,
  } = params
  // Storage init
  let store
  if (storage === 'level') {
    store = new LevelStore({ dbPath })
  } else if (storage === 'postgres') {
    store = new PostgresStore({ postgresUrl })
  } else if (storage === 'cloudflare') {
    store = new CloudflareStore({
      cloudflareNamespace,
      cloudflareAccount,
      cloudflareAuth,
    })
  }
  await store.ready

  // Logging, JSON parsing, store injection
  const app = express()
  app.use(healthCheck)
  app.use(morgan('combined'))
  if (s3Url && s3Access && s3Secret) {
    app.use(
      '/live',
      liveProxy({
        s3Url,
        s3Access,
        s3Secret,
        upstreamBroadcaster,
        s3UrlExternal,
      }),
    )
  }
  app.use(jsonParser())
  app.use((req, res, next) => {
    req.store = store
    req.config = params
    next()
  })
  app.use(bearerToken())

  // Populate Kubernetes getOrchestrators and getBroadcasters is provided
  if (kubeNamespace) {
    app.use(
      kubernetes({
        kubeNamespace,
        kubeBroadcasterService,
        kubeOrchestratorService,
        kubeBroadcasterTemplate,
        kubeOrchestratorTemplate,
      }),
    )
  } else {
    app.use(hardcodedNodes({ orchestrators, broadcasters }))
  }

  // Add a controller for each route at the /${httpPrefix} route
  const prefixRouter = Router()
  for (const [name, controller] of Object.entries(controllers)) {
    prefixRouter.use(`/${name}`, controller)
  }
  app.use(httpPrefix, prefixRouter)
  // Special case: handle /stream proxies off that endpoint
  app.use('/stream', streamProxy)

  prefixRouter.get('/google-client', async (req, res, next) => {
    res.json({ clientId: req.config.clientId })
  })

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

  // This far down, this would otherwise be a 404... hit up the fallback proxy if we have it.
  // Mostly this is used for proxying to the Next.js server in development.
  if (fallbackProxy) {
    app.use(proxy({ target: fallbackProxy, changeOrigin: true }))
  }

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
