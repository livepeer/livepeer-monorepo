import { compose, withHandlers } from 'recompose'
import { FORM_ERROR } from 'final-form'
import {
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectToasts,
  withTransactionHandlers,
  connectAccountDelegatorUnbondLockQuery,
} from '../../enhancers'

const mapMutationHandlers = withHandlers({
  withdrawStake: ({
    currentRound,
    delegator,
    toasts,
    unbondlock,
  }) => async () => {
    try {
      const currentRoundNum = currentRound.data.id
      const isRoundInitialized = currentRound.data.initialized
      const { withdrawRound, amount: withdrawAmount } = unbondlock
      console.log('withdraw amount')
      console.log({ withdrawAmount })

      let err = {
        id: 'withdraw-stake',
        type: 'warn',
        title: 'Cannot withdraw stake',
      }

      let body = null

      if (withdrawRound > currentRoundNum)
        body = 'First, you must wait through the unbonding period.'
      if (withdrawAmount === '0') body = 'You have nothing to withdraw'
      if (!isRoundInitialized) body = 'The current round is not initialized.'

      if (body) {
        err = { ...err, body }
        toasts.push(err)
        throw new Error(body)
      }

      // withdraw stake with unbondlock
      await window.livepeer.rpc.withdrawStakeWithUnbondLock(unbondlock)

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
      return {
        [FORM_ERROR]: err.message,
      }
    }
  },
})

export default compose(
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectAccountDelegatorUnbondLockQuery,
  connectToasts,
  withTransactionHandlers,
  mapMutationHandlers,
)
