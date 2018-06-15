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
    // pollInterval: 5 * 1000,
    variables: {},
  }),
})

export const mapMutationHandlers = withHandlers({
  bond: ({ bond, toasts }) => async ({ to, amount }) => {
    try {
      const hasAmount = amount && amount.replace(/0|\./g, '')
      const wei = hasAmount ? toBaseUnit(amount) : '0'
      console.log('bondAndApprove', to, `${amount} LPT`, `${wei} WEI`)
      console.log('bonding...')
      await bond({
        variables: { to, amount: wei },
        refreshQueries: ['MeDelegatorQuery', 'TranscodersQuery'],
      })
      toasts.push({
        id: 'bond',
        type: 'success',
        title: 'Bonded Token',
        body: `Successfully bonded ${amount} LPT to ${to}`,
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        // Push notification if error is not a user cancel error
        toasts.push({
          id: 'bond',
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
  goApprove: ({ history, match }) => () => {
    window.location.hash = `#/approve/${match.params.delegateAddress}`
  },
})

export default compose(
  connectApproveMutation,
  connectBondMutation,
  connectMeDelegatorQuery,
  connectToasts,
  mapMutationHandlers,
)
