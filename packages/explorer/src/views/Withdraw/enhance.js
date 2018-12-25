import { compose, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FORM_ERROR } from 'final-form'
import { mockDelegator } from '@livepeer/graphql-sdk'
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
    withdrawAmount
    withdrawRound
  }

  query AccountDelegatorQuery($id: String!, $lockId: String!) {
    account(id: $id) {
      id
      delegator {
        ...DelegatorFragment
      }

      unbondlock(lockId: $lockId) {
        id
        amount
        withdrawRound
        delegator
      }
    }
  }
`

const connectAccountDelegatorQuery = graphql(AccountDelegatorQuery, {
  props: ({ data, ownProps }) => {
    const { account, ...queryProps } = data
    const { delegator, unbondlock } = account || {}

    let result = {
      ...ownProps,
      delegator: {
        ...queryProps,
        data: mockDelegator(delegator),
      },
      unbondlock,
    }

    return result
  },
  options: ({ match, location }) => {
    // pollInterval: 60 * 1000,
    const {
      state: { accountId },
    } = location

    return {
      variables: {
        id: accountId,
        lockId: match.params.lockId,
      },
      // ssr: false,
      fetchPolicy: 'network-only',
    }
  },
})

const mapMutationHandlers = withHandlers({
  withdrawStake: ({ currentRound, delegator, toasts }) => async () => {
    try {
      const isRoundInitialized = currentRound.data.initialized
      const { status, withdrawAmount } = delegator.data
      if (status === 'Unbonding') {
        toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Cannot withdraw stake',
          body: 'First, you must wait through the unbonding period.',
        })
        throw new Error('First, you must wait through the unbonding period.')
      }
      if (withdrawAmount === '0') {
        toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Cannot withdraw stake',
          body: 'You have nothing to withdraw',
        })
        throw new Error('You have nothing to withdraw')
      }
      if (!isRoundInitialized) {
        toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Unable to withdraw stake',
          body: 'The current round is not initialized.',
        })
        throw new Error('The current round is not initialized.')
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
      return {
        [FORM_ERROR]: err.message,
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
