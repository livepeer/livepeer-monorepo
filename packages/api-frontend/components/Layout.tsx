import * as React from 'react'
import Head from 'next/head'
import Drawer from '@livepeer/explorer-streamflow/dist/components/Drawer'
import Reset from '@livepeer/explorer-streamflow/dist/lib/reset'
import { Styled, Flex, Box } from 'theme-ui'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Live = () => {
  return <Box sx={{ fontFamily: 'monospace' }}>&nbsp;&nbsp;🔴&nbsp;&nbsp;</Box>
}

const menuItems = [
  { name: 'LIVE', link: '/', icon: Live },
  // { name: 'Search', link: '/search', icon: Search },
  // // { name: 'Account', link: '/account', icon: Account },
  // { name: 'Connect Wallet', link: '/connect-wallet', icon: Wallet },
]

const Layout = ({ children, title = 'Livepeer.live' }: any) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Reset />
    <Styled.root>
      <Flex style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Drawer items={menuItems} />
        {children}
      </Flex>
    </Styled.root>
  </>
)

export default Layout
