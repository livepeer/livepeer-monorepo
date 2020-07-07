import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const RPC_URLS: { [chainId: number]: string } = {
  1: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}` as string,
  4: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}` as string,
}

export const Network = new NetworkConnector({
  defaultChainId: process.env.NETWORK === 'rinkeby' ? 4 : 1,
  urls: RPC_URLS,
})

export const Injected = new InjectedConnector({
  supportedChainIds: [1, 4, 1337],
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

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'Livepeer Explorer',
  appLogoUrl: 'https://explorer.livepeer.org/img/logo-icon.svg',
})
