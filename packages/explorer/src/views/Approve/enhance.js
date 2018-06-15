import { compose, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FORM_ERROR } from 'final-form'
import {
  connectApproveMutation,
  connectBondMutation,
  connectToasts,
} from '../../enhancers'
import { sleep, toBaseUnit, wireTransactionToStatus } from '../../utils'
import { utils as gqlSDKUtils } from '@livepeer/graphql-sdk'

const { mockAccount } = gqlSDKUtils

const MeDelegatorQuery = gql`
  fragment AccountFragment on Account {
    id
    ethBalance
    tokenBalance
    delegator {
      id
      allowance
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
    pollInterval: 5 * 1000,
    variables: {},
  }),
})

export const mapMutationHandlers = withHandlers({
  approve: ({ approve, toasts }) => async ({ amount }) => {
    try {
      const wei = toBaseUnit(amount)
      console.log('approve', `${amount} LPT`, `${wei} WEI`)
      console.log('approving...')
      await approve({
        variables: { type: 'bond', amount: wei },
        refetchQueries: [{ query: MeDelegatorQuery }],
      })
      toasts.push({
        id: 'approveToken',
        type: 'success',
        title: 'Approved token bond amount',
        body: `Successfully approved ${amount} LPT for transfer`,
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        // Push notification if error is not a user cancel error
        toasts.push({
          id: 'approveToken',
          type: 'error',
          title: 'Error Approving',
          body: 'There was a problem approving your token transfer amount',
        })
      }
      // resolve the submitError -- do not throw!
      // https://github.com/final-form/react-final-form#submission-errors
      return {
        [FORM_ERROR]: err.message.replace('GraphQL error: ', ''),
      }
    }
  },
  goBond: ({ history, match }) => () => {
    window.location.hash = `#/bond/${match.params.delegateAddress}`
  },
})

export default compose(
  connectApproveMutation,
  connectBondMutation,
  connectMeDelegatorQuery,
  connectToasts,
  mapMutationHandlers,
)
