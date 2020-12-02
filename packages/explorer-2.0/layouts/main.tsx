import { Styled, Box, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Drawer from '../components/Drawer'
import Reset from '../lib/reset'
import { networksTypes } from '../lib/utils'
import Ballot from '../public/img/ballot.svg'
import Account from '../public/img/account.svg'
import DNS from '../public/img/dns.svg'
import { useWeb3React } from '@web3-react/core'
import Header from '../components/Header'
import Router from 'next/router'
import useWindowSize from 'react-use/lib/useWindowSize'
import WalletModal from '../components/WalletModal'
import { useQuery, useApolloClient } from '@apollo/client'
import ReactGA from 'react-ga'
import { isMobile } from 'react-device-detect'
import ProgressBar from '../components/ProgressBar'
import { useMutations, usePageVisibility } from '../hooks'
import { MutationsContext } from '../contexts'
import TxStartedDialog from '../components/TxStartedDialog'
import TxConfirmedDialog from '../components/TxConfirmedDialog'
import Modal from '../components/Modal'
import TxSummaryDialog from '../components/TxSummaryDialog'
import gql from 'graphql-tag'
import GET_SPACE from '../queries/threeBoxSpace.gql'
import GET_SUBMITTED_TXS from '../queries/transactions.gql'
import { FiArrowRight, FiX } from 'react-icons/fi'
import Link from 'next/link'

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

const pollInterval = 20000

const Layout = ({
  children,
  title = 'Livepeer Explorer',
  headerTitle = '',
}) => {
  const client: any = useApolloClient()
  const context = useWeb3React()
  const isVisible = usePageVisibility()
  const { account } = context
  const { data, startPolling, stopPolling } = useQuery(GET_SPACE, {
    variables: {
      account: context?.account,
    },
    skip: !context.account,
    pollInterval,
    ssr: false,
  })
  const { data: pollData } = useQuery(
    gql`
      {
        polls {
          isActive
          endBlock
        }
      }
    `,
  )
  const mutations = useMutations()
  const { data: transactionsData } = useQuery(GET_SUBMITTED_TXS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [txDialogState, setTxDialogState]: any = useState([])
  const { width } = useWindowSize()

  const totalActivePolls = pollData?.polls.filter(p => p.isActive).length
  const GET_TX_SUMMARY_MODAL = gql`
    {
      txSummaryModal @client {
        open
        error
      }
    }
  `
  const { data: txSummaryModalData } = useQuery(GET_TX_SUMMARY_MODAL)

  useEffect(() => {
    if (window.localStorage.getItem('bannerDismissed')) {
      setBannerDismissed(true)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) {
      stopPolling()
    } else {
      startPolling(pollInterval)
    }
  }, [isVisible])

  useEffect(() => {
    if (width > 1020) {
      document.body.removeAttribute('style')
    }

    if (width < 1020 && drawerOpen) {
      document.body.style.overflow = 'hidden'
    }
  }, [])

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

  let items: DrawerItem[] = [
    {
      name: 'Orchestrators',
      href: '/',
      as: '/',
      icon: DNS,
      className: 'orchestrators',
    },
    {
      name: (
        <Flex sx={{ alignItems: 'center' }}>
          Voting{' '}
          {totalActivePolls > 0 && (
            <Flex
              sx={{
                fontSize: '10px',
                color: 'white',
                ml: '6px',
                bg: 'red',
                borderRadius: 1000,
                width: 16,
                height: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {totalActivePolls}
            </Flex>
          )}
        </Flex>
      ),
      href: '/voting',
      as: '/voting',
      icon: Ballot,
      className: 'voting',
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
      <Modal
        title="Oops, you’re on the wrong network"
        isOpen={
          context.chainId &&
          networksTypes[context.chainId] !== process.env.NETWORK
        }
        showCloseButton={false}
      >
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 10,
            p: 3,
            mb: 2,
          }}
        >
          Simply open MetaMask and switch over to the{' '}
          <span sx={{ textTransform: 'capitalize' }}>
            {process.env.NETWORK}
          </span>{' '}
          network.
        </Box>
      </Modal>
      <MutationsContext.Provider value={mutations}>
        <Styled.root sx={{ height: 'calc(100vh - 82px)' }}>
          {!bannerDismissed && (
            <Flex
              sx={{
                py: 10,
                px: 2,
                width: '100%',
                alignItems: 'center',
                bg: 'black',
                justifyContent: 'center',
                fontSize: [0, 1, 1, 2],
              }}
            >
              <span
                sx={{
                  mr: 2,
                  pr: 2,
                  borderRight: '1px solid',
                  borderColor: 'border',
                }}
              >
                <span sx={{ fontWeight: '600' }}>New:</span>{' '}
                <span sx={{ display: ['none', 'none', 'inline'] }}>
                  Automatic earnings at
                </span>{' '}
                <span
                  sx={{ textTransform: ['uppercase', 'uppercase', 'initial'] }}
                >
                  r
                </span>
                <span>educed gas costs</span>
              </span>
              <Link href="/whats-new">
                <a
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'primary',
                  }}
                >
                  Read more <FiArrowRight sx={{ ml: 1 }} />
                </a>
              </Link>
              <FiX
                onClick={() => {
                  setBannerDismissed(true)
                  window.localStorage.setItem('bannerDismissed', 'true')
                }}
                sx={{
                  cursor: 'pointer',
                  position: 'absolute',
                  right: 20,
                  top: 14,
                }}
              />
            </Flex>
          )}

          <Header title={headerTitle} onDrawerOpen={onDrawerOpen} />
          <WalletModal />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: ['100%', '100%', '100%', '240px 1fr'],
            }}
          >
            <Drawer
              onDrawerClose={onDrawerClose}
              onDrawerOpen={onDrawerOpen}
              open={drawerOpen}
              items={items}
              bannerDismissed={bannerDismissed}
            />
            <Flex
              sx={{
                bg: 'background',
                position: 'relative',
                px: [3, 3, 3, 4],
                width: '100%',
              }}
            >
              <Flex sx={{ width: '100%' }}>{children}</Flex>
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
          <TxSummaryDialog
            isOpen={txSummaryModalData?.txSummaryModal.open}
            onDismiss={() => {
              client.writeQuery({
                query: gql`
                  query {
                    txSummaryModal {
                      __typename
                      error
                      open
                    }
                  }
                `,
                data: {
                  txSummaryModal: {
                    __typename: 'TxSummaryModal',
                    error: false,
                    open: false,
                  },
                },
              })
            }}
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
                width: [
                  '100%',
                  '100%',
                  'calc(100% - 240px)',
                  'calc(100% - 240px)',
                  'calc(100% - 240px)',
                  'calc(100vw - ((100vw - 1500px) / 2 + 240px))',
                ],
                left: [
                  0,
                  0,
                  240,
                  240,
                  240,
                  'calc((100% - 1500px) / 2 + 240px)',
                ],
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
