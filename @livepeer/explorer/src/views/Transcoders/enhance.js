import { compose, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import unit from 'ethjs-unit'
import { pathInfo, promptForArgs, toBaseUnit } from '../../utils'
import { withTransactionHandlers } from '../../enhancers'

const query = `
fragment TranscoderFragment on Transcoder {
  id
  active
  status
  lastRewardRound
  blockRewardCut
  feeShare
  pricePerSegment
  pendingBlockRewardCut
  pendingFeeShare
  pendingPricePerSegment
  totalStake
}
query TranscodersQuery(
  $skip: Int,
  $limit: Int
) {
  transcoders(skip: $skip, limit: $limit) {
    ...TranscoderFragment
  }
}`

const setProps = ({ data, ownProps }) => {
  return {
    ...ownProps,
    error: data.error,
    refetch: data.refetch,
    fetchMore: data.fetchMore,
    loading: data.loading,
    transcoders: data.transcoders || [],
  }
}

const setOptions = ({ match }) => {
  return {
    pollInterval: 60 * 1000,
    variables: {
      skip: 0,
      limit: 100,
    },
  }
}

const connectTranscodersQuery = graphql(gql(query), {
  props: setProps,
  options: setOptions,
})

const connectApproveMutation = graphql(
  gql`
    mutation approve($type: String!, $amount: String!) {
      approve(type: $type, amount: $amount)
    }
  `,
  {
    props: ({ mutate }) => ({
      approve: async variables => {
        console.log('approve', variables)
        await mutate({ variables })
      },
    }),
  },
)

const connectBondTokenMutation = graphql(
  gql`
    mutation bondToken($to: String!, $amount: String!) {
      bondToken(to: $to, amount: $amount)
    }
  `,
  {
    props: ({ mutate }) => ({
      bondToken: async variables => {
        console.log('bondToken', variables)
        await mutate({ variables })
      },
    }),
  },
)

const withModal = withStateHandlers(
  props => ({
    modal: false,
    // bondApprove | bondConfirm | bondSuccess | bondError
    modalType: 'bondApprove',
    approval: {
      values: {
        amount: 0,
      },
      done: false,
      loading: false,
      errors: [],
    },
    bonding: {
      values: {
        to: '',
      },
      done: false,
      loading: false,
      errors: [],
    },
  }),
  {
    setModalType: (state, props) => modalType => ({
      ...state,
      modalType,
    }),
    showModal: (state, props) => modal => ({
      ...state,
      modal,
    }),
    updateApproval: (state, props) => f => ({
      ...state,
      approval: {
        ...state.approval,
        ...f(state.approval),
      },
    }),
    updateBonding: (state, props) => f => ({
      ...state,
      bonding: {
        ...state.bonding,
        ...f(state.bonding),
      },
    }),
  },
)

export default compose(
  withModal,
  connectTranscodersQuery,
  connectApproveMutation,
  connectBondTokenMutation,
  withTransactionHandlers,
)
