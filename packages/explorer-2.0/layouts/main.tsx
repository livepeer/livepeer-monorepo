import { Styled, Box, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Drawer from '../components/Drawer'
import Reset from '../lib/reset'
import Ballot from '../public/img/ballot.svg'
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
import ProgressBar from '../components/ProgressBar'
import { useMutations } from '../hooks'
import { MutationsContext } from '../contexts'
import TxStartedDialog from '../components/TxStartedDialog'
import TxConfirmedDialog from '../components/TxConfirmedDialog'

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.GA_TRACKING_ID)
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

const Layout = ({
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
  const mutations = useMutations()
  const GET_SUBMITTED_TXS = require('../queries/transactions.gql')
  const { data: transactionsData } = useQuery(GET_SUBMITTED_TXS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [txDialogState, setTxDialogState]: any = useState([])
  const { width } = useWindowSize()

  useEffect(() => {
    if (width > 1020) {
      document.body.removeAttribute('style')
    }

    if (width < 1020 && drawerOpen) {
      document.body.style.overflow = 'hidden'
    }
  }, [])

  let items: DrawerItem[] = [
    {
      name: 'Orchestrators',
      href: '/',
      as: '/',
      icon: Orchestrators,
      className: 'orchestrators',
    },
    {
      name: 'Voting',
      href: '/voting',
      as: '/voting',
      icon: Ballot,
      className: 'voting',
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

  const lastTx = transactionsData?.txs[transactionsData?.txs?.length - 1]

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Reset />
      <MutationsContext.Provider value={mutations}>
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
                position: 'relative',
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

          <TxConfirmedDialog
            isOpen={
              lastTx?.confirmed &&
              !txDialogState.find(t => t.txHash === lastTx.txHash)
                ?.confirmedDialog?.dismissed
            }
            onDismiss={() => {
              setTxDialogState([
                ...txDialogState.filter(t => t.txHash !== lastTx.txHash),
                {
                  ...txDialogState.find(t => t.txHash === lastTx.txHash),
                  txHash: lastTx.txHash,
                  confirmedDialog: {
                    dismissed: true,
                  },
                },
              ])
            }}
            tx={lastTx}
          />

          <TxStartedDialog
            isOpen={
              lastTx?.confirmed === false &&
              !txDialogState.find(t => t.txHash === lastTx.txHash)
                ?.pendingDialog?.dismissed
            }
            onDismiss={() => {
              setTxDialogState([
                ...txDialogState.filter(t => t.txHash !== lastTx.txHash),
                {
                  ...txDialogState.find(t => t.txHash === lastTx.txHash),
                  txHash: lastTx.txHash,
                  pendingDialog: {
                    dismissed: true,
                  },
                },
              ])
            }}
            tx={lastTx}
          />
          {lastTx?.confirmed === false && (
            <Box
              sx={{
                position: 'fixed',
                bg: 'surface',
                bottom: 0,
                width: ['100%', '100%', '100%', 'calc(100% - 275px)'],
                left: [0, 0, 0, 275],
              }}
            >
              <ProgressBar tx={lastTx} />
            </Box>
          )}
        </Styled.root>
      </MutationsContext.Provider>
    </>
  )
}

export const getLayout = page => <Layout>{page}</Layout>

export default Layout
