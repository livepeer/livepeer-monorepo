import Router from 'express/lib/router'
import 'express-async-errors' // it monkeypatches, i guess
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import bearerToken from 'express-bearer-token'
import { LevelStore, PostgresStore, CloudflareStore } from './store'
import { healthCheck, kubernetes, hardcodedNodes } from './middleware'
import logger from './logger'
import * as controllers from './controllers'
import streamProxy from './controllers/stream-proxy'
import proxy from 'http-proxy-middleware'

export default async function makeApp(params) {
  const {
    storage,
    dbPath,
    httpPrefix = '/api',
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
    orchestrators = '[]',
    broadcasters = '[]',
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
  } else {
    throw new Error('MISSING STORAGE!!!!')
  }
  await store.ready

  // Logging, JSON parsing, store injection

  const app = Router()
  app.use(healthCheck)
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
  const prefixRouter = Router() // "AMALGAMATES our endpoints together" and serves them out
  for (const [name, controller] of Object.entries(controllers)) {
    prefixRouter.use(`/${name}`, controller)
  }
  // app.use to different file. THEN translation compatibility ... res.json()
  app.use(httpPrefix, prefixRouter)
  // Special case: handle /stream proxies off that endpoint
  app.use('/stream', streamProxy)

  prefixRouter.get('/google-client', async (req, res, next) => {
    res.json({ clientId: req.config.clientId })
  })

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
    router: app,
    store,
  }
}
