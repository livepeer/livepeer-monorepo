import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mockAccount } from '../../utils'
import { withPathMatches, withTransactionHandlers } from '../../enhancers'

const accountQuery = gql`
  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
  }

  query AccountOverviewQuery($id: String!, $me: Boolean!) {
    me @include(if: $me) {
      ...AccountFragment
    }
    account(id: $id) @skip(if: $me) {
      ...AccountFragment
    }
  }
`

const connectAccountQuery = graphql(accountQuery, {
  props: ({ data, ownProps }) => {
    const { account, me, ...accountData } = data
    return {
      ...ownProps,
      account: {
        ...accountData,
        data: mockAccount(me || account),
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

export default compose(connectAccountQuery, withTransactionHandlers)
