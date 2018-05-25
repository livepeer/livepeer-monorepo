import { compose, withHandlers, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FORM_ERROR } from 'final-form'
import {
  connectCurrentRoundQuery,
  connectClaimEarningsMutation,
  connectToasts,
  TransactionsQuery,
} from '../../enhancers'
import {
  MathBN,
  mockAccount,
  sleep,
  wireTransactionToStatus,
} from '../../utils'

const MeDelegatorQuery = gql`
  fragment DelegatorFragment on Delegator {
    id
    status
    delegateAddress
    bondedAmount
    fees
    delegatedAmount
    lastClaimRound
    startRound
    withdrawRound
  }

  query MeDelegatorQuery {
    me {
      id
      delegator {
        ...DelegatorFragment
      }
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
    // pollInterval: 30 * 1000,
    variables: {},
  }),
})

const mapMutationHandlers = withHandlers({
  claimEarnings: ({ claimEarnings, toasts, me }) => async ({ numRounds }) => {
    try {
      const { lastClaimRound } = me.data.delegator
      const endRound = MathBN.add(lastClaimRound, numRounds)
      console.log('lastClaimRound', lastClaimRound)
      console.log('claimEarnings', endRound)
      await claimEarnings({
        variables: { endRound },
        refetchQueries: [
          { query: MeDelegatorQuery },
          // It takes a while for the tx to show up on etherscan
          // So we get stale data if we refresh immediately :\
          // { query: TransactionsQuery, variables: { address: me.data.id } },
        ],
      })
      toasts.push({
        id: 'claimEarnings',
        type: 'success',
        title: 'Claimed Earnings',
        body: `Successfully claimed earnings up to round #${endRound}`,
      })
    } catch (err) {
      if (!/User denied/.test(err.message)) {
        // Push notification if error is not a user cancel error
        toasts.push({
          id: 'claimEarnings',
          type: 'error',
          title: 'Error Claiming Earnings',
          body: 'There was a problem claiming your earnings.',
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
  connectCurrentRoundQuery,
  connectClaimEarningsMutation,
  connectMeDelegatorQuery,
  connectToasts,
  mapMutationHandlers,
)
