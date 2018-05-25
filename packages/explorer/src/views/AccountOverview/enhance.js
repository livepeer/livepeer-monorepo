import { compose, lifecycle } from 'recompose'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { mockAccount } from '../../utils'
import {
  connectCoinbaseQuery,
  connectTransactionsQuery,
  TransactionSubmittedSubscription,
  withTransactionHandlers,
} from '../../enhancers'

const accountQuery = gql`
  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
  }

  query AccountQuery($id: String!) {
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
    fetchPolicy: 'cache-and-network',
  }),
})

const subscribeToTransactionSubmitted = lifecycle({
  componentDidMount() {
    // causes re-render when subscription receives entries
    this.props.transactions.subscribeToMore({
      document: TransactionSubmittedSubscription,
      updateQuery: (prev, { subscriptionData }) => prev,
    })
  },
})

export default compose(
  connectAccountQuery,
  connectCoinbaseQuery,
  connectTransactionsQuery,
  withTransactionHandlers,
  withApollo,
  subscribeToTransactionSubmitted,
)
