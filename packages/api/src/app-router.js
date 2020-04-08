// import 'express-async-errors' // it monkeypatches, i guess
import Router from 'express/lib/router'
import bearerToken from 'express-bearer-token'
import {
  LevelStore,
  PostgresStore,
  CloudflareStore,
  CloudflareClusterStore,
} from './store'
import {
  healthCheck,
  kubernetes,
  hardcodedNodes,
  insecureTest,
} from './middleware'
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
    jwtSecret,
    jwtAudience,
    kubeNamespace,
    kubeBroadcasterService,
    kubeBroadcasterTemplate,
    kubeOrchestratorService,
    kubeOrchestratorTemplate,
    fallbackProxy,
    orchestrators = '[]',
    broadcasters = '[]',
    insecureTestToken,
  } = params
  // Storage init
  const bodyParser = require('body-parser')
  let store
  if (storage === 'level') {
    store = LevelStore({ dbPath })
  } else if (storage === 'postgres') {
    store = PostgresStore({ postgresUrl })
  } else if (storage === 'cloudflare') {
    store = CloudflareStore({
      cloudflareNamespace,
      cloudflareAccount,
      cloudflareAuth,
    })
  } else if (storage === 'cloudflare-cluster') {
    store = CloudflareClusterStore({
      cloudflareNamespace,
    })
  } else {
    throw new Error('Missing storage information')
  }
  await store.ready

  // Logging, JSON parsing, store injection

  const app = Router()
  app.use(healthCheck)
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    req.store = store
    req.config = params
    next()
  })
  if (insecureTestToken) {
    if (process.NODE_ENV === 'production') {
      throw new Error('tried to set insecureTestToken in production!')
    }
    app.use(`/${insecureTestToken}`, insecureTest())
  }
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
  }

  app.use(hardcodedNodes({ orchestrators, broadcasters }))

  // Add a controller for each route at the /${httpPrefix} route
  const prefixRouter = Router() // amalgamates our endpoints together and serves them out
  for (const [name, controller] of Object.entries(controllers)) {
    prefixRouter.use(`/${name}`, controller)
  }
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
  app.use(async (err, req, res, next) => {
    console.log('end:')
    console.log(err)
    if (typeof err.status === 'number') {
      res.status(err.status)
      res.json({ errors: [err.message] })
      return
    }

    // console.log("got past that")
    // throw err
    next(err)
  })

  return {
    router: app,
    store,
  }
}
