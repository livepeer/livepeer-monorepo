import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'
import { SchemaLink } from 'apollo-link-schema'
import { Observable, ApolloLink, from } from 'apollo-link'
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'
import { graphql, print } from 'graphql'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} from 'graphql-tools'
import LivepeerSDK from '@livepeer/sdk'
import { schema } from '@livepeer/graphql-sdk'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

//const globalAny: any = global
const isBrowser = typeof window !== 'undefined'
const subgraphEndpoint =
  'https://api.thegraph.com/subgraphs/name/livepeer/livepeer'
const threeBoxEndpoint = 'https://api.3box.io/graph'

let apolloClient = null

async function createSchema() {
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

  const linkTypeDefs = `
    extend type Profile {
      transcoder: Transcoder
    }

    extend type Transcoder {
      profile: Profile
    }
  `

  const merged = mergeSchemas({
    schemas: [schema, subgraphSchema, threeBoxSchema, linkTypeDefs]
  })
  return merged
}


function create(initialState) {

  const mainLink = new ApolloLink(
    operation =>
      new Observable(observer => {
        ;(async () => {
          let { query, variables, operationName, getContext } = operation
          let context = getContext()
          let account = context.account ? context.account : ''
          let provider = context.provider ? context.provider : 'https://mainnet.infura.io/v3/39df858a55ee42f4b2a8121978f9f98e'
          let mergedSchema = await createSchema()
          let sdk = await LivepeerSDK({
            account: account,
            gas: 2.1 * 1000000,
            provider   
          })

          graphql(
            mergedSchema,
            print(query),
            null,
            {
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
      selectedOrchestrator: {
        __typename: 'Orchestrator',
        order: 0
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

export default function initApollo(initialState = {}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
