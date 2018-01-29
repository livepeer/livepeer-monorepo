import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { pathInfo } from '../../utils'
import { withTransactionHandlers } from '../../enhancers'

const query = `
fragment BroadcasterFragment on Broadcaster {
  id
  deposit
  withdrawBlock
}
fragment JobFragment on Job {
  id
  broadcaster
  streamId
  profiles {
    id
    name
    bitrate
    framerate
    resolution
  }
}
query AccountBroadcasterAndJobsQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    id
    broadcaster {
      ...BroadcasterFragment
      jobs {
        ...JobFragment
      }
    }
  }
  account(id: $id) @skip(if: $me) {
    id
    broadcaster {
      ...BroadcasterFragment
      jobs {
        ...JobFragment
      }
    }
  }
}`

const setProps = ({ data, ownProps }) => {
  const broadcaster = {
    deposit: '',
    withdrawBlock: '',
    jobs: [],
    ...(data.account || {}).broadcaster,
    ...(data.me || {}).broadcaster,
  }
  return {
    ...ownProps,
    error: data.error,
    refetch: data.refetch,
    fetchMore: data.fetchMore,
    loading: data.loading,
    broadcaster,
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
