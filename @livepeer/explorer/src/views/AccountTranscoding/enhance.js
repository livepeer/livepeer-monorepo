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
  rewardCut
  feeShare
  pricePerSegment
  pendingRewardCut
  pendingFeeShare
  pendingPricePerSegment
}
query AccountTranscoderQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    id
    transcoder {
      ...TranscoderFragment
    }
  }
  account(id: $id) @skip(if: $me) {
    id
    transcoder {
      ...TranscoderFragment
    }
  }
}`

const setProps = ({ data, ownProps }) => {
  const transcoder = {
    deposit: '',
    withdrawBlock: '',
    jobs: [],
    ...(data.account || {}).transcoder,
    ...(data.me || {}).transcoder,
  }
  return {
    ...ownProps,
    error: data.error,
    refetch: data.refetch,
    fetchMore: data.fetchMore,
    loading: data.loading,
    transcoder,
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
