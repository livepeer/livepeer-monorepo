import * as React from 'react'
import Head from 'next/head'
import Drawer from '../Drawer'
import Reset from '../../lib/reset'
import { Styled, Flex } from 'theme-ui'
import Orchestrators from '../../static/img/orchestrators.svg'
import Network from '../../static/img/network.svg'
import Account from '../../static/img/account.svg'
import Wallet from '../../static/img/wallet.svg'
import Search from '../../static/img/search.svg'
import { useRouter } from 'next/router'
import { useWeb3Context } from 'web3-react'

const Layout = ({ children, title = 'Livepeer Explorer' }: any) => {
  const router = useRouter()
  const { pathname } = router
  const context = useWeb3Context()

  let items = [
    { name: 'Orchestrators', link: '/', icon: Orchestrators },
    { name: 'Network', link: '/network', icon: Network },
    { name: 'Search', link: '/search', icon: Search },
    {
      name: !context.connector ? 'Connect Wallet' : 'My Account',
      link: !context.connector ? '/connect-wallet' : 'me',
      icon: Wallet,
    },
  ]

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Reset />
      <Styled.root>
        <Flex style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Drawer items={items} />
          {children}
        </Flex>
      </Styled.root>
    </>
  )
}
export default Layout
