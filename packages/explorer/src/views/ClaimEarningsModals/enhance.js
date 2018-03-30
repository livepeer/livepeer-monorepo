import { compose, mapProps } from 'recompose'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import {
  connectCurrentRoundQuery,
  connectClaimEarningsMutation,
  connectTransactions,
} from '../../enhancers'
import { mockAccount, sleep, wireTransactionToStatus } from '../../utils'

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

  query MeDelegatorQuery {
    me {
      id
      delegator {
        ...DelegatorFragment
      }
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
    pollInterval: 30 * 1000,
    variables: {},
    // ssr: false,
    fetchPolicy: 'network-only',
  }),
})

export const mapTransactionsToProps = mapProps(props => {
  const { approve, claimEarnings, transactions: tx, ...nextProps } = props
  const claimEarningsStatusQuery = { active: true, type: 'ClaimEarningsStatus' }
  const claimEarningsStatus =
    tx.findWhere(claimEarningsStatusQuery) ||
    tx.empty(claimEarningsStatusQuery.type)
  return {
    ...nextProps,
    claimEarningsStatus,
    onClose: () => tx.delete(claimEarningsStatus),
    onClaimMore: () => tx.reset(claimEarningsStatus),
    onClaimEarnings: wireTransactionToStatus(
      tx,
      claimEarningsStatus,
      async ({ endRound }) =>
        await claimEarnings({
          variables: { endRound },
          update: store => {
            const data = store.readQuery({ query: MeDelegatorQuery })
            data.me.delegator.lastClaimRound = endRound
            store.writeQuery({ query: MeDelegatorQuery, data })
          },
        }),
    ),
  }
})

export default compose(
  withApollo,
  connectCurrentRoundQuery,
  connectClaimEarningsMutation,
  connectMeDelegatorQuery,
  connectTransactions,
  mapTransactionsToProps,
)
