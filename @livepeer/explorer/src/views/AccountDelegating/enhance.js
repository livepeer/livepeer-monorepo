import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mockDelegator } from '../../utils'
import { connectTransactions, connectCurrentRoundQuery } from '../../enhancers'

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

  query AccountDelegatorQuery($id: String!, $me: Boolean!) {
    me @include(if: $me) {
      id
      delegator {
        ...DelegatorFragment
      }
    }
    account(id: $id) @skip(if: $me) {
      id
      delegator {
        ...DelegatorFragment
      }
    }
  }
`

const connectAccountDelegatorQuery = graphql(AccountDelegatorQuery, {
  props: ({ data, ownProps }) => {
    const { account, me, ...queryProps } = data
    const { delegator } = me || account || {}
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
      id: match.params.accountId || '',
      me: !match.params.accountId,
    },
  }),
})

export const mapTransactionsToProps = mapProps(props => {
  const { transactions: tx, ...nextProps } = props
  return {
    ...nextProps,
    onWithdrawFees: id => () =>
      tx.activate({
        id,
        type: 'WithdrawFeesStatus',
      }),
    onWithdrawStake: id => () =>
      tx.activate({
        id,
        type: 'WithdrawStakeStatus',
      }),
    onClaimEarnings: id => () =>
      tx.activate({
        id,
        type: 'ClaimEarningsStatus',
      }),
  }
})

export default compose(
  connectCurrentRoundQuery,
  connectAccountDelegatorQuery,
  connectTransactions,
  mapTransactionsToProps,
)
