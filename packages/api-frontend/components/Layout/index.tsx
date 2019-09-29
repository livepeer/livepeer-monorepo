/** @jsx jsx */
import Head from 'next/head'
import { List, ListItem } from '@livepeer/ui'
import { Styled, Flex, Box, jsx } from 'theme-ui'

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
    {/* <Reset /> */}
    <Styled.root>
      <Flex style={{ maxWidth: 1400, margin: '0 auto' }}>
        <List items={menuItems} />
        {children}
      </Flex>
    </Styled.root>
  </>
)

export default Layout
