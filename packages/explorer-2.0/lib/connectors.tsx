import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'

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

export const Fortmatic = new FortmaticConnector({
  apiKey: 'pk_live_48F5D30F4D931706',
  chainId: 1,
})
