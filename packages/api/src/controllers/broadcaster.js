import { Router } from 'express'
import { timeout } from '../util'
import format from 'string-template'

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
      broadcasters.add(
        format(req.kubeBroadcasterTemplate, { nodeName: address.nodeName }),
      )
    }
  }
  return res.json([...broadcasters].map(address => ({ address })))
})

export default app
