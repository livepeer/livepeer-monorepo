import { Observable, ApolloLink } from 'apollo-link'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { graphql, print } from 'graphql'
import Livepeer from '@livepeer/sdk'
import LivepeerSchema, {
  introspectionQueryResultData,
} from '@livepeer/graphql-sdk'

let LIVEPEER
let LIVEPEER_SCHEMA
let ACCOUNT

// Breaks Apollo queries :/
const remove__typename = x => {
  if ('object' === typeof x) {
    if (Array.isArray(x)) {
      x = x.map(remove__typename)
    } else {
      delete x.__typename
      Object.keys(x).forEach(key => {
        remove__typename(x[key])
      })
    }
  }
  return x
}

const initLivepeer = async () => {
  return window.web3
    ? Livepeer({
        account: window.web3.eth.accounts[0],
        provider: window.web3.currentProvider,
      })
    : Livepeer()
}

const updateSchemaAndSDK = async () => {
  LIVEPEER = window.livepeer = await initLivepeer()
  LIVEPEER_SCHEMA = LivepeerSchema({ livepeer: LIVEPEER })
  ACCOUNT = LIVEPEER.config.defaultTx.from.toLowerCase()
}

export default async function createClient() {
  const ACCOUNT_POLL_INTERVAL = 1000
  setTimeout(async function updateAccount() {
    if (window.web3) {
      const path = window.location.pathname.toLowerCase()
      const account = window.web3.eth.accounts[0].toLowerCase()
      if (account !== ACCOUNT) {
        const onMyAccountPage = path === '/me' || path.match(account)
        if (onMyAccountPage) {
          return window.location.reload()
        } else {
          await updateSchemaAndSDK()
        }
      }
    }
    setTimeout(updateAccount, ACCOUNT_POLL_INTERVAL)
  }, ACCOUNT_POLL_INTERVAL)
  await updateSchemaAndSDK()
  const link = new ApolloLink(
    operation =>
      new Observable(observer => {
        const { query, variables, operationName } = operation
        // @TODO create loggin middleware link
        // console.log(operationName, variables)
        graphql(LIVEPEER_SCHEMA, print(query), {}, {}, variables, operationName)
          .then(result => {
            console.log(operationName, variables, result.data)
            // const value = {
            //   ...result,
            //   data: remove__typename({ ...result.data }),
            // }
            const value = result
            observer.next(value)
            observer.complete(value)
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
  return new ApolloClient({ link, cache, addTypename: false })
}
