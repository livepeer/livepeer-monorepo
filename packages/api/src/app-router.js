// import 'express-async-errors' // it monkeypatches, i guess
import Router from 'express/lib/router'
import bearerToken from 'express-bearer-token'
import {
  LevelStore,
  PostgresStore,
  CloudflareStore,
  CloudflareClusterStore,
  FirestoreStore,
} from './store'
import {
  healthCheck,
  kubernetes,
  hardcodedNodes,
  insecureTest,
  geolocateMiddleware,
} from './middleware'
import controllers from './controllers'
import streamProxy from './controllers/stream-proxy'
import apiProxy from './controllers/api-proxy'
import proxy from 'http-proxy-middleware'
import { getBroadcasterHandler } from './controllers/broadcaster'

// Routes that should be whitelisted even when `apiRegion` is set
const GEOLOCATION_ENDPOINTS = [
  'broadcaster',
  'orchestrator',
  'ingest',
  'geolocate',
  'user',
]

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
    supportAddr,
    sendgridTemplateId,
    sendgridApiKey,
    segmentApiKey,
    kubeNamespace,
    kubeBroadcasterService,
    kubeBroadcasterTemplate,
    kubeOrchestratorService,
    kubeOrchestratorTemplate,
    fallbackProxy,
    orchestrators = '[]',
    broadcasters = '[]',
    ingest = '[]',
    insecureTestToken,
    firestoreCredentials,
    firestoreCollection,
  } = params

  if (supportAddr || sendgridTemplateId || sendgridApiKey) {
    if (!(supportAddr && sendgridTemplateId && sendgridApiKey)) {
      throw new Error(
        `Sending emails requires supportAddr, sendgridTemplateId, and sendgridApiKey`,
      )
    }
  }

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
  } else if (storage === 'firestore') {
    store = FirestoreStore({ firestoreCredentials, firestoreCollection })
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

  app.use(hardcodedNodes({ orchestrators, broadcasters, ingest }))

  // Add a controller for each route at the /${httpPrefix} route
  const prefixRouter = Router() // amalgamates our endpoints together and serves them out
  // hack because I forgot this one needs to get geolocated too :(
  prefixRouter.get(
    '/stream/:streamId/broadcaster',
    geolocateMiddleware({}),
    getBroadcasterHandler,
  )
  for (const [name, controller] of Object.entries(controllers)) {
    // if we're operating in api-region mode, only handle geolocation traffic, forward the rest on
    if (
      params.apiRegion &&
      params.apiRegion.length > 0 &&
      !GEOLOCATION_ENDPOINTS.includes(name)
    ) {
      prefixRouter.use(`/${name}`, apiProxy)
    } else {
      prefixRouter.use(`/${name}`, controller)
    }
  }
  app.use(httpPrefix, prefixRouter)
  // Special case: handle /stream proxies off that endpoint
  app.use('/stream', streamProxy)

  // This far down, this would otherwise be a 404... hit up the fallback proxy if we have it.
  // Mostly this is used for proxying to the Next.js server in development.
  if (fallbackProxy) {
    app.use(proxy({ target: fallbackProxy, changeOrigin: true }))
  }

  // If we throw any errors with numerical statuses, use them.
  app.use(async (err, req, res, next) => {
    if (typeof err.status === 'number') {
      res.status(err.status)
      return res.json({ errors: [err.message] })
    }

    next(err)
  })

  return {
    router: app,
    store,
  }
}
