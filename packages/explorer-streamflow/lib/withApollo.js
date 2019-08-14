import withApollo from 'next-with-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { SchemaLink } from 'apollo-link-schema'
import { Observable, ApolloLink, from } from 'apollo-link'
import { setContext } from "apollo-link-context";
import fetch from 'isomorphic-unfetch'
import 'apollo-link'
import { graphql, print } from 'graphql'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas
} from 'graphql-tools'
import {schema} from '@livepeer/graphql-sdk'

//const globalAny: any = global
const isBrowser = typeof window !== 'undefined'
const subgraphEndpoint =
  'https://api.thegraph.com/subgraphs/name/livepeer/livepeer'
const threeBoxEndpoint = 'https://api.3box.io/graph'

// Polyfill fetch() on the server (used by apollo-client)
// if (!isBrowser) {
//   globalAny.fetch = fetch
// }

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
          const { query, variables, operationName } = operation
          const mergedSchema = await createSchema()
          graphql(mergedSchema, print(query), {}, {}, variables, operationName)
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

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: mainLink,
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default withApollo(({ initialState }) => {
  return create(initialState)
})
