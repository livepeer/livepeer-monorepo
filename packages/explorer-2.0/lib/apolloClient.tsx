import { ApolloClient } from 'apollo-client'
import {
  InMemoryCache,
  defaultDataIdFromObject,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ApolloLink, Observable } from 'apollo-link'
import createSchema from './createSchema'
import { execute } from 'graphql/execution/execute'
import LivepeerSDK from '@livepeer/sdk'

export default function createApolloClient(initialState, ctx) {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: { types: [] },
    },
  })

  const cache = new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: object => {
      switch (object.__typename) {
        case 'ThreeBoxSpace':
          return object.id // use the `id` field as the identifier
        default:
          return defaultDataIdFromObject(object) // fall back to default handling
      }
    },
  }).restore(initialState || {})

  cache.writeData({
    data: {
      walletModalOpen: false,
      bottomDrawerOpen: false,
      selectedStakingAction: '',
      uniswapModalOpen: false,
      roundStatusModalOpen: false,
      txs: [],
      tourOpen: false,
      roi: 0.0,
      principle: 0.0,
      selectedTranscoder: {
        __typename: 'Transcoder',
        index: 0,
        rewardCut: null,
        id: null,
        threeBoxSpace: {
          __typename: 'ThreeBoxSpace',
          name: '',
          image: '',
          website: '',
          description: '',
        },
      },
    },
  })

  const link = new ApolloLink(operation => {
    return new Observable(observer => {
      Promise.resolve(createSchema())
        .then(async data => {
          const context = operation.getContext()
          const sdk = await LivepeerSDK({
            provider:
              process.env.NETWORK === 'mainnet'
                ? process.env.RPC_URL_1
                : process.env.RPC_URL_4,
            controllerAddress: process.env.CONTROLLER_ADDRESS,
            ...(context.library && {
              provider: context.library._web3Provider,
            }),
            ...(context.account && { account: context.account }),
          })

          return execute(
            data,
            operation.query,
            null,
            {
              livepeer: sdk,
              ...context,
            },
            operation.variables,
            operation.operationName,
          )
        })
        .then(data => {
          if (!observer.closed) {
            observer.next(data)
            observer.complete()
          }
        })
        .catch(error => {
          if (!observer.closed) {
            observer.error(error)
          }
        })
    })
  })

  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link,
    resolvers: {},
    cache,
  })
}
