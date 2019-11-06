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
import { useCookies } from 'react-cookie'
import { ethers } from 'ethers'

const Layout = ({ children, title = 'Livepeer Explorer' }) => {
  const context = useWeb3Context()
  const { account } = context
  const [cookies, setCookie, removeCookie] = useCookies(['connector'])
  if (cookies.connector) {
    context.setConnector(cookies.connector)
  }

  let items = [
    {
      name: 'Orchestrators',
      href: '/',
      icon: Orchestrators,
      className: 'orchestrators',
    },
    {
      name: 'Search',
      href: '/search',
      icon: Search,
      className: 'search',
    },
    {
      name: !account ? (
        'Connect Wallet'
      ) : (
        <div>
          <div sx={{ lineHeight: 1.5 }}>My Account</div>
          <div sx={{ fontSize: 0 }}>
            {account.replace(account.slice(5, 39), '…')}
          </div>
        </div>
      ),
      className: 'tour-step-1',
      href: !account ? '/connect-wallet' : '/accounts/[account]/[slug]',
      as: !account ? '/connect-wallet' : `/accounts/${account}/staking`,
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
        <div
          sx={{
            height: '100vh',
            display: ['flex', 'flex', 'flex', 'none'],
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 32px',
          }}
        >
          Mobile support coming soon.
        </div>

        <div
          sx={{
            maxWidth: 1400,
            margin: '0 auto',
            display: ['none', 'none', 'none', 'flex'],
          }}
        >
          <Drawer items={items} />
          <Flex
            sx={{
              paddingLeft: 40,
              paddingRight: 40,
              width: 'calc(100% - 256px)',
            }}
          >
            <Flex sx={{ width: '100%' }} className="tour-step-6">
              {children}
            </Flex>
          </Flex>
        </div>
      </Styled.root>
    </>
  )
}

export const getLayout = page => <Layout>{page}</Layout>
Layout.displayName = ''
export default Layout
