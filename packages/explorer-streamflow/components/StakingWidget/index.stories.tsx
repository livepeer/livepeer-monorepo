import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { ApolloProvider } from '@apollo/react-hooks'
import initApollo from '../../lib/initApolloClient'
import StakingWidget from './index'
import { useAccount } from '../../hooks'

const apolloClient = initApollo()

storiesOf('StakingWidget', module).add('with text', () => {
  const { account } = useAccount()
  return (
    <ApolloProvider client={apolloClient}>
      <StakingWidget
        currentRound={{ id: '1500' }}
        account={account}
        transcoder={{ id: '0x...' }}
        protocol={{ totalTokenSupply: '100', totalBondedToken: '100' }}
      />
    </ApolloProvider>
  )
})
