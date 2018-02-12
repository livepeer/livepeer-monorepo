import { compose, withStateHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import unit from 'ethjs-unit'
import { pathInfo, promptForArgs, toBaseUnit } from '../../utils'

const meQuery = `
fragment AccountFragment on Account {
  id
  ethBalance
  tokenBalance
  delegator {
    delegateAddress
    bondedAmount
  }
}
query MeQuery {
  me {
    ...AccountFragment
  }
}`

const connectMeQuery = graphql(gql(meQuery), {
  props: ({ data, ownProps }) => {
    // console.log(data.me, data.error)
    return {
      ...ownProps,
      me: data.me,
      error: data.error,
      fetchMore: data.fetchMore,
      refetch: data.refetch,
      loading: data.loading,
    }
  },
  options: ({ match }) => {
    return {
      pollInterval: 5000,
      variables: {},
    }
  },
})

const transcodersQuery = `
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

const connectTranscodersQuery = graphql(gql(transcodersQuery), {
  props: ({ data, ownProps }) => {
    return {
      ...ownProps,
      error: data.error,
      refetch: data.refetch,
      fetchMore: data.fetchMore,
      loading: data.loading,
      transcoders: data.transcoders || [],
    }
  },
  options: ({ match }) => {
    return {
      pollInterval: 30 * 1000, // every 30s
      variables: {
        skip: 0,
        limit: 100,
      },
    }
  },
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
    props: ({ mutate, ownProps }) => (
      console.log('>', ownProps),
      {
        bondToken: async ({ to, amount }) => {
          const { approve, bondLoading, bondError, bondSuccess } = ownProps
          try {
            console.log('bondToken', to, amount)
            bondLoading()
            await approve({ type: 'bond', amount })
            await mutate({ variables: { to, amount } })
            bondSuccess()
          } catch (error) {
            if (error.graphQLErrors) {
              try {
                // try to parse the error message
                const [err] = error.graphQLErrors
                const rpcErr = JSON.parse(
                  `{"code":${err.message.split('"code":')[1]}`,
                )
                console.log(rpcErr)
                bondError(new Error(rpcErr.message))
              } catch (err) {
                // if the message can't be parsed, just use gql error
                bondError(error)
              }
            } else {
              bondError(error)
            }
          }
        },
      }
    ),
  },
)

const connectUnbondMutation = graphql(
  gql`
    mutation unbond {
      unbond
    }
  `,
  {
    props: ({ mutate }) => ({
      unbond: async variables => {
        console.log('unbond!')
        await mutate()
      },
    }),
  },
)

const withBondModal = withStateHandlers(
  props => ({
    bondModalVisible: false,
    bondData: { to: '', amount: '' },
    bondStatus: {
      loading: false,
      error: null,
      success: false,
    },
  }),
  {
    setBondData: (state, props) => data => ({
      ...state,
      bondData: { ...state.bondData, ...data },
    }),
    showBondModal: (state, props) => visible => ({
      ...state,
      bondModalVisible: visible,
      bondStatus: {
        loading: false,
        error: null,
        success: false,
      },
    }),
    bondLoading: (state, props) => () => ({
      ...state,
      bondStatus: {
        loading: true,
        error: null,
        success: false,
      },
    }),
    bondError: (state, props) => error => ({
      ...state,
      bondStatus: {
        loading: false,
        error: error,
        success: false,
      },
    }),
    bondSuccess: (state, props) => () => ({
      ...state,
      bondStatus: {
        loading: false,
        error: null,
        success: true,
      },
    }),
  },
)

const withUnbondModal = withStateHandlers(
  props => ({
    unbondModalVisible: false,
    unbondData: { to: '', amount: '' },
    unbondStatus: {
      loading: false,
      error: null,
      success: false,
    },
  }),
  {
    setUnbondData: (state, props) => data => ({
      ...state,
      unbondData: { ...state.unbondData, ...data },
    }),
    showUnbondModal: (state, props) => visible => ({
      ...state,
      unbondModalVisible: visible,
      unbondStatus: {
        loading: false,
        error: null,
        success: false,
      },
    }),
    unbondLoading: (state, props) => () => ({
      ...state,
      unbondStatus: {
        loading: true,
        error: null,
        success: false,
      },
    }),
    unbondError: (state, props) => error => ({
      ...state,
      unbondStatus: {
        loading: false,
        error: error,
        success: false,
      },
    }),
    unbondSuccess: (state, props) => () => ({
      ...state,
      unbondStatus: {
        loading: false,
        error: null,
        success: true,
      },
    }),
  },
)

export default compose(
  // withUnbondModal,
  withBondModal,
  connectMeQuery,
  connectTranscodersQuery,
  connectApproveMutation,
  connectBondTokenMutation,
  connectUnbondMutation,
)
