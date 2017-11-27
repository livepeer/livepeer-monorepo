import { Observable, ApolloLink, execute, makePromise } from 'apollo-link'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { graphql, print } from 'graphql'
import gql from 'graphql-tag'
import Livepeer from '@livepeer/sdk'
import LivepeerSchema, {
  introspectionQueryResultData,
} from '@livepeer/graphql-sdk'

export default async function createClient() {
  const opts = {
    provider: 'http://18.216.240.131:8545',
  }
  // console.log(opts)
  const livepeer = await Livepeer(opts)
  window.livepeer = livepeer
  const livepeerSchema = LivepeerSchema({ livepeer })
  const link = new ApolloLink(
    operation =>
      new Observable(observer => {
        const { query, variables, operationName } = operation
        console.log(operationName, variables) // @TODO create loggin middleware link
        graphql(livepeerSchema, print(query), {}, {}, variables, operationName)
          .then(result => {
            // console.log('result', result)
            observer.next(result)
            observer.complete(result)
          })
          .catch(e => {
            console.log(e)
            observer.error(e)
          })
      }),
  )
  const cache = new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
  })
  return new ApolloClient({ link, cache })
}
