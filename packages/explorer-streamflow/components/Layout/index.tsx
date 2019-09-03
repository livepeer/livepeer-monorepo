import * as React from 'react'
import Head from 'next/head'
import Drawer from '../Drawer'
import Reset from '../../lib/reset'
import { Styled, Flex } from 'theme-ui'
import Orchestrators from '../../static/img/orchestrators.svg'
import Account from '../../static/img/account.svg'
import Wallet from '../../static/img/wallet.svg'
import Search from '../../static/img/search.svg'
import { useWeb3Context } from 'web3-react'

const Layout = ({ children, title = 'Livepeer Explorer' }: any) => {
  const context = useWeb3Context()

  let items = [
    { name: 'Orchestrators', href: '/', icon: Orchestrators },
    { name: 'Search', href: '/search', icon: Search },
    {
      name: !context.connector ? 'Connect Wallet' : 'My Account',
      href: !context.connector ? '/connect-wallet' : '/[account]',
      as: !context.connector ? '/connect-wallet' : `/${context.account}`,
      icon: !context.connector ? Wallet : Account,
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
