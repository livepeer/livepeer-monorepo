// TODO: map apollo enhancer props to a namespace + flatten in camelcase via composed enhancer

import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connectTransactions } from '../../enhancers'
import { mockAccount, sleep } from '../../utils'

const MeDelegatorQuery = gql`
  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
    delegator {
      id
      delegateAddress
      bondedAmount
    }
  }

  query MeDelegatorQuery {
    me {
      ...AccountFragment
    }
  }
`

const connectMeDelegatorQuery = graphql(MeDelegatorQuery, {
  props: ({ data, ownProps }) => {
    const { me, ...queryData } = data
    return {
      ...ownProps,
      me: {
        ...queryData,
        data: mockAccount(me),
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 5 * 1000,
    variables: {},
  }),
})

const TranscodersQuery = gql`
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
    totalStake
  }

  query TranscodersQuery($skip: Int, $limit: Int) {
    transcoders(skip: $skip, limit: $limit) {
      ...TranscoderFragment
    }
  }
`

const connectTranscodersQuery = graphql(TranscodersQuery, {
  props: ({ data, ownProps }) => {
    const { transcoders, ...queryData } = data
    return {
      ...ownProps,
      transcoders: {
        ...queryData,
        data: transcoders || [],
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 30 * 1000,
    variables: {
      skip: 0,
      limit: 100,
    },
  }),
})

export const mapTransactionsToProps = mapProps(props => {
  const { transactions: tx, ...nextProps } = props
  return {
    ...nextProps,
    unbondFrom: id => () =>
      tx.activate({
        id,
        type: 'UnbondStatus',
      }),
    bondTo: id => () =>
      tx.activate({
        id,
        type: 'BondStatus',
      }),
  }
})

export default compose(
  connectMeDelegatorQuery,
  connectTranscodersQuery,
  connectTransactions,
  mapTransactionsToProps,
)
