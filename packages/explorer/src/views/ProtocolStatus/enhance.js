import { compose, withHandlers } from 'recompose'
import {
  connectCoinbaseQuery,
  connectCurrentBlockQuery,
  connectCurrentRoundQuery,
  connectToasts,
} from '../../enhancers'

const mapMutationHandlers = withHandlers({
  initializeRound: ({ toasts }) => async () => {
    try {
      toasts.push({
        id: 'initialize-round',
        title: 'Initializing round...',
        body: 'The current round is being initialized.',
      })
      // TODO: move into graphql schema as mutation
      await window.livepeer.rpc.initializeRound({ gas: 2800000 })
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
  mapMutationHandlers,
)
