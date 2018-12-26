import React from 'react'
import { compose, withHandlers } from 'recompose'
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
  connectTranscodersQuery,
  connectAccountDelegatorUnbondLockQuery,
} from '../../enhancers'

const mapMutationHandlers = withHandlers({
  bond: ({
    rebond,
    rebondFromUnbonded,
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
        toasts.push({
          id: 'rebond',
          type: 'warn',
          title: 'Unable to bond',
          body: 'The current round is not initialized.',
        })
        return {
          [FORM_ERROR]: 'The current round is not initialized.',
        }
      }
      if (MathBN.gt(unclaimedRounds, '20')) {
        history.goBack()
        toasts.push({
          id: 'rebond',
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
        return {
          [FORM_ERROR]: 'Unable to bond',
        }
      }

      let { id, amount } = unbondlock
      id = parseInt(id)

      // check if the user is currently partially bonded to a delegator
      let { delegateAddress, bondedAmount } = delegator['data'] || {}
      bondedAmount = parseInt(bondedAmount)

      let delegate = transcoders['data'][0]['id']
      if (delegateAddress) delegate = delegateAddress

      console.log('rebond', delegate, `${amount} LPT`)
      console.log('bonding...')

      if (bondedAmount > 0) {
        await rebond({
          variables: { unbondingLockId: id },
          refreshQueries: ['AccountDelegatorQuery', 'TranscodersQuery'],
        })
      } else {
        await rebondFromUnbonded({
          variables: { delegate, unbondingLockId: id },
          refreshQueries: ['AccountDelegatorQuery', 'TranscodersQuery'],
        })
      }

      toasts.push({
        id: 'rebond',
        type: 'success',
        title: 'Rebonded Token',
        body: `Successfully rebonded ${amount} LPT to ${delegate}`,
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        // Push notification if error is not a user cancel error
        toasts.push({
          id: 'rebond',
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
  connectTranscodersQuery,
  connectAccountDelegatorUnbondLockQuery,
  connectBondMutation,
  connectRebondFromUnbondedMutation,
  connectRebondMutation,
  connectToasts,
  mapMutationHandlers,
)
