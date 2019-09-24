import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { graphql, print } from 'graphql'
import { Observable, ApolloLink } from 'apollo-link'
import LivepeerSDK from '@adamsoffer/livepeer-sdk'
import fetch from 'isomorphic-unfetch'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
  transformSchema,
  FilterTypes
} from 'graphql-tools'
import { schema } from '@adamsoffer/livepeer-graphql-sdk'

const subgraphEndpoint =
  'https://graph.livepeer.org/subgraphs/name/livepeer/livepeer-canary'
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
              // graphql-sdk transactions query requires 'persistor' object so pass it
              // an empty object
              persistor: {
                cache: { cache: { data: { data: { ROOT_QUERY: [] } } } }
              },
              livepeer: sdk
            },
            variables,
            operationName
          )
            .then(result => {
              observer.next(result)
              observer.complete()
            })
            .catch(e => {
              return observer.error(e)
            })
        })()
      })
  )

  const cache = new InMemoryCache().restore(initialState || {})

  cache.writeData({
    data: {
      roi: 0,
      principle: 0,
      selectedTranscoder: {
        __typename: 'Transcoder',
        id: null
      }
    }
  })

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: mainLink,
    resolvers: {},
    cache
  })
}

async function createSchema() {
  const { rpc } = await LivepeerSDK()
  const subgraphServiceLink = new HttpLink({
    uri: subgraphEndpoint,
    fetch
  })

  const threeBoxServiceLink = new HttpLink({
    uri: threeBoxEndpoint,
    fetch
  })

  const createSubgraphServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(subgraphServiceLink),
      link: subgraphServiceLink
    })
    return executableSchema
  }

  const create3BoxServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(threeBoxServiceLink),
      link: threeBoxServiceLink
    })
    return executableSchema
  }

  const subgraphSchema = await createSubgraphServiceSchema()
  const threeBoxSchema = await create3BoxServiceSchema()

  const transformedSchema = transformSchema(schema, [
    new FilterTypes(type => {
      return type.name != 'Account'
    })
  ])

  const linkTypeDefs = `
    extend type Profile {
      transcoder: Transcoder
    }

    extend type Transcoder {
      profile: Profile
    }

    extend type Delegator {
      pendingStake: String
      status: String
    }

    type Account {
      id: ID!
      tokenBalance: String
    }

    extend type Query {
      account(id: ID!): Account
    }
  `

  const merged = mergeSchemas({
    schemas: [transformedSchema, subgraphSchema, threeBoxSchema, linkTypeDefs],
    resolvers: {
      Query: {
        account: async (account, _args, _context, _info) => {
          return {
            id: _args.id,
            tokenBalance: await rpc.getTokenBalance(_args.id)
          }
        }
      },
      Delegator: {
        pendingStake: {
          async resolve(delegator, _args, _context, _info) {
            const { pendingStake } = await rpc.getDelegator(delegator.id)
            return pendingStake
          }
        },
        status: {
          async resolve(delegator, _args, _context, _info) {
            const { status } = await rpc.getDelegator(delegator.id)
            return status
          }
        }
      }
    }
  })

  return merged
}
