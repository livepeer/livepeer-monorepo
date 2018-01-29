import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { pathInfo } from '../../utils'
import { withTransactionHandlers } from '../../enhancers'

const query = `
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
query AccountDelegatorQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    id
    delegator {
      ...DelegatorFragment
    }
  }
  account(id: $id) @skip(if: $me) {
    id
    delegator {
      ...DelegatorFragment
    }
  }
}
`

const setProps = ({ data, ownProps }) => {
  const delegator = {
    jobs: [],
    ...(data.account || {}).delegator,
    ...(data.me || {}).delegator,
  }
  return {
    ...ownProps,
    error: data.error,
    refetch: data.refetch,
    fetchMore: data.fetchMore,
    loading: data.loading,
    delegator,
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
