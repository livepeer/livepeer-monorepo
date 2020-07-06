import { broadcasterResponse, orchestratorResponse } from './test-data.json'

// For testing the no-endpoints case
const scrub = (response) => {
  // Cheap "deep copy"
  response = JSON.parse(JSON.stringify(response))
  delete response.body.subsets[0].addresses
  return response
}

const broadcasterResponseNoAddress = scrub(broadcasterResponse)
const orchestratorResponseNoAddress = scrub(orchestratorResponse)

export class KubeApiClient {
  async readNamespacedEndpoints(serviceName, namespaceName) {
    if (serviceName === 'broadcaster') {
      return broadcasterResponse
    }
    if (serviceName === 'orchestrator') {
      return orchestratorResponse
    }
    if (serviceName === 'broadcaster-noaddress') {
      return broadcasterResponseNoAddress
    }
    if (serviceName === 'orchestrator-noaddress') {
      return orchestratorResponseNoAddress
    }
    throw new Error(`don't have mock for service: ${serviceName}`)
  }
}

export class KubeConfig {
  loadFromDefault() {}
  makeApiClient() {
    return new KubeApiClient()
  }
}
