import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  connectApproveMutation,
  connectUnbondMutation,
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
  const { approve, unbond, transactions: tx, ...nextProps } = props
  const unbondStatusQuery = { active: true, type: 'UnbondStatus' }
  const unbondStatus =
    tx.findWhere(unbondStatusQuery) ||
    tx.empty(unbondStatusQuery.type)
  return {
    ...nextProps,
    unbondStatus,
    onClose: () => tx.delete(unbondStatus),
    onUnbond: wireTransactionToStatus(
      tx,
      unbondStatus,
      async ({ to, amount }) => {
        // return await unbond({ variables: { to, amount } })
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
  // connectUnbondMutation,
  connectMeDelegatorQuery,
  connectTransactions,
  mapTransactionsToProps,
)
