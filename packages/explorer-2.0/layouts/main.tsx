/** @jsx jsx */
import { jsx, Styled, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
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

const Layout = ({ children, title = 'Livepeer Explorer' }) => {
  const context = useWeb3Context()
  const { account } = context
  const { threeBoxSpace } = useAccount(account)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies([
    'dismissedOldExplorerSnackbar',
  ])

  useEffect(() => {
    if (!cookies.dismissedOldExplorerSnackbar) {
      setSnackbarOpen(true)
    }
  }, [cookies])

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
        </div>
      </Styled.root>
    </>
  )
}

export const getLayout = page => <Layout>{page}</Layout>
Layout.displayName = ''
export default Layout
