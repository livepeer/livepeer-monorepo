import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  connectApproveMutation,
  connectBondMutation,
  connectTransactions,
} from '../../enhancers'
import { sleep, wireTransactionToStatus } from '../../utils'

const meQuery = `
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
query MeQuery {
  me {
    ...AccountFragment
  }
}`

const connectMeQuery = graphql(gql(meQuery), {
  props: ({ data, ownProps }) => {
    const me = {
      id: '',
      ethBalance: '',
      tokenBalance: '',
      delegator: {
        id: '',
        bondedAmount: '',
        delegateAddress: '',
      },
      ...data.me,
    }
    return {
      ...ownProps,
      me: {
        data: me,
        error: data.error,
        fetchMore: data.fetchMore,
        refetch: data.refetch,
        loading: data.loading,
      },
    }
  },
  options: ({ match }) => {
    return {
      pollInterval: 5000,
      variables: {},
    }
  },
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
      // TODO: uncomment
      // await approve({ variables: { type: 'bond', amount } })
      // return await bond({ variables: { to, amount } })
      return await sleep(1000, {
        transaction: {
          hash: '0xf00',
        },
      })
    }),
  }
})

export default compose(
  connectApproveMutation,
  connectBondMutation,
  connectMeQuery,
  connectTransactions,
  mapTransactionsToProps,
)
