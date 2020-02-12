import { Injected, Portis, Fortmatic } from './connectors'
import MetaMaskIcon from '../public/img/metamask.svg'
import PortisIcon from '../public/img/portis.svg'
import FortmaticIcon from '../public/img/fortmatic.svg'
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
