import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { NetworkConnector } from '@web3-react/network-connector'

const POLLING_INTERVAL = 10000

export const Network = new NetworkConnector({
  urls: { 1: 'https://mainnet.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e' },
  pollingInterval: POLLING_INTERVAL * 3,
})

export const Injected = new InjectedConnector({
  supportedChainIds: [1],
})

export const Portis = new PortisConnector({
  dAppId: '0e9ac0c3-9184-4660-8492-6989cf3dc5d4',
  networks: [1],
})

// import { NetworkConnector  } from '@web3-react/network-connector'
// import { InjectedConnector } from '@web3-react/injected-connector'
// import { PortisConnector } from '@web3-react/portis-connector'

// let PortisApi

// if (typeof window !== 'undefined') {
//   PortisApi = require('@portis/web3')
// }

// const { InjectedConnector, PortisConnector, NetworkOnlyConnector } = Connectors

// const supportedNetworkURLs = {
//   1: 'https://mainnet.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e',
//   4: 'https://rinkeby.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e',
// }

// export const Network = new NetworkOnlyConnector({
//   providerURL: supportedNetworkURLs[1],
// })

// export const Injected = new InjectedConnector({
//   supportedNetworks: [1, 4],
// })

// export const Portis = new PortisConnector({
//   api: PortisApi,
//   dAppId: '0e9ac0c3-9184-4660-8492-6989cf3dc5d4',
//   network: 'mainnet',
// })

// export default {
//   Injected,
//   Network,
//   Portis,
// }

// const POLLING_INTERVAL = 10000

// export const network = new NetworkConnector({
//   urls: { 1: process.env.REACT_APP_NETWORK_URL },
//   pollingInterval: POLLING_INTERVAL * 3
// })

// export const injected = new InjectedConnector({
//   supportedChainIds: [1]
// })

// export const portis = new PortisConnector({
//   dAppId: process.env.REACT_APP_PORTIS_ID,
//   networks: [1]
// })
