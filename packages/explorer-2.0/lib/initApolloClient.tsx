import { ApolloClient } from 'apollo-client'
import {
  InMemoryCache,
  defaultDataIdFromObject,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { split, ApolloLink, Observable } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import createSchema from './createSchema'
import { execute } from 'graphql/execution/execute'
import LivepeerSDK from '@adamsoffer/livepeer-sdk'
import { detectNetwork } from './utils'

let apolloClient = null

export default (initialState = {}) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState)
  }

  return apolloClient
}

function createApolloClient(initialState = {}) {
  const isBrowser = typeof window !== 'undefined'

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
      stakingWidgetModalOpen: false,
      selectedStakingAction: '',
      uniswapModalOpen: false,
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

  const clientLink = new ApolloLink(operation => {
    return new Observable(observer => {
      Promise.resolve(createSchema())
        .then(async data => {
          const context = operation.getContext()
          const network = await detectNetwork(window['web3']?.currentProvider)
          const sdk = await LivepeerSDK({
            provider:
              network?.type === 'rinkeby'
                ? process.env.RPC_URL_4
                : process.env.RPC_URL_1,
            controllerAddress:
              network?.type === 'rinkeby'
                ? process.env.CONTROLLER_ADDRESS_RINKEBY
                : process.env.CONTROLLER_ADDRESS_MAINNET,
            ...(context.provider && {
              provider: context.provider,
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

  const wsLink: any = process.browser
    ? new WebSocketLink({
        uri: `wss://api.thegraph.com/subgraphs/name/livepeer/livepeer`,
        options: {
          reconnect: true,
        },
      })
    : () => {}

  const link = split(
    operation => {
      const mainDefinition: any = getMainDefinition(operation.query)
      return (
        mainDefinition.kind === 'OperationDefinition' &&
        mainDefinition.operation === 'subscription'
      )
    },
    wsLink,
    clientLink,
  )

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link,
    resolvers: {},
    cache,
  })
}
