import { Router } from 'express'
import uuid from 'uuid/v4'
import logger from '../logger'
import { timeout } from '../util'

const app = Router()

// Right now this is very deployment-specific
app.get('/', async (req, res, next) => {
  // Requires Kubernetes. Currently.
  if (!req.kubeApi) {
    res.status(502)
    return res.json({ errors: ['not yet implemented outside of kubernetes'] })
  }
  const endpoints = await timeout(5000, () =>
    req.kubeApi.readNamespacedEndpoints(
      req.kubeBroadcasterService,
      req.kubeNamespace,
    ),
  )
  const broadcasters = new Set()
  for (const subset of endpoints.body.subsets) {
    for (const address of subset.addresses) {
      // xxx TODO FIXME hardcoded address here
      broadcasters.add(`https://${address.nodeName}.livepeer.live`)
    }
  }
  return res.json([...broadcasters].map(address => ({ address })))
})

export default app
