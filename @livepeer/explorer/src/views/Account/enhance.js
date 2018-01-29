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
query AccountQuery(
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
  const account = {
    id: '',
    ...data.me,
    ...data.account,
  }
  return {
    ...ownProps,
    account,
    color: `#${account.id.substr(2, 6)}aa`,
    error: data.error,
    fetchMore: data.fetchMore,
    refetch: data.refetch,
    loading: data.loading,
  }
}

const setOptions = ({ match }) => {
  const { account } = match.params
  return {
    pollInterval: 5000,
    variables: {
      id: match.params.account || '',
      me: !match.params.account,
    },
  }
}

const connectApollo = graphql(gql(query), {
  props: setProps,
  options: setOptions,
})

export default compose(connectApollo, withTransactionHandlers)
