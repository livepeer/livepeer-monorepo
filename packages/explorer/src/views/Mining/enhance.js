import { compose, withHandlers, withStateHandlers } from 'recompose'
import { FORM_ERROR } from 'final-form'
import {
  connectCoinbaseQuery,
  connectSendTransactionMutation,
  connectToasts,
} from '../../enhancers'

const encodeProofSize = proof => {
  // Assume hex encoded proof
  const proofSize = proof.length / 2

  let res = proofSize.toString('16')
  let len = res.length

  while (len < 64) {
    res = '0' + res
    len++
  }

  return res
}

const mapMutationHandlers = withHandlers({
  generateToken: ({ sendTransaction, toasts }) => async ({
    address,
    proof,
  }) => {
    try {
      const options = {
        to: '0x8e306b005773bee6ba6a6e8972bc79d766cc15c8',
        value: '0',
        data:
          `0x2c84bfa6000000000000000000000000${address.substr(2)}` +
          '0000000000000000000000000000000000000000000000000000000000000040' +
          encodeProofSize(proof) +
          proof,
      }
      console.log('submitting transaction', options)
      await sendTransaction({
        variables: { options },
      })
      toasts.push({
        id: 'sendTransaction',
        type: 'success',
        title: 'Got Livepeer Token!',
        body: `Congrats, you have successfully generated your LPT!`,
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        // Push notification if error is not a user cancel error
        toasts.push({
          id: 'sendTransaction',
          type: 'error',
          title: 'Error Claiming Livepeer Token',
          body: 'There was a problem claiming your LPT.',
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
  connectSendTransactionMutation,
  connectToasts,
  mapMutationHandlers,
)
