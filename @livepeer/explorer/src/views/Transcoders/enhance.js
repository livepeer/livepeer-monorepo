// TODO: map apollo enhancer props to a namespace + flatten in camelcase via composed enhancer

import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import unit from 'ethjs-unit'
import { connectTransactions } from '../../enhancers'
import { pathInfo, promptForArgs, sleep, toBaseUnit } from '../../utils'

const meQuery = `
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
query MeQuery {
  me {
    ...AccountFragment
  }
}`

const connectMeQuery = graphql(gql(meQuery), {
  props: ({ data, ownProps }) => {
    const me = {
      id: '',
      ethBalance: '',
      tokenBalance: '',
      delegator: {
        id: '',
        bondedAmount: '',
        delegateAddress: '',
      },
      ...data.me,
    }
    return {
      ...ownProps,
      me,
      error: data.error,
      fetchMore: data.fetchMore,
      refetch: data.refetch,
      loading: data.loading,
    }
  },
  options: ({ match }) => {
    return {
      pollInterval: 5000,
      variables: {},
    }
  },
})

const transcodersQuery = `
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
query TranscodersQuery(
  $skip: Int,
  $limit: Int
) {
  transcoders(skip: $skip, limit: $limit) {
    ...TranscoderFragment
  }
}`

const connectTranscodersQuery = graphql(gql(transcodersQuery), {
  props: ({ data, ownProps }) => {
    return {
      ...ownProps,
      error: data.error,
      refetch: data.refetch,
      fetchMore: data.fetchMore,
      loading: data.loading,
      transcoders: data.transcoders || [],
    }
  },
  options: ({ match }) => {
    return {
      pollInterval: 30 * 1000, // every 30s
      variables: {
        skip: 0,
        limit: 100,
      },
    }
  },
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
  connectMeQuery,
  connectTranscodersQuery,
  connectTransactions,
  mapTransactionsToProps,
)
