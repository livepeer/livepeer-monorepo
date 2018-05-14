import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mockDelegator } from '../../utils'
import {
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectToasts,
  connectTransactions,
} from '../../enhancers'

const AccountDelegatorQuery = gql`
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
    pollInterval: 5 * 1000,
    variables: {
      id: match.params.accountId,
    },
    // ssr: false,
    fetchPolicy: 'network-only',
  }),
})

export const mapTransactionsToProps = mapProps(props => {
  const { toasts, transactions: tx, ...nextProps } = props
  const isRoundInitialized = nextProps.currentRound.data.initialized
  const currentRoundNum = nextProps.currentRound.data.id
  const { status, lastClaimRound } = nextProps.delegator.data
  const hasUnclaimedRounds =
    status !== 'Unbonded' && currentRoundNum !== lastClaimRound
  return {
    ...nextProps,
    onWithdrawFees: id => async () => {
      if (hasUnclaimedRounds) {
        return toasts.push({
          id: 'withdraw-fees',
          type: 'warn',
          title: 'Unable to withdraw fees',
          body: 'You have unclaimed earnings from previous rounds.',
        })
      }
      try {
        toasts.push({
          id: 'withdraw-fees',
          title: 'Withdrawing Fees',
          body: 'Withdrawing fees in progress.',
        })
        await window.livepeer.rpc.withdrawFees()
        toasts.push({
          id: 'withdraw-fees',
          type: 'success',
          title: 'Withdrawal Complete',
          body: 'Your fees have successfully been withdrawn.',
        })
      } catch (err) {
        toasts.push({
          id: 'withdraw-fees',
          type: 'error',
          title: 'Withdrawal Failed',
          body: err.message,
        })
      }
    },
    onWithdrawStake: id => async () => {
      if (status !== 'Unbonded') {
        return toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Unable to withdraw stake',
          body: 'You must unbond from your delegate first.',
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
      try {
        toasts.push({
          id: 'withdraw-stake',
          title: 'Withdrawing Stake',
          body: 'Withdrawing stake in progress.',
        })
        await window.livepeer.rpc.withdrawStake()
        toasts.push({
          id: 'withdraw-stake',
          type: 'success',
          title: 'Withdrawal Complete',
          body: 'Your stake has successfully been withdrawn.',
        })
      } catch (err) {
        toasts.push({
          id: 'withdraw-stake',
          type: 'error',
          title: 'Withdrawal Failed',
          body: err.message,
        })
      }
    },
    onClaimEarnings: id => () => {
      if (!isRoundInitialized) {
        return toasts.push({
          id: 'claim-earnings',
          type: 'warn',
          title: 'Unable to claim earnings',
          body: 'The current round is not initialized.',
        })
      }
      tx.activate({
        id,
        type: 'ClaimEarningsStatus',
      })
    },
  }
})

export default compose(
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectAccountDelegatorQuery,
  connectToasts,
  connectTransactions,
  mapTransactionsToProps,
)
