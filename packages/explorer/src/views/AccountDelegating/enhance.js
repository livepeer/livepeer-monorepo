import React from 'react'
import { compose, withHandlers } from 'recompose'
import {
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectProtocolQuery,
  connectToasts,
  withTransactionHandlers,
  connectAccountDelegatorQuery,
} from '../../enhancers'
import { MathBN } from '../../utils'

const mapMutationHandlers = withHandlers({
  processRebond: ({ currentRound, history, toasts, delegator, protocol }) => ({
    accountId,
    hash,
  }) => {
    const {
      id: lastInitializedRound,
      initialized: isRoundInitialized,
    } = currentRound.data
    const { maxEarningsClaimsRounds } = protocol.data
    const { status, lastClaimRound } = delegator['data']
    const isUnbonded = status === 'Unbonded'
    const unclaimedRounds = isUnbonded
      ? ' 0'
      : MathBN.sub(lastInitializedRound, lastClaimRound)

    if (!isRoundInitialized) {
      return toasts.push({
        id: 'rebond',
        type: 'warn',
        title: 'Unable to rebond',
        body: 'The current round is not initialized.',
      })
    }

    if (MathBN.gt(unclaimedRounds, maxEarningsClaimsRounds)) {
      return toasts.push({
        id: 'rebond',
        type: 'warn',
        title: 'Unable to rebond',
        body: (
          <span>
            You have unclaimed earnings from more than
            {maxEarningsClaimsRounds} previous rounds. <br />
            <a href="/me/delegating">Claim Your Earnings</a>
          </span>
        ),
      })
    }

    history.push({ hash, state: { accountId } })
  },
  processWithdraw: ({
    currentRound,
    history,
    toasts,
    delegator,
    protocol,
  }) => ({ accountId, hash }) => {
    const {
      id: lastInitializedRound,
      initialized: isRoundInitialized,
    } = currentRound.data
    const { maxEarningsClaimsRounds } = protocol.data
    const { status, lastClaimRound } = delegator['data']
    const isUnbonded = status === 'Unbonded'
    const unclaimedRounds = isUnbonded
      ? ' 0'
      : MathBN.sub(lastInitializedRound, lastClaimRound)

    if (!isRoundInitialized) {
      return toasts.push({
        id: 'withdraw',
        type: 'warn',
        title: 'Unable to withdraw',
        body: 'The current round is not initialized.',
      })
    }

    if (MathBN.gt(unclaimedRounds, maxEarningsClaimsRounds)) {
      return toasts.push({
        id: 'withdraw',
        type: 'warn',
        title: 'Unable to withdraw',
        body: (
          <span>
            You have unclaimed earnings from more than
            {maxEarningsClaimsRounds} previous rounds. <br />
            <a href="/me/delegating">Claim Your Earnings</a>
          </span>
        ),
      })
    }

    history.push({ hash, state: { accountId } })
  },
  claimEarnings: ({ currentRound, history, toasts }) => () => {
    const isRoundInitialized = currentRound.data.initialized
    if (!isRoundInitialized) {
      return toasts.push({
        id: 'claim-earnings',
        type: 'warn',
        title: 'Unable to claim earnings',
        body: 'The current round is not initialized.',
      })
    }
    history.push('#/claim-earnings')
  },
  withdrawFees: ({ currentRound, delegator, toasts }) => async () => {
    try {
      const currentRoundNum = currentRound.data.id
      const { status, lastClaimRound } = delegator.data
      const hasUnclaimedRounds =
        status !== 'Unbonded' && currentRoundNum !== lastClaimRound
      if (hasUnclaimedRounds) {
        return toasts.push({
          id: 'withdraw-fees',
          type: 'warn',
          title: 'Unable to withdraw fees',
          body: 'You have unclaimed earnings from previous rounds.',
        })
      }
      await window.livepeer.rpc.withdrawFees()
      toasts.push({
        id: 'withdraw-fees',
        type: 'success',
        title: 'Withdrawal Complete',
        body: 'Your fees have successfully been withdrawn.',
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        toasts.push({
          id: 'withdraw-fees',
          type: 'error',
          title: 'Withdrawal Failed',
          body: err.message,
        })
      }
    }
  },
  withdrawStake: ({ currentRound, delegator, toasts }) => async () => {
    try {
      const isRoundInitialized = currentRound.data.initialized
      const { status, withdrawAmount } = delegator.data
      if (status === 'Unbonding') {
        return toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Cannot withdraw stake',
          body: 'First, you must wait through the unbonding period.',
        })
      }
      if (withdrawAmount === '0') {
        return toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Cannot withdraw stake',
          body: 'You have nothing to withdraw',
        })
      }
      if (!isRoundInitialized) {
        return toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Unable to withdraw stake',
          body: 'The current round is not initialized.',
        })
      }
      await window.livepeer.rpc.withdrawStake()
      toasts.push({
        id: 'withdraw-stake',
        type: 'success',
        title: 'Withdrawal Complete',
        body: 'Your stake has successfully been withdrawn.',
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        toasts.push({
          id: 'withdraw-stake',
          type: 'error',
          title: 'Withdrawal Failed',
          body: err.message,
        })
      }
    }
  },
})

export default compose(
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectProtocolQuery,
  connectAccountDelegatorQuery,
  connectToasts,
  withTransactionHandlers,
  mapMutationHandlers,
)
