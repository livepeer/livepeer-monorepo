import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mockBroadcaster } from '../../utils'
import { connectCoinbaseQuery, withTransactionHandlers } from '../../enhancers'

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

  query AccountBroadcasterAndJobsQuery($id: String!) {
    account(id: $id) {
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
      const { account, ...queryProps } = data
      const { broadcaster } = account || {}
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
        id: match.params.accountId,
      },
    }),
  },
)

export default compose(
  connectAccountBroadcasterAndJobsQuery,
  connectCoinbaseQuery,
  withTransactionHandlers,
)
