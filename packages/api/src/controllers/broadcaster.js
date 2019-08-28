import { Router } from 'express'
import { timeout } from '../util'
import format from 'string-template'
import fetch from 'isomorphic-fetch'

const app = Router()

const getBroadcasters = async req => {
  const endpoints = await timeout(5000, () =>
    req.kubeApi.readNamespacedEndpoints(
      req.kubeBroadcasterService,
      req.kubeNamespace,
    ),
  )
  const ret = []
  if (endpoints.body && endpoints.body.subsets) {
    for (const subset of endpoints.body.subsets) {
      for (const address of subset.addresses) {
        ret.push({
          ...address,
          name: format(req.kubeBroadcasterTemplate, {
            nodeName: address.nodeName,
            ip: address.ip,
          }),
        })
      }
    }
  }
  return ret
}

// Right now this is very deployment-specific
app.get('/', async (req, res, next) => {
  // Requires Kubernetes. Currently.
  if (!req.kubeApi) {
    res.status(502)
    return res.json({ errors: ['not yet implemented outside of kubernetes'] })
  }
  const broadcasters = await getBroadcasters(req)

  return res.json(
    [...broadcasters].map(broadcaster => ({
      address: broadcaster.name,
    })),
  )
})

app.get('/status', async (req, res, next) => {
  // Requires Kubernetes. Currently.
  if (!req.kubeApi) {
    res.status(502)
    return res.json({ errors: ['not yet implemented outside of kubernetes'] })
  }
  const broadcasters = await getBroadcasters(req)
  const statuses = {}
  for (const broadcaster of broadcasters) {
    const statusRes = await fetch(`http://${broadcaster.ip}:7935/status`)
    statuses[broadcaster.name] = await statusRes.json()
  }
  res.json(statuses)
})

export default app
