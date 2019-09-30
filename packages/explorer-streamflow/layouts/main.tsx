/** @jsx jsx */
import { jsx, Styled, Flex } from 'theme-ui'
import React from 'react'
import Head from 'next/head'
import Drawer from '../components/Drawer'
import Reset from '../lib/reset'
import Orchestrators from '../static/img/orchestrators.svg'
import Account from '../static/img/account.svg'
import Wallet from '../static/img/wallet.svg'
import Search from '../static/img/search.svg'
import { useWeb3Context } from 'web3-react'

export default ({ children, title = 'Livepeer Explorer' }) => {
  const context = useWeb3Context()
  const account = context && context.account

  let items = [
    { name: 'Orchestrators', href: '/', icon: Orchestrators },
    { name: 'Search', href: '/search', icon: Search },
    {
      name: !account ? 'Connect Wallet' : 'My Account',
      href: !account ? '/connect-wallet' : '/account/[account]/[slug]',
      as: !account ? '/connect-wallet' : `/account/${account}/staking`,
      icon: !account ? Wallet : Account,
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
        <Flex sx={{ maxWidth: 1400, margin: '0 auto' }}>
          <Drawer items={items} />
          <Flex
            sx={{
              width: 'calc(100% - 256px)',
              paddingLeft: 40,
              paddingRight: 40,
            }}
          >
            {children}
          </Flex>
        </Flex>
      </Styled.root>
    </>
  )
}
