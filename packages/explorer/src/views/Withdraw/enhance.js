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
  withdrawStake: ({ currentRound, delegator, toasts }) => async () => {
    try {
      const isRoundInitialized = currentRound.data.initialized
      const { status, withdrawAmount } = delegator.data
      if (status === 'Unbonding') {
        toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Cannot withdraw stake',
          body: 'First, you must wait through the unbonding period.',
        })
        throw new Error('First, you must wait through the unbonding period.')
      }
      if (withdrawAmount === '0') {
        toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Cannot withdraw stake',
          body: 'You have nothing to withdraw',
        })
        throw new Error('You have nothing to withdraw')
      }
      if (!isRoundInitialized) {
        toasts.push({
          id: 'withdraw-stake',
          type: 'warn',
          title: 'Unable to withdraw stake',
          body: 'The current round is not initialized.',
        })
        throw new Error('The current round is not initialized.')
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
