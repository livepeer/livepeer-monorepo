import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { ApolloProvider } from '@apollo/react-hooks'
import initApollo from '../../lib/initApolloClient'
import StakingWidget from './index'

const apolloClient = initApollo()

storiesOf('StakingWidget', module).add('with text', () => (
  <ApolloProvider client={apolloClient}>
    <StakingWidget
      protocol={{ totalTokenSupply: '100', totalBondedToken: '100' }}
    />
  </ApolloProvider>
))
