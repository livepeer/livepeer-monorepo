import { Styled, Box, Flex } from 'theme-ui'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Drawer from '../components/Drawer'
import Reset from '../lib/reset'
import Orchestrators from '../public/img/orchestrators.svg'
import Account from '../public/img/account.svg'
import Wallet from '../public/img/wallet.svg'
import Search from '../public/img/search.svg'
import { useWeb3Context } from 'web3-react'
import { useCookies } from 'react-cookie'
import { ethers } from 'ethers'
import Snackbar from '../components/Snackbar'
import { useAccount } from '../hooks'
import Header from '../components/Header'
import Router from 'next/router'
import useWindowSize from 'react-use/lib/useWindowSize'

const Layout = ({ children, title = 'Livepeer Explorer' }) => {
  const context = useWeb3Context()
  const { account } = context
  const { threeBoxSpace } = useAccount(account)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { width } = useWindowSize()
  const [cookies, setCookie, removeCookie] = useCookies([
    'dismissedOldExplorerSnackbar',
  ])

  useEffect(() => {
    if (!cookies.dismissedOldExplorerSnackbar) {
      setSnackbarOpen(true)
    }
  }, [cookies])

  useEffect(() => {
    if (width > 1020) {
      document.body.removeAttribute('style')
    }

    if (width < 1020 && drawerOpen) {
      document.body.style.overflow = 'hidden'
    }
  })

  let items = [
    {
      name: 'Orchestrators',
      href: '/',
      as: '/',
      icon: Orchestrators,
      className: 'orchestrators',
    },
    {
      name: 'Search',
      href: '/search',
      as: '/search',
      icon: Search,
      className: 'search',
    },
    {
      name: !account ? (
        'Connect Wallet'
      ) : (
        <div>
          <div sx={{ lineHeight: 1.5 }}>
            {process.env.THREEBOX_ENABLED && threeBoxSpace && threeBoxSpace.name
              ? threeBoxSpace.name
              : 'My Account'}
          </div>
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

  Router.events.on('routeChangeComplete', () =>
    document.body.removeAttribute('style'),
  )

  const onDrawerOpen = () => {
    if (drawerOpen) {
      document.body.removeAttribute('style')
      setDrawerOpen(false)
    } else {
      document.body.style.overflow = 'hidden'
      setDrawerOpen(true)
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Reset />
      <Styled.root>
        <Header onDrawerOpen={onDrawerOpen} />
        <Box
          sx={{
            maxWidth: 1400,
            margin: '0 auto',
            display: 'flex',
          }}
        >
          <Drawer onDrawerOpen={onDrawerOpen} open={drawerOpen} items={items} />
          <Flex
            sx={{
              bg: 'background',
              paddingLeft: [2, 2, 2, 32],
              paddingRight: [2, 2, 2, 32],
              width: ['100%', '100%', '100%', 'calc(100% - 275px)'],
            }}
          >
            <Flex sx={{ width: '100%' }} className="tour-step-6">
              {children}
            </Flex>
          </Flex>
          {snackbarOpen && (
            <Snackbar
              onClose={() => {
                setCookie('dismissedOldExplorerSnackbar', true, { path: '/' })
                setSnackbarOpen(false)
              }}
            >
              <span>
                Prefer the old explorer? Visit{' '}
                <a
                  sx={{ color: 'background', textDecoration: 'underline' }}
                  href="https://classic.explorer.livepeer.org"
                  target="_blank"
                >
                  classic.explorer.livepeer.org
                </a>
              </span>
            </Snackbar>
          )}
        </Box>
      </Styled.root>
    </>
  )
}

Layout.displayName = ''

export default Layout
