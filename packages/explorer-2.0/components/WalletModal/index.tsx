import { useState, useEffect } from 'react'
import { Box } from 'theme-ui'
import CloseIcon from '../../public/img/close.svg'
import MetaMaskIcon from '../../public/img/metamask.svg'
import { Dialog } from '@reach/dialog'
import { SUPPORTED_WALLETS } from '../../lib/constants'
import { Injected } from '../../lib/connectors'
import { isMobile } from 'react-device-detect'
import { useCookies } from 'react-cookie'
import { useWeb3React } from '@web3-react/core'
import Option from './Option'
import PendingView from './PendingView'
import AccountDetails from './AccountDetails'
import gql from 'graphql-tag'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { usePrevious } from '../../hooks'

const WALLET_VIEWS = {
  OPTIONS: 'options',
  ACCOUNT: 'account',
  PENDING: 'pending',
}

// Borrowed from uniswap's WalletModal component implementation
export default () => {
  const { active, account, connector, activate, error } = useWeb3React()
  const [cookies, setCookie] = useCookies(['connector'])
  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [pendingWallet, setPendingWallet] = useState()
  const client = useApolloClient()

  const tryActivation = connector => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map(key => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    setCookie('connector', name, { path: '/' })
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)
    activate(connector)
  }

  const GET_WALLET_MODAL_STATUS = gql`
    {
      walletModalOpen @client
    }
  `

  const { data, loading } = useQuery(GET_WALLET_MODAL_STATUS)

  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (
      data.walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    data,
    activePrevious,
    connectorPrevious,
  ])

  if (loading) {
    return null
  }

  const close = () => {
    client.writeData({
      data: {
        walletModalOpen: false,
      },
    })
  }

  useEffect(() => {
    if (active) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active])

  function getOptions() {
    const isMetamask = window['ethereum'] && window['ethereum'].isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map(key => {
      const option = SUPPORTED_WALLETS[key]

      // check for mobile options
      if (isMobile) {
        if (!window['web3'] && !window['ethereum'] && option.mobile) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector)
              }}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              Icon={option.icon}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === Injected) {
        // don't show injected if there's no injected provider
        if (!(window['web3'] || window['ethereum'])) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                Icon={MetaMaskIcon}
              />
            )
          } else {
            return null // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector)
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            Icon={option.icon}
          />
        )
      )
    })
  }

  function getModalContent() {
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          onClose={close}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <Box sx={{ borderRadius: 'inherit' }}>
        <Box sx={{ position: 'relative', p: [2, 2, 2, 3] }}>
          <Box sx={{ fontWeight: 500 }}>
            {walletView !== WALLET_VIEWS.ACCOUNT ? (
              <Box
                onClick={() => {
                  setWalletView(WALLET_VIEWS.ACCOUNT)
                }}
                sx={{ color: 'primary', cursor: 'pointer' }}
              >
                Back
              </Box>
            ) : (
              'Connect To A Wallet'
            )}
          </Box>
          <CloseIcon
            onClick={close}
            sx={{
              cursor: 'pointer',
              position: 'absolute',
              right: 20,
              top: 20,
              color: 'white',
            }}
          />
        </Box>
        <Box
          sx={{
            borderBottomLeftRadius: 'inherit',
            borderBottomRightRadius: 'inherit',
            bg: 'rgba(255, 255, 255, .04)',
            p: 3,
          }}
        >
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView connector={pendingWallet} />
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridGap: 2,
                gridTemplateColumns: `repeat(auto-fit, minmax(128px, 1fr))`,
              }}
            >
              {process.browser && getOptions()}
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  return (
    data.walletModalOpen && (
      <Dialog style={{ overflow: 'hidden' }} onDismiss={close}>
        <Box className="tour-step-2">{getModalContent()}</Box>
      </Dialog>
    )
  )
}
