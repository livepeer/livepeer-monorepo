import { Router } from 'express'
import { timeout } from '../util'
import { render } from 'mustache'
import { checkKubernetes } from '../middleware'

const app = Router()

app.use(checkKubernetes())

export const getOrchestrators = async req => {
  const endpoints = await timeout(5000, () =>
    req.kubeApi.readNamespacedEndpoints(
      req.kubeOrchestratorService,
      req.kubeNamespace,
    ),
  )
  const ret = []
  if (endpoints.body && endpoints.body.subsets) {
    for (const subset of endpoints.body.subsets) {
      if (!subset.addresses) {
        continue
      }
      for (const address of subset.addresses) {
        ret.push({ address: render(req.kubeOrchestratorTemplate, address) })
      }
    }
  }
  return ret
}

// Right now this is very deployment-specific
app.get('/', async (req, res, next) => {
  const orchestrators = await getOrchestrators(req)

  return res.json(orchestrators)
})

export default app
