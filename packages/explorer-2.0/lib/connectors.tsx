import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string,
}

export const Network = new NetworkConnector({
  defaultChainId: 1,
  urls: RPC_URLS,
  pollingInterval: POLLING_INTERVAL * 3,
})

export const Injected = new InjectedConnector({
  supportedChainIds: [1, 4],
})

// mainnet only
export const Portis = new PortisConnector({
  dAppId: process.env.PORTIS_DAPP_ID,
  networks: [1],
})

// mainnet only
export const Fortmatic = new FortmaticConnector({
  apiKey: process.env.FORTMATIC_API_KEY,
  chainId: 1,
})
