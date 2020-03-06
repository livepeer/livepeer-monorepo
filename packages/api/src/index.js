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
import streamProxyOS from './controllers/stream-proxy-os'
import liveProxy from './controllers/live-proxy'
import proxy from 'http-proxy-middleware'
import appRouter from './app-router'

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

  const { router, store } = await appRouter(params)
  const app = express()
  app.use(morgan('combined'))
  app.use(jsonParser())
  app.use(router)

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
