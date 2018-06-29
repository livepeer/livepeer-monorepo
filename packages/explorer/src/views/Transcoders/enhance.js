import React from 'react'
import { compose, mapProps, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { connectCurrentRoundQuery, connectToasts } from '../../enhancers'
import { MathBN, sleep } from '../../utils'
import { utils as gqlSDKUtils } from '@livepeer/graphql-sdk'

const { mockAccount } = gqlSDKUtils

const MeDelegatorTranscoderQuery = gql`
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

  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
    delegator {
      ...DelegatorFragment
    }
    transcoder {
      ...TranscoderFragment
    }
  }

  query MeDelegatorTranscoderQuery {
    me {
      ...AccountFragment
    }
  }
`

const connectMeDelegatorTranscoderQuery = graphql(MeDelegatorTranscoderQuery, {
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
    ensName
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
    pollInterval: 10 * 1000,
    variables: {
      skip: 0,
      limit: 100,
    },
    fetchPolicy: 'cache-and-network',
  }),
})

const mapMutationHandlers = withHandlers({
  bond: ({ currentRound, history, me, toasts }) => ({ id }) => {
    const { id: currentRoundNum, lastInitializedRound } = currentRound.data
    const { status, lastClaimRound } = me.data.delegator
    const isUnbonded = status === 'Unbonded'
    const unclaimedRounds = isUnbonded
      ? ' 0'
      : MathBN.sub(lastInitializedRound, lastClaimRound)
    if (!currentRound.data.initialized) {
      return toasts.push({
        id: 'bond',
        type: 'warn',
        title: 'Unable to bond',
        body: 'The current round is not initialized.',
      })
    }
    if (MathBN.gt(unclaimedRounds, '20')) {
      return toasts.push({
        id: 'bond',
        type: 'warn',
        title: 'Unable to bond',
        body: (
          <span>
            You have unclaimed earnings from more than 20 previous rounds.{' '}
            <br />
            <a href="/me/delegating">Claim Your Earnings</a>
          </span>
        ),
      })
    }
    history.push(`#/bond/${id}`)
  },
  unbond: ({ currentRound, me, toasts }) => async ({ id }) => {
    try {
      const { id: currentRoundNum, lastInitializedRound } = currentRound.data
      const { status, lastClaimRound } = me.data.delegator
      const isUnbonded = status === 'Unbonded'
      const unclaimedRounds = isUnbonded
        ? ' 0'
        : MathBN.sub(lastInitializedRound, lastClaimRound)
      const hasUnclaimedRounds =
        !isUnbonded && currentRoundNum !== lastClaimRound
      if (!currentRound.data.initialized) {
        return toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unable to unbond',
          body: 'The current round is not initialized.',
        })
      }
      if (MathBN.gt(unclaimedRounds, '20')) {
        return toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unable to unbond',
          body: (
            <span>
              You have unclaimed earnings from more than 20 previous rounds.{' '}
              <br />
              <a href="/me/delegating">Claim Your Earnings</a>
            </span>
          ),
        })
      }
      await window.livepeer.rpc.unbond()
      toasts.push({
        id: 'unbond',
        type: 'success',
        title: 'Unbonding Complete',
        body: `Successfully unbonded from ${id}`,
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        toasts.push({
          id: 'unbond',
          type: 'error',
          title: 'Unbond Failed',
          body: err.message,
        })
      }
    }
  },
})

export default compose(
  connectCurrentRoundQuery,
  connectMeDelegatorTranscoderQuery,
  connectTranscodersQuery,
  connectToasts,
  mapMutationHandlers,
)
