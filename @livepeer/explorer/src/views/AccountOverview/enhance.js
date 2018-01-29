import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { pathInfo } from '../../utils'
import { withTransactionHandlers } from '../../enhancers'

const query = `
fragment AccountFragment on Account {
  id
  ethBalance
  tokenBalance
}
query AccountOverviewQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    ...AccountFragment
  }
  account(id: $id) @skip(if: $me) {
    ...AccountFragment
  }
}`

const setProps = ({ data, ownProps }) => {
  return {
    ...ownProps,
    error: data.error,
    refetch: data.refetch,
    fetchMore: data.fetchMore,
    loading: data.loading,
    account: data.me || data.account || {},
  }
}

const setOptions = ({ match }) => {
  return {
    pollInterval: 5000,
    variables: {
      id: pathInfo.getAccountParam(match.path),
      me: pathInfo.isMe(match.path),
    },
  }
}

const connectApollo = graphql(gql(query), {
  props: setProps,
  options: setOptions,
})

export default compose(connectApollo, withTransactionHandlers)
