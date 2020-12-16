import { ApolloClient, gql } from '@apollo/client'
import { InMemoryCache, defaultDataIdFromObject } from '@apollo/client/cache'
import { ApolloLink, Observable } from 'apollo-link'
import createSchema from './createSchema'
import { execute } from 'graphql/execution/execute'
import LivepeerSDK from '@livepeer/sdk'

export default function createApolloClient(initialState, ctx) {
  const dataIdFromObject = (object) => {
    switch (object.__typename) {
      case 'ThreeBoxSpace':
        return object.id // use the `id` field as the identifier
      default:
        return defaultDataIdFromObject(object) // fall back to default handling
    }
  }

  const cache: any = new InMemoryCache({
    dataIdFromObject,
  }).restore(initialState || {})

  cache.writeQuery({
    query: gql`
      {
        walletModalOpen
        bottomDrawerOpen
        selectedStakingAction
        uniswapModalOpen
        roundStatusModalOpen
        txSummaryModal {
          __typename
          open
          error
        }
        txs
        tourOpen
        roi
        principle
      }
    `,
    data: {
      walletModalOpen: false,
      bottomDrawerOpen: false,
      selectedStakingAction: '',
      uniswapModalOpen: false,
      roundStatusModalOpen: false,
      txSummaryModal: {
        __typename: 'TxSummaryModal',
        open: false,
        error: false,
      },
      txs: [],
      tourOpen: false,
      roi: 0.0,
      principle: 0.0,
    },
  })

  const link: any = new ApolloLink((operation) => {
    return new Observable((observer) => {
      Promise.resolve(createSchema())
        .then(async (data) => {
          const context = operation.getContext()
          const sdk = await LivepeerSDK({
            provider:
              process.env.NEXT_PUBLIC_NETWORK === 'rinkeby'
                ? process.env.NEXT_PUBLIC_RPC_URL_4
                : process.env.NEXT_PUBLIC_RPC_URL_1,
            controllerAddress: process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS,
            pollCreatorAddress: process.env.NEXT_PUBLIC_POLL_CREATOR_ADDRESS,
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
        .then((data) => {
          if (!observer.closed) {
            observer.next(data)
            observer.complete()
          }
        })
        .catch((error) => {
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
