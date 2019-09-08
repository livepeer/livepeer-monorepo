import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'
import { graphql, print } from 'graphql'
import { Observable, ApolloLink } from 'apollo-link'
import LivepeerSDK from '@livepeer/sdk'
import fetch from 'isomorphic-unfetch'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
} from 'graphql-tools'
import { schema } from '@livepeer/graphql-sdk'

const subgraphEndpoint =
  'https://api.thegraph.com/subgraphs/name/livepeer/livepeer'
const threeBoxEndpoint = 'https://api.3box.io/graph'
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
            : 'https://mainnet.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e'
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

  const cache = new InMemoryCache().restore(initialState || {})

  cache.writeData({
    data: {
      roi: 0,
      principle: 0,
      selectedOrchestrator: {
        __typename: 'Orchestrator',
        order: 0,
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
  const subgraphServiceLink = new HttpLink({
    uri: subgraphEndpoint,
    fetch,
  })

  const threeBoxServiceLink = new HttpLink({
    uri: threeBoxEndpoint,
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

  const subgraphSchema = await createSubgraphServiceSchema()
  const threeBoxSchema = await create3BoxServiceSchema()

  const linkTypeDefs = `
    extend type Profile {
      transcoder: Transcoder
    }

    extend type Transcoder {
      profile: Profile
    }
  `

  const merged = mergeSchemas({
    schemas: [schema, subgraphSchema, threeBoxSchema, linkTypeDefs],
  })
  return merged
}
