import { Injected, Portis } from './connectors'
import MetaMaskIcon from '../public/img/metamask.svg'
import PortisIcon from '../public/img/portis.svg'
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
