import { compose, withHandlers } from 'recompose'
import {
  connectCoinbaseQuery,
  connectCurrentBlockQuery,
  connectCurrentRoundQuery,
  connectToasts,
  connectInitializeRoundMutation,
} from '../../enhancers'

const mapMutationHandlers = withHandlers({
  initializeRound: ({ toasts, initializeRound }) => async () => {
    try {
      toasts.push({
        id: 'initialize-round',
        title: 'Initializing round...',
        body: 'The current round is being initialized.',
      })
      await initializeRound()
      toasts.push({
        id: 'initialize-round',
        type: 'success',
        title: 'Initialization complete',
        body: 'The current round is now initialized.',
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        toasts.push({
          id: 'initialize-round',
          type: 'error',
          title: 'Initialization failed',
          body: err.message,
        })
      } else {
        toasts.dismiss('initialize-round')
      }
    }
  },
})

export default compose(
  connectCoinbaseQuery,
  connectCurrentBlockQuery,
  connectCurrentRoundQuery,
  connectToasts,
  connectInitializeRoundMutation,
  mapMutationHandlers,
)
