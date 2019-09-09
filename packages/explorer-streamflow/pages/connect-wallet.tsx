/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { jsx, Flex, Box, Styled } from 'theme-ui'
import Layout from '../components/Layout'
import Router from 'next/router'
import { useWeb3Context, Web3Consumer } from 'web3-react'
import Wallet from '../static/img/wallet.svg'
import Portis from '../static/img/portis.svg'
import MetaMask from '../static/img/metamask.svg'
import Secure from '../static/img/secure.svg'
import ToggleCard from '../components/ToggleCard'
import Button from '../components/Button'

export default () => {
  const context = useWeb3Context()
  const [selectedProvider, setSelectedProvider] = useState('Portis')

  // Redirect to user's account upon connection to web3
  useEffect(() => {
    if (context.account) {
      Router.push(`/[account]`, `/${context.account}`)
    }
  }, [context.account])

  return (
    <Layout>
      <Box
        sx={{
          width: 'calc(100% - 256px)',
          p: 5,
        }}
      >
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
        <Flex sx={{ width: ['100%', '100%', '100%', '80%'], mb: 4 }}>
          <ToggleCard
            onClick={() => setSelectedProvider('Portis')}
            sx={{ mr: 3, width: '50%' }}
            label="Recommended"
            description="Recommended for new users. Connect in seconds to a secure wallet via email."
            icon={Portis}
            isActive={selectedProvider == 'Portis'}
            providerName="Portis"
          />
          <ToggleCard
            onClick={() => setSelectedProvider('MetaMask')}
            sx={{ width: '50%' }}
            description="Browser extension based wallet with a high degree of control."
            icon={MetaMask}
            isActive={selectedProvider == 'MetaMask'}
            providerName="MetaMask"
          />
        </Flex>
        <Button
          sx={{ mb: 4 }}
          onClick={async () => {
            context.setConnector(selectedProvider)
          }}
        >
          Connect
        </Button>
        <Flex>
          <Secure sx={{ mr: 2 }} />
          <Flex sx={{ flexDirection: 'column' }}>
            <Styled.h5 sx={{ mb: 0 }}>Non-custodial & Secure</Styled.h5>
            <Styled.p sx={{ fontSize: 0 }}>
              We do not own your private keys and cannot access your funds
              without your confirmation.
            </Styled.p>
          </Flex>
        </Flex>
      </Box>
    </Layout>
  )
}
