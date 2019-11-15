import { ApolloClient } from 'apollo-client'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { graphql, print } from 'graphql'
import { Observable, ApolloLink } from 'apollo-link'
import LivepeerSDK from '@adamsoffer/livepeer-sdk'
import fetch from 'isomorphic-unfetch'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
} from 'graphql-tools'
import schema from '../apollo'

const isProd = process.env.NODE_ENV === 'production'
const subgraphEndpoint =
  'https://api.thegraph.com/subgraphs/name/livepeer/livepeer-canary'
const threeBoxEndpoint = 'https://api.3box.io/graph'
const changefeedEndpoint = isProd
  ? 'https://explorer.livepeer.org/api/graphql'
  : 'http://localhost:3009/api/graphql'

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

  const mainLink = new ApolloLink(
    operation =>
      new Observable(observer => {
        ;(async () => {
          let { query, variables, operationName, getContext } = operation
          let context = getContext()
          let mergedSchema = await createSchema()
          let sdk = await LivepeerSDK({
            account: context.account ? context.account : '',
            gas: 2.1 * 1000000, // Default gas limit to send with transactions (2.1m wei)
            provider: context.provider
              ? context.provider
              : 'https://mainnet.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e',
          })

          graphql(
            mergedSchema,
            print(query),
            null,
            {
              ...context,
              livepeer: sdk,
            },
            variables,
            operationName,
          )
            .then(result => {
              observer.next(result)
              observer.complete()
            })
            .catch(e => {
              return observer.error(e)
            })
        })()
      }),
  )

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: { types: [] },
    },
  })

  const cache = new InMemoryCache({ fragmentMatcher }).restore(
    initialState || {},
  )

  cache.writeData({
    data: {
      tourOpen: false,
      roi: 0.0,
      principle: 0.0,
      selectedTranscoder: {
        __typename: 'Transcoder',
        index: 0,
        rewardCut: null,
        id: null,
      },
    },
  })

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: mainLink,
    resolvers: {},
    cache,
  })
}

async function createSchema() {
  const { rpc } = await LivepeerSDK()
  const subgraphServiceLink = new HttpLink({
    uri: subgraphEndpoint,
    fetch,
  })

  const threeBoxServiceLink = new HttpLink({
    uri: threeBoxEndpoint,
    fetch,
  })

  const changefeedServiceLink = new HttpLink({
    uri: changefeedEndpoint,
    fetch,
  })

  const createSubgraphServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(subgraphServiceLink),
      link: subgraphServiceLink,
    })
    return executableSchema
  }

  const create3BoxServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(threeBoxServiceLink),
      link: threeBoxServiceLink,
    })
    return executableSchema
  }

  const createChangefeedServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(changefeedServiceLink),
      link: changefeedServiceLink,
    })
    return executableSchema
  }

  const subgraphSchema = await createSubgraphServiceSchema()
  const threeBoxSchema = await create3BoxServiceSchema()
  const changefeedSchema = await createChangefeedServiceSchema()
  const linkTypeDefs = `
    extend type Profile {
      transcoder: Transcoder
    }
    extend type Transcoder {
      profile: Profile
    }
    extend type Delegator {
      pendingStake: String
      tokenBalance: String
      ethBalance: String
    }
  `

  const merged = mergeSchemas({
    schemas: [
      subgraphSchema,
      threeBoxSchema,
      changefeedSchema,
      schema,
      linkTypeDefs,
    ],
    resolvers: {
      Delegator: {
        pendingStake: {
          async resolve(_delegator, _args, _context, _info) {
            const { pendingStake } = await rpc.getDelegator(_delegator.id)
            return pendingStake
          },
        },
        tokenBalance: {
          async resolve(_delegator, _args, _context, _info) {
            return await rpc.getTokenBalance(_delegator.id)
          },
        },
        ethBalance: {
          async resolve(_delegator, _args, _context, _info) {
            return await rpc.getEthBalance(_delegator.id)
          },
        },
      },
    },
  })

  return merged
}
