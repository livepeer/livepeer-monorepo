import { compose, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FORM_ERROR } from 'final-form'
import {
  connectApproveMutation,
  connectUnbondMutation,
  connectToasts,
} from '../../enhancers'
import { toBaseUnit } from '../../utils'
import { mockAccount } from '@livepeer/graphql-sdk'

const MeDelegatorQuery = gql`
  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
    delegator {
      id
      delegateAddress
      bondedAmount
    }
  }

  query MeDelegatorQuery {
    me {
      ...AccountFragment
    }
  }
`

const connectMeDelegatorQuery = graphql(MeDelegatorQuery, {
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
    // pollInterval: 5 * 1000,
    variables: {},
  }),
})

export const mapMutationHandlers = withHandlers({
  unbond: ({ unbond, toasts }) => async ({ amount }) => {
    try {
      const hasAmount = amount && amount.replace(/0|\./g, '')
      const wei = hasAmount ? toBaseUnit(amount) : '0'
      console.log('unbonding...')
      await unbond({
        variables: { amount: wei },
        refreshQueries: ['MeDelegatorQuery', 'TranscodersQuery'],
      })
      toasts.push({
        id: 'unbond',
        type: 'success',
        title: 'Unbonded Token',
        body: `Successfully unbonded ${amount} LPT`,
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        // Push notification if error is not a user cancel error
        toasts.push({
          id: 'unbond',
          type: 'error',
          title: 'Error Unbonding',
          body: 'There was a problem unbonding your token',
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
  connectApproveMutation,
  connectUnbondMutation,
  connectMeDelegatorQuery,
  connectToasts,
  mapMutationHandlers,
)
