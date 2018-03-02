import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mockTranscoder } from '../../utils'
// import { withTransactionHandlers } from '../../enhancers'

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

  query AccountTranscoderQuery($id: String!, $me: Boolean!) {
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
  }
`

const connectAccountTranscoderQuery = graphql(AccountTranscoderQuery, {
  props: ({ data, ownProps }) => {
    const { account, me, ...queryProps } = data
    const { transcoder } = me || account || {}
    return {
      ...ownProps,
      transcoder: {
        ...queryProps,
        data: mockTranscoder(transcoder),
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

export default compose(connectAccountTranscoderQuery)
