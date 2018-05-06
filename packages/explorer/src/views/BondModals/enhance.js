import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  connectApproveMutation,
  connectBondMutation,
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
  const { approve, bond, transactions: tx, ...nextProps } = props
  const bondStatusQuery = { active: true, type: 'BondStatus' }
  const bondStatus =
    tx.findWhere(bondStatusQuery) || tx.empty(bondStatusQuery.type)
  return {
    ...nextProps,
    bondStatus,
    onClose: () => tx.delete(bondStatus),
    onBond: wireTransactionToStatus(tx, bondStatus, async ({ to, amount }) => {
      if (amount) {
        await approve({ variables: { type: 'bond', amount } })
      }
      return await bond({ variables: { to, amount } })
    }),
  }
})

export default compose(
  connectApproveMutation,
  connectBondMutation,
  connectMeDelegatorQuery,
  connectTransactions,
  mapTransactionsToProps,
)
