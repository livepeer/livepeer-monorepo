import { Styled, Box, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Drawer from '../components/Drawer'
import Reset from '../lib/reset'
import Orchestrators from '../public/img/orchestrators.svg'
import Search from '../public/img/search.svg'
import Account from '../public/img/account.svg'
import { useWeb3React } from '@web3-react/core'
import Header from '../components/Header'
import Router from 'next/router'
import useWindowSize from 'react-use/lib/useWindowSize'
import WalletModal from '../components/WalletModal'
import { useQuery } from '@apollo/react-hooks'
import ReactGA from 'react-ga'
import { isMobile } from 'react-device-detect'

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-111259858-1')
} else {
  ReactGA.initialize('test', { testMode: true })
}

type DrawerItem = {
  name: any
  href: string
  as: string
  icon: React.ElementType
  className?: string
}

export default ({
  children,
  title = 'Livepeer Explorer',
  headerTitle = '',
}) => {
  useEffect(() => {
    ReactGA.set({
      customBrowserType: !isMobile
        ? 'desktop'
        : window['web3'] || window['ethereum']
        ? 'mobileWeb3'
        : 'mobileRegular',
    })
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  const threeBoxSpaceQuery = require('../queries/threeBoxSpace.gql')
  const context = useWeb3React()
  const { account } = context

  const { data } = useQuery(threeBoxSpaceQuery, {
    variables: {
      account: context?.account,
    },
    skip: !context.account,
    pollInterval: 10000,
    ssr: false,
  })

  const [drawerOpen, setDrawerOpen] = useState(false)
  const { width } = useWindowSize()

  useEffect(() => {
    if (width > 1020) {
      document.body.removeAttribute('style')
    }

    if (width < 1020 && drawerOpen) {
      document.body.style.overflow = 'hidden'
    }
  })

  let items: DrawerItem[] = [
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
  ]

  if (context.active) {
    items.push({
      name: (
        <Box>
          {process.env.THREEBOX_ENABLED && data?.threeBoxSpace?.name
            ? data.threeBoxSpace.name
            : 'My Account'}
        </Box>
      ),
      href: '/accounts/[account]/[slug]',
      as: `/accounts/${account}/staking`,
      icon: Account,
    })
  }

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

  const onDrawerClose = () => {
    document.body.removeAttribute('style')
    setDrawerOpen(false)
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
        <Header title={headerTitle} onDrawerOpen={onDrawerOpen} />
        <WalletModal />
        <Box
          sx={{
            maxWidth: 1500,
            margin: '0 auto',
            display: 'flex',
          }}
        >
          <Drawer
            onDrawerClose={onDrawerClose}
            onDrawerOpen={onDrawerOpen}
            open={drawerOpen}
            items={items}
          />
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
        </Box>
      </Styled.root>
    </>
  )
}
