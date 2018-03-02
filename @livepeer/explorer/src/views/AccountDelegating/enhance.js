import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mockDelegator } from '../../utils'
// import { withTransactionHandlers } from '../../enhancers'

const accountDelegatorQuery = gql`
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

  query AccountDelegatorQuery($id: String!, $me: Boolean!) {
    me @include(if: $me) {
      id
      delegator {
        ...DelegatorFragment
      }
    }
    account(id: $id) @skip(if: $me) {
      id
      delegator {
        ...DelegatorFragment
      }
    }
  }
`

const connectAccountDelegatorQuery = graphql(accountDelegatorQuery, {
  props: ({ data, ownProps }) => {
    const { account, me, ...queryProps } = data
    const { delegator } = me || account || {}
    return {
      ...ownProps,
      delegator: {
        ...queryProps,
        data: mockDelegator(delegator),
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 5 * 1000,
    variables: {
      id: match.params.accountId || '',
      me: !match.params.accountId,
    },
  }),
})

export default compose(connectAccountDelegatorQuery)
