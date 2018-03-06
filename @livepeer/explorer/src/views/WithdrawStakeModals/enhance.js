import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  connectApproveMutation,
  connectClaimEarningsMutation,
  connectTransactions,
} from '../../enhancers'
import { mockAccount, sleep, wireTransactionToStatus } from '../../utils'

const MeDelegatorQuery = gql`
  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
    delegator {
      id
      delegateAddress
      bondedAmount
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
  const { approve, claimEarnings, transactions: tx, ...nextProps } = props
  const claimEarningsStatusQuery = { active: true, type: 'ClaimEarningsStatus' }
  const claimEarningsStatus =
    tx.findWhere(claimEarningsStatusQuery) ||
    tx.empty(claimEarningsStatusQuery.type)
  return {
    ...nextProps,
    claimEarningsStatus,
    onClose: () => tx.delete(claimEarningsStatus),
    onClaimEarnings: wireTransactionToStatus(
      tx,
      claimEarningsStatus,
      async ({ to, amount }) => {
        // return await claimEarnings({ variables: { to, amount } })
        return await sleep(1000, {
          transaction: {
            hash: '0xf00',
          },
        })
      },
    ),
  }
})

export default compose(
  connectApproveMutation,
  // connectClaimEarningsMutation,
  connectMeDelegatorQuery,
  connectTransactions,
  mapTransactionsToProps,
)
