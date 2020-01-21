/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { jsx, Flex, Box, Styled } from 'theme-ui'
import Router from 'next/router'
import { useWeb3Context } from 'web3-react'
import Wallet from '../public/img/wallet.svg'
import Portis from '../public/img/portis.svg'
import MetaMask from '../public/img/metamask.svg'
import Secure from '../public/img/secure.svg'
import ToggleCard from '../components/ToggleCard'
import Button from '../components/Button'
import Layout from '../layouts/main'
import { useCookies } from 'react-cookie'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Spinner from '../components/Spinner'
import { withApollo } from '../lib/apollo'

const GET_TOUR_OPEN = gql`
  {
    tourOpen @client
  }
`

const ConnectWallet = () => {
  const context = useWeb3Context()
  const [selectedProvider, setSelectedProvider] = useState('Portis')
  const [connecting, setConnecting] = useState(false)
  const [cookies, setCookie] = useCookies(['connector'])
  const { data } = useQuery(GET_TOUR_OPEN)

  // Redirect to user's account upon connection to web3
  useEffect(() => {
    if (context.active && !data.tourOpen) {
      Router.push(
        `/accounts/[account]/[slug]`,
        `/accounts/${context.account}/staking`,
      )
    }
  }, [context.account])

  // If product tour is open continue the tour upon connection to web3
  useEffect(() => {
    if (data.tourOpen && context.active) {
      Router.push('/connect-wallet?connected=true')
    }
  }, [context.active, cookies.connector])

  return (
    <Layout>
      <div sx={{ pt: 5 }}>
        <Styled.h1
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            mb: 6,
          }}
        >
          <Wallet
            sx={{
              color: 'primary',
              width: 30,
              height: 30,
              marginRight: 2,
            }}
          />
          Connect Wallet
        </Styled.h1>
        <div className="tour-step-2">
          <Flex sx={{ width: ['100%', '100%', '100%', '100%'], mb: 3 }}>
            <ToggleCard
              onClick={() => setSelectedProvider('Portis')}
              sx={{ mr: 3, width: '50%' }}
              description="Recommended for new users. Connect in seconds to a secure wallet via email."
              icon={Portis}
              isActive={selectedProvider == 'Portis'}
              providerName="Portis"
            />
            <ToggleCard
              onClick={() => setSelectedProvider('Injected')}
              sx={{ width: '50%' }}
              description="Browser extension based wallet with a high degree of control."
              icon={MetaMask}
              isActive={selectedProvider == 'Injected'}
              providerName="MetaMask"
            />
          </Flex>

          <Button
            className="connectWalletButton"
            sx={{ mb: 4 }}
            onClick={async () => {
              try {
                setConnecting(true)
                await context.setConnector(selectedProvider, {
                  suppressAndThrowErrors: true,
                })
                setCookie('connector', selectedProvider, { path: '/' })
                setConnecting(false)
              } catch (e) {
                console.warn(e)
                setConnecting(false)
              }
            }}
          >
            <Flex sx={{ alignItems: 'center' }}>
              {connecting && <Spinner sx={{ width: 16, height: 16, mr: 1 }} />}
              Connect
            </Flex>
          </Button>
          <Flex
            sx={{
              mb: 3,
              alignSelf: 'flex-start',
              alignItems: 'center',
              width: '80%',
            }}
          >
            <Secure sx={{ width: 24, height: 24, mr: 2 }} />
            <Flex sx={{ flexDirection: 'column' }}>
              <h5 sx={{ color: 'muted' }}>Non-custodial & Secure</h5>
              <div sx={{ color: 'muted', fontSize: 0 }}>
                We do not own your private keys and cannot access your funds.
              </div>
            </Flex>
          </Flex>
        </div>
      </div>
    </Layout>
  )
}

ConnectWallet.displayName = ''

export default withApollo(ConnectWallet)
