import React from 'react'
import { compose, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  connectCurrentRoundQuery,
  connectProtocolQuery,
  connectToasts,
} from '../../enhancers'
import { MathBN } from '../../utils'
import { mockAccount } from '@livepeer/graphql-sdk'

const MeDelegatorTranscoderQuery = gql`
  fragment DelegatorFragment on Delegator {
    id
    status
    delegateAddress
    bondedAmount
    fees
    delegatedAmount
    lastClaimRound
    pendingStake
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
    rewards {
      rewardTokens
      round {
        id
      }
    }
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
    rewards {
      rewardTokens
      round {
        id
      }
    }
  }

  query TranscodersQuery {
    transcoders {
      ...TranscoderFragment
    }
  }
`

const connectTranscodersQuery = graphql(TranscodersQuery, {
  props: ({ data, ownProps }) => {
    let { transcoders, ...queryData } = data
    // Filter by registered transcoders
    // TODO: Use graphql variables instead when The Graph supports them
    if (transcoders) {
      transcoders = transcoders.filter(t => t.status === 'Registered')
    }
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
      first: 100,
    },
    fetchPolicy: 'cache-and-network',
  }),
})

const mapMutationHandlers = withHandlers({
  bond: ({ currentRound, history, me, protocol, toasts }) => ({ id }) => {
    const { id: lastInitializedRound } = currentRound.data
    const { status, lastClaimRound } = me.data.delegator
    const { maxEarningsClaimsRounds } = protocol.data
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
    if (MathBN.gt(unclaimedRounds, maxEarningsClaimsRounds)) {
      return toasts.push({
        id: 'bond',
        type: 'warn',
        title: 'Unable to bond',
        body: (
          <span>
            You have unclaimed earnings from more than {maxEarningsClaimsRounds}{' '}
            previous rounds. <br />
            <a href="/me/delegating">Claim Your Earnings</a>
          </span>
        ),
      })
    }
    history.push(`#/bond/${id}`)
  },
  unbond: ({ currentRound, history, me, toasts }) => async ({ id }) => {
    try {
      const { id: lastInitializedRound } = currentRound.data
      const { status, lastClaimRound } = me.data.delegator
      const { maxEarningsClaimsRounds } = protocol.data
      const isUnbonded = status === 'Unbonded'
      const unclaimedRounds = isUnbonded
        ? ' 0'
        : MathBN.sub(lastInitializedRound, lastClaimRound)
      if (!currentRound.data.initialized) {
        return toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unable to unbond',
          body: 'The current round is not initialized.',
        })
      }
      if (MathBN.gt(unclaimedRounds, maxEarningsClaimsRounds)) {
        return toasts.push({
          id: 'unbond',
          type: 'warn',
          title: 'Unable to unbond',
          body: (
            <span>
              You have unclaimed earnings from more than{' '}
              {maxEarningsClaimsRounds} previous rounds. <br />
              <a href="/me/delegating">Claim Your Earnings</a>
            </span>
          ),
        })
      }
      history.push(`#/unbond/${id}`)
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
    history.push(`#/unbond/${id}`)
  },
})

export default compose(
  connectCurrentRoundQuery,
  connectMeDelegatorTranscoderQuery,
  connectProtocolQuery,
  connectTranscodersQuery,
  connectToasts,
  mapMutationHandlers,
)
