import React from 'react'
import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { MathBN, mockAccount } from '../../utils'
import {
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectToasts,
  connectTransactions,
  withTransactionHandlers,
} from '../../enhancers'

const accountQuery = gql`
  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
  }

  query AccountOverviewQuery($id: String!) {
    account(id: $id) {
      ...AccountFragment
    }
  }
`

const connectAccountQuery = graphql(accountQuery, {
  props: ({ data, ownProps }) => {
    const { account, ...accountData } = data
    return {
      ...ownProps,
      account: {
        ...accountData,
        data: mockAccount(account),
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 5 * 1000,
    variables: {
      id: match.params.accountId,
    },
  }),
})

const MeDelegatorQuery = gql`
  fragment DelegatorFragment on Delegator {
    id
    status
    delegateAddress
    bondedAmount
    fees
    delegatedAmount
    lastClaimRound
    startRound
    withdrawRound
  }

  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
    delegator {
      ...DelegatorFragment
    }
  }

  query MeDelegatorQuery {
    me {
      ...AccountFragment
    }
  }
`

const connectMeDelegatorQuery = graphql(MeDelegatorQuery, {
  props: ({ data, ownProps }) => {
    const { me, ...queryData } = data
    return {
      ...ownProps,
      me: {
        ...queryData,
        data: mockAccount(me),
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 5 * 1000,
    variables: {},
  }),
})

export const mapTransactionsToProps = mapProps(props => {
  const { currentRound, toasts, transactions: tx, ...nextProps } = props
  const { id: currentRoundNum, lastInitializedRound } = currentRound.data
  const { status, lastClaimRound } = nextProps.me.data.delegator
  const isUnbonded = status === 'Unbonded'
  const unclaimedRounds = isUnbonded
    ? ' 0'
    : MathBN.sub(lastInitializedRound, lastClaimRound)
  const hasUnclaimedRounds = !isUnbonded && currentRoundNum !== lastClaimRound
  return {
    ...nextProps,
    unbondFrom: async id => {
      if (!currentRound.data.initialized) {
        return toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unable to unbond',
          body: 'The current round is not initialized.',
        })
      }
      if (hasUnclaimedRounds) {
        return toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unable to unbond',
          body: 'You have unclaimed earnings from previous rounds.',
        })
      }
      try {
        toasts.push({
          id: 'unbond',
          title: 'Unbonding',
          body: 'Unbonding in progress.',
        })
        await window.livepeer.rpc.unbond()
        toasts.push({
          id: 'unbond',
          type: 'success',
          title: 'Unbonding Complete',
          body: 'Now, you must wait through the unbonding period.',
        })
      } catch (err) {
        toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unbond Failed',
          body: err.message,
        })
      }
    },
    bondTo: id => {
      if (!currentRound.data.initialized) {
        return toasts.push({
          id: 'bond',
          type: 'warn',
          title: 'Unable to bond',
          body: 'The current round is not initialized.',
        })
      }
      if (MathBN.gt(unclaimedRounds, '20')) {
        return toasts.push({
          id: 'bond',
          type: 'warn',
          title: 'Unable to bond',
          body: (
            <span>
              You have unclaimed earnings from more than 20 previous rounds.{' '}
              <br />
              <a href="/me/delegating">Claim Your Earnings</a>
            </span>
          ),
        })
      }
      tx.activate({
        id,
        type: 'BondStatus',
      })
    },
  }
})

export default compose(
  connectAccountQuery,
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectMeDelegatorQuery,
  connectToasts,
  mapTransactionsToProps,
  withTransactionHandlers,
)
