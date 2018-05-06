import { compose, mapProps } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  connectCurrentRoundQuery,
  connectToasts,
  connectTransactions,
} from '../../enhancers'
import { mockAccount, sleep } from '../../utils'

const MeDelegatorQuery = gql`
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

  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
    delegator {
      ...DelegatorFragment
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
  const { currentRound, toasts, transactions: tx, ...nextProps } = props
  const currentRoundNum = currentRound.data.id
  const { status, lastClaimRound } = nextProps.me.data.delegator
  const hasUnclaimedRounds =
    status !== 'Unbonded' && currentRoundNum !== lastClaimRound
  return {
    ...nextProps,
    unbondFrom: id => async () => {
      if (!currentRound.data.initialized) {
        return toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unable to unbond',
          body: 'The current round is not initialized.',
        })
      }
      if (hasUnclaimedRounds) {
        return toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unable to unbond',
          body: 'You have unclaimed earnings from previous rounds.',
        })
      }
      try {
        toasts.push({
          id: 'unbond',
          title: 'Unbonding',
          body: 'Unbonding in progress.',
        })
        await window.livepeer.rpc.unbond()
        toasts.push({
          id: 'unbond',
          type: 'success',
          title: 'Unbonding Complete',
          body: 'Now, you must wait through the unbonding period.',
        })
      } catch (err) {
        toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unbond Failed',
          body: err.message,
        })
      }
    },
    bondTo: id => () => {
      if (!currentRound.data.initialized) {
        return toasts.push({
          id: 'bond',
          type: 'warn',
          title: 'Unable to bond',
          body: 'The current round is not initialized.',
        })
      }
      if (hasUnclaimedRounds) {
        return toasts.push({
          id: 'bond',
          type: 'warn',
          title: 'Unable to bond',
          body: 'You have unclaimed earnings from previous rounds.',
        })
      }
      tx.activate({
        id,
        type: 'BondStatus',
      })
    },
  }
})

export default compose(
  connectCurrentRoundQuery,
  connectMeDelegatorQuery,
  connectTranscodersQuery,
  connectToasts,
  connectTransactions,
  mapTransactionsToProps,
)
