import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mockBroadcaster } from '../../utils'
import { withTransactionHandlers } from '../../enhancers'

const AccountBroadcasterAndJobsQuery = gql`
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

  query AccountBroadcasterAndJobsQuery($id: String!, $me: Boolean!) {
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
  }
`

const connectAccountBroadcasterAndJobsQuery = graphql(
  AccountBroadcasterAndJobsQuery,
  {
    props: ({ data, ownProps }) => {
      const { account, me, ...queryProps } = data
      const { broadcaster } = me || account || {}
      return {
        ...ownProps,
        broadcaster: {
          ...queryProps,
          data: mockBroadcaster(broadcaster),
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
  },
)

export default compose(
  connectAccountBroadcasterAndJobsQuery,
  withTransactionHandlers,
)
