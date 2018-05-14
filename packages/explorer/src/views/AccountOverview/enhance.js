import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mockAccount } from '../../utils'
import { connectCoinbaseQuery, withTransactionHandlers } from '../../enhancers'

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
  }),
})

export default compose(
  connectAccountQuery,
  connectCoinbaseQuery,
  withTransactionHandlers,
)
