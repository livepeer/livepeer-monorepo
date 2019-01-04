import React from 'react'
import { compose, withHandlers } from 'recompose'
import { FORM_ERROR } from 'final-form'
import { MathBN } from '../../utils'
import {
  connectCoinbaseQuery,
  connectCurrentBlockQuery,
  connectCurrentRoundQuery,
  connectProtocolQuery,
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
    protocol,
  }) => async () => {
    try {
      const { id: lastInitializedRound } = currentRound.data
      const { status, lastClaimRound } = delegator['data']
      const { maxEarningsClaimsRounds } = protocol.data
      const isUnbonded = status === 'Unbonded'
      const unclaimedRounds = isUnbonded
        ? ' 0'
        : MathBN.sub(lastInitializedRound, lastClaimRound)

      let err = {
        id: 'rebond',
        type: 'warn',
        title: 'Unable to bond',
      }

      let body = null

      if (!currentRound.data.initialized) {
        body = 'The current round is not initialized.'
      }

      if (MathBN.gt(unclaimedRounds, maxEarningsClaimsRounds)) {
        body = (
          <span>
            You have unclaimed earnings from more than $
            {maxEarningsClaimsRounds} previous rounds. <br />
            <a href="/me/delegating">Claim Your Earnings</a>
          </span>
        )
      }

      if (body) {
        history.goBack()
        err = { body, ...err }
        toasts.push(err)
        return {
          [FORM_ERROR]: body,
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
      console.log('rebonding...')

      if (bondedAmount > 0) {
        await rebond({
          variables: { unbondingLockId: id },
          refreshQueries: [
            'AccountDelegatorQuery',
            'TranscodersQuery',
            'AccountDelegatorUnbondLockQuery',
          ],
        })
      } else {
        await rebondFromUnbonded({
          variables: { delegate, unbondingLockId: id },
          refreshQueries: [
            'AccountDelegatorQuery',
            'TranscodersQuery',
            'AccountDelegatorUnbondLockQuery',
          ],
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
  connectProtocolQuery,
  connectTranscodersQuery,
  connectAccountDelegatorUnbondLockQuery,
  connectRebondFromUnbondedMutation,
  connectRebondMutation,
  connectToasts,
  mapMutationHandlers,
)
