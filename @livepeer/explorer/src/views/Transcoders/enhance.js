import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { pathInfo } from '../../utils'
import { withTransactionHandlers } from '../../enhancers'

const query = `
fragment TranscoderFragment on Transcoder {
  id
  active
  status
  lastRewardRound
  blockRewardCut
  feeShare
  pricePerSegment
  pendingBlockRewardCut
  pendingFeeShare
  pendingPricePerSegment
  totalStake
}
query TranscodersQuery(
  $skip: Int,
  $limit: Int
) {
  transcoders(skip: $skip, limit: $limit) {
    ...TranscoderFragment
  }
}`

const setProps = ({ data, ownProps }) => {
  return {
    ...ownProps,
    error: data.error,
    refetch: data.refetch,
    fetchMore: data.fetchMore,
    loading: data.loading,
    transcoders: data.transcoders || [],
  }
}

const setOptions = ({ match }) => {
  return {
    pollInterval: 60 * 1000,
    variables: {
      skip: 0,
      limit: 100,
    },
  }
}

const connectApollo = graphql(gql(query), {
  props: setProps,
  options: setOptions,
})

export default compose(connectApollo, withTransactionHandlers)
