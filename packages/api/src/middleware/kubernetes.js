/**
 * Injects getOrchestrators() and getBroadcasters() from the local k8s environment
 */

import { render } from 'mustache'
import * as k8s from '@kubernetes/client-node'
import { timeout } from '../util'
import { hardcodedNodes } from '.'

export default function kubernetesMiddleware({
  kubeNamespace,
  kubeBroadcasterService,
  kubeOrchestratorService,
  kubeBroadcasterTemplate,
  kubeOrchestratorTemplate,
  broadcasters,
  orchestrators
}) {
  const kc = new k8s.KubeConfig()
  kc.loadFromDefault()

  const kubeApi = kc.makeApiClient(k8s.CoreV1Api)

  const getBroadcasters = async () => {
    const endpoints = await timeout(5000, () =>
      kubeApi.readNamespacedEndpoints(kubeBroadcasterService, kubeNamespace),
    )
    const ret = []
    if (endpoints.body && endpoints.body.subsets) {
      for (const subset of endpoints.body.subsets) {
        if (!subset.addresses) {
          continue
        }
        for (const address of subset.addresses) {
          ret.push({
            address: render(kubeBroadcasterTemplate, {
              nodeName: address.nodeName,
              ip: address.ip,
            }),
            cliAddress: `http://${address.ip}:7935`,
          })
        }
      }
    }
    return ret
  }

  const getOrchestrators = async () => {
    const endpoints = await timeout(5000, () =>
      kubeApi.readNamespacedEndpoints(kubeOrchestratorService, kubeNamespace),
    )
    const ret = []
    if (endpoints.body && endpoints.body.subsets) {
      for (const subset of endpoints.body.subsets) {
        if (!subset.addresses) {
          continue
        }
        for (const address of subset.addresses) {
          ret.push({
            address: render(kubeOrchestratorTemplate, {
              nodeName: address.nodeName,
              ip: address.ip,
            }),
            cliAddress: `http://${address.ip}:7935`,
          })
        }
      }
    }
    return ret
  }

  return (req, res, next) => {
    if (kubeBroadcasterService) {
      if (broadcasters && req.headers.host.endsWith('cluster.local')) {
        req.getBroadcasters = getBroadcasters
      } else {
        hardcodedNodes({ orchestrators, broadcasters })
      }
    }

    if (kubeOrchestratorService) {
      if (orchestrators && req.headers.host.endsWith('cluster.local')) {
        req.getOrchestrators = getOrchestrators
      } else {
        hardcodedNodes({ orchestrators, broadcasters })
      }
    }

    return next()
  }
}
