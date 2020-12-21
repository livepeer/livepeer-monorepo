import { Injected, Portis, Fortmatic, walletlink } from './connectors'
import MetaMaskIcon from '../public/img/metamask.svg'
import PortisIcon from '../public/img/portis.svg'
import FortmaticIcon from '../public/img/fortmatic.svg'
import CoinbaseWalletIcon from '../public/img/coinbase-wallet.svg'
import InjectedIcon from '../public/img/arrow-right.svg'

export const SUPPORTED_WALLETS = {
  INJECTED: {
    connector: Injected,
    name: 'Injected',
    icon: InjectedIcon,
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: Injected,
    name: 'MetaMask',
    icon: MetaMaskIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    icon: CoinbaseWalletIcon,
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5',
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    icon: CoinbaseWalletIcon,
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/0T8By93MA4',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true,
  },
  FORTMATIC: {
    connector: Fortmatic,
    name: 'Fortmatic',
    icon: FortmaticIcon,
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true,
  },
  Portis: {
    connector: Portis,
    name: 'Portis',
    icon: PortisIcon,
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true,
  },
}

export const timeframeOptions = {
  WEEK: '1 week',
  MONTH: '1 month',
  ALL_TIME: 'All time',
}
