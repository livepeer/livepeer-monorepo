import React from 'react'
import { compose, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FORM_ERROR } from 'final-form'
import { MathBN } from '../../utils'
import {
  connectCoinbaseQuery,
  connectCurrentBlockQuery,
  connectCurrentRoundQuery,
  connectBondMutation,
  connectRebondFromUnbondedMutation,
  connectRebondMutation,
  connectToasts,
} from '../../enhancers'
import { mockDelegator } from '@livepeer/graphql-sdk'

const AccountDelegatorQuery = gql`
  fragment DelegatorFragment on Delegator {
    id
    allowance
    status
    delegateAddress
    bondedAmount
    fees
    delegatedAmount
    lastClaimRound
    pendingFees
    pendingStake
    startRound
    withdrawAmount
    withdrawRound
  }

  query AccountDelegatorQuery($id: String!, $lockId: String!) {
    account(id: $id) {
      id
      delegator {
        ...DelegatorFragment
      }

      unbondlock(lockId: $lockId) {
        id
        amount
        withdrawRound
        delegator
      }
    }
  }
`

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

  query TranscodersQuery($skip: Int!, $first: Int!) {
    transcoders(skip: $skip, first: $first) {
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
      first: 2,
    },
    fetchPolicy: 'cache-and-network',
  }),
})

const connectAccountDelegatorQuery = graphql(AccountDelegatorQuery, {
  props: ({ data, ownProps }) => {
    console.log('in rebonding')

    console.log({ data })
    console.log({ ownProps })
    const { account, ...queryProps } = data
    console.log({ account })
    const { delegator, unbondlock } = account || {}

    let result = {
      ...ownProps,
      delegator: {
        ...queryProps,
        data: mockDelegator(delegator),
      },
      unbondlock,
    }
    console.log('in rebonding')
    console.log({ result })
    return result
  },
  options: ({ match }) => {
    console.log('in rebonding match')
    console.log({ match })
    return {
      // pollInterval: 60 * 1000,
      variables: {
        id: match.params.delegateAddress,
        lockId: match.params.lockId,
      },
      // ssr: false,
      fetchPolicy: 'network-only',
    }
  },
})

const mapMutationHandlers = withHandlers({
  bond: ({
    bond,
    rebondFromUnbonded,
    rebond,
    toasts,
    unbondlock,
    transcoders,
    currentRound,
    history,
    delegator,
  }) => async () => {
    try {
      const { id: lastInitializedRound } = currentRound.data
      const { status, lastClaimRound } = delegator['data']
      const isUnbonded = status === 'Unbonded'
      const unclaimedRounds = isUnbonded
        ? ' 0'
        : MathBN.sub(lastInitializedRound, lastClaimRound)
      if (!currentRound.data.initialized) {
        history.goBack()
        return toasts.push({
          id: 'bond',
          type: 'warn',
          title: 'Unable to bond',
          body: 'The current round is not initialized.',
        })
      }
      if (MathBN.gt(unclaimedRounds, '20')) {
        history.goBack()
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

      let { id, amount } = unbondlock
      id = parseInt(id)

      // check if the user is currently partially bonded to a delegator
      let { delegateAddress } = delegator
      let delegate = transcoders['data'][0]['id']

      if (delegateAddress) delegate = delegateAddress

      console.log('In bonding')
      console.log({ amount })
      console.log({ id })

      // const hasAmount = amount && amount.replace(/0|\./g, '')
      // const wei = hasAmount ? toBaseUnit(amount) : '0'
      console.log('rebond', delegate, `${amount} LPT`)
      console.log('bonding...')
      console.log({ rebondFromUnbonded })
      // await window.livepeer.rpc.rebondFromUnbonded(delegate, id, { gas: 3200000 })

      await rebondFromUnbonded({
        variables: { delegate, unbondingLockId: id },
        refreshQueries: ['AccountDelegatorQuery', 'TranscodersQuery'],
      })

      toasts.push({
        id: 'bond',
        type: 'success',
        title: 'Bonded Token',
        body: `Successfully bonded ${amount} LPT to ${delegate}`,
      })
    } catch (err) {
      console.log('error bonding token')
      console.log({ err })
      if (!/User denied/.test(err.message)) {
        // Push notification if error is not a user cancel error
        toasts.push({
          id: 'bond',
          type: 'error',
          title: 'Error Bonding',
          body: 'There was a problem bonding your token',
        })
      }
      // resolve the submitError -- do not throw!
      // https://github.com/final-form/react-final-form#submission-errors
      return {
        [FORM_ERROR]: err.message.replace('GraphQL error: ', ''),
      }
    }
  },
})

export default compose(
  connectCoinbaseQuery,
  connectCurrentBlockQuery,
  connectCurrentRoundQuery,
  connectAccountDelegatorQuery,
  connectTranscodersQuery,
  connectBondMutation,
  connectRebondFromUnbondedMutation,
  connectRebondMutation,
  connectToasts,
  mapMutationHandlers,
)
