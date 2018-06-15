import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { utils as gqlSDKUtils } from '@livepeer/graphql-sdk'
import { connectCoinbaseQuery, connectCurrentRoundQuery } from '../../enhancers'

const { mockTranscoder } = gqlSDKUtils

const AccountTranscoderQuery = gql`
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

  query AccountTranscoderQuery($id: String!) {
    account(id: $id) {
      id
      transcoder {
        ...TranscoderFragment
      }
    }
  }
`

const connectAccountTranscoderQuery = graphql(AccountTranscoderQuery, {
  props: ({ data, ownProps }) => {
    const { account, ...queryProps } = data
    const { transcoder } = account || {}
    return {
      ...ownProps,
      transcoder: {
        ...queryProps,
        data: mockTranscoder(transcoder),
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 30 * 1000,
    variables: {
      id: match.params.accountId,
    },
  }),
})

export default compose(
  connectCoinbaseQuery,
  connectAccountTranscoderQuery,
  connectCurrentRoundQuery,
)
