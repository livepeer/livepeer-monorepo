import { compose, lifecycle, mapProps, withHandlers } from 'recompose'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { mockDelegator } from '../../utils'
import {
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectToasts,
  withTransactionHandlers,
} from '../../enhancers'

const AccountDelegatorQuery = gql`
  fragment DelegatorFragment on Delegator {
    id
    allowance
    status
    delegateAddress
    bondedAmount
    fees
    delegatedAmount
    lastClaimRound
    pendingFees
    pendingStake
    startRound
    withdrawRound
  }

  query AccountDelegatorQuery($id: String!) {
    account(id: $id) {
      id
      delegator {
        ...DelegatorFragment
      }
    }
  }
`

const connectAccountDelegatorQuery = graphql(AccountDelegatorQuery, {
  props: ({ data, ownProps }) => {
    const { account, ...queryProps } = data
    const { delegator } = account || {}
    return {
      ...ownProps,
      delegator: {
        ...queryProps,
        data: mockDelegator(delegator),
      },
    }
  },
  options: ({ match }) => ({
    // pollInterval: 60 * 1000,
    variables: {
      id: match.params.accountId,
    },
    // ssr: false,
    fetchPolicy: 'network-only',
  }),
})

const mapMutationHandlers = withHandlers({
  claimEarnings: ({ currentRound, history, toasts }) => () => {
    const isRoundInitialized = currentRound.data.initialized
    if (!isRoundInitialized) {
      return toasts.push({
        id: 'claim-earnings',
        type: 'warn',
        title: 'Unable to claim earnings',
        body: 'The current round is not initialized.',
      })
    }
    history.push('#/claim-earnings')
  },
  withdrawFees: ({ currentRound, delegator, toasts }) => async () => {
    try {
      const isRoundInitialized = currentRound.data.initialized
      const currentRoundNum = currentRound.data.id
      const { status, lastClaimRound } = delegator.data
      const hasUnclaimedRounds =
        status !== 'Unbonded' && currentRoundNum !== lastClaimRound
      if (hasUnclaimedRounds) {
        return toasts.push({
          id: 'withdraw-fees',
          type: 'warn',
          title: 'Unable to withdraw fees',
          body: 'You have unclaimed earnings from previous rounds.',
        })
      }
      await window.livepeer.rpc.withdrawFees()
      toasts.push({
        id: 'withdraw-fees',
        type: 'success',
        title: 'Withdrawal Complete',
        body: 'Your fees have successfully been withdrawn.',
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        toasts.push({
          id: 'withdraw-fees',
          type: 'error',
          title: 'Withdrawal Failed',
          body: err.message,
        })
      }
    }
  },
  withdrawStake: ({ currentRound, delegator, toasts }) => async () => {
    try {
      const isRoundInitialized = currentRound.data.initialized
      const { status } = delegator.data
      if (status !== 'Unbonded') {
        return toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Cannot withdraw stake',
          body:
            'First, you must unbond from your delegate and wait through the unbonding period.',
        })
      }
      if (!isRoundInitialized) {
        return toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Unable to withdraw stake',
          body: 'The current round is not initialized.',
        })
      }
      await window.livepeer.rpc.withdrawStake()
      toasts.push({
        id: 'withdraw-stake',
        type: 'success',
        title: 'Withdrawal Complete',
        body: 'Your stake has successfully been withdrawn.',
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        toasts.push({
          id: 'withdraw-stake',
          type: 'error',
          title: 'Withdrawal Failed',
          body: err.message,
        })
      }
    }
  },
})

export default compose(
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectAccountDelegatorQuery,
  connectToasts,
  withTransactionHandlers,
  mapMutationHandlers,
)
