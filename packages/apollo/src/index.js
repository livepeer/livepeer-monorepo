import { Observable, ApolloLink } from 'apollo-link'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { graphql, print } from 'graphql'
import Livepeer from '@livepeer/sdk'
import { schema, introspectionQueryResultData } from '@livepeer/graphql-sdk'

type OnAccountChangeCallback = (
  currentAccount: string,
  nextAccount: string,
) => void

type OnProviderChangeCallback = (
  currentProvider: any,
  nextProvider: any,
) => void

type ApolloClientOptions = {
  provider?: string,
  defaultGas?: number,
  onAccountChange?: OnAccountChangeCallback,
  onProviderChange?: OnProviderChangeCallback,
  // @todo - middleware option
}

type ApolloClientState = {
  livepeer?: Livepeer,
  account?: string,
  provider?: any,
  updating: boolean,
}

type ApolloLinkContext = {
  livepeer: Livepeer,
}

type IntrospectionQueryResultData = {
  [x: string]: any,
  __schema: {
    [x: string]: any,
    types: {
      [x: string]: any,
      kind: string,
      name: string,
      possibleTypes: {
        [x: string]: any,
        name: string,
      }[],
    }[],
  },
}

/**
 * Creates an instance of ApolloClient
 * @param {ApolloClientOptions} opts
 * @param {ApolloClientState} initialState
 * @return {ApolloClient}
 */
export default async function createApolloClient(
  opts: ApolloClientOptions | (() => ApolloClientOptions) = {},
  initialState: ApolloClientState = {},
) {
  // options
  const options = typeof opts === 'function' ? await opts() : { ...opts }

  // state
  const state = { ...initialState, updating: false }

  /**
   * Determines whether or not current account should be updated in state
   * @param {Web3} web3
   * @param {number} accountIndex
   * @return {boolean}
   */
  function shouldUpdateAccount(web3: Web3, accountIndex: number): boolean {
    if (!web3 || state.updating) return false
    return state.account !== getAccountFromWeb3(web3, accountIndex)
  }

  /**
   * Determines whether or not current provider should be updated in state
   * @param {Web3} web3
   * @return {boolean}
   */
  function shouldUpdateProvider(web3: Web3): boolean {
    if (options.provider) return false
    if (!web3 || state.updating) return false
    return state.provider !== getProviderFromWeb3(web3)
  }

  /**
   * Updates the state with the most current account and provider
   * @param {Web3} web3
   * @param {number} accountIndex
   */
  async function updateConfig(web3: Web3, accountIndex: number): void {
    try {
      state.updating = true
      state.account = options.account || getAccountFromWeb3(web3, accountIndex)
      state.provider = options.provider || getProviderFromWeb3(web3)
      state.livepeer = window.livepeer = await initLivepeer(state)
    } catch (err) {
      console.warn('updateConfig() failed with the following error:')
      console.error(err)
    } finally {
      state.updating = false
    }
  }

  /**
   * Gets the current Eth account from a web3 instance
   * @param {Web3} web3
   * @param {number} accountIndex
   * @return {string}
   */
  function getAccountFromWeb3(web3: Web3, accountIndex: number): string {
    const hasCurrentAccount = web3 && web3.eth && web3.eth.accounts
    return (hasCurrentAccount
      ? web3.eth.accounts[accountIndex] || ''
      : ''
    ).toLowerCase()
  }

  /**
   * Gets the current provider from a web3 instance
   * @param {Web3} web3
   * @return {*}
   */
  function getProviderFromWeb3(web3: Web3): any {
    return web3 ? web3.currentProvider : undefined
  }

  /**
   * Creates an instance of the Livepeer SDK
   * @param {Web3} web3
   * @param {number} accountIndex
   * @return {Livepeer}
   */
  function initLivepeer(web3: Web3, accountIndex: number): Livepeer {
    const account =
      options.account || getAccountFromWeb3(web3, accountIndex) || state.account
    const provider =
      options.provider || getProviderFromWeb3(web3) || state.provider
    const gas = options.defaultGas || 0
    const { controllerAddress } = options
    console.log('initLivepeer', account)
    return Livepeer({ account, gas, provider, controllerAddress })
  }

  /**
   * Creates an in-memory cache for ApolloClient
   * @param {Object} options
   * @param {IntrospectionQueryResultData} introspectionQueryResultData
   * @return {InMemoryCache}
   */
  function createApolloCache({
    introspectionQueryResultData: IntrospectionQueryResultData,
  }): InMemoryCache {
    return new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData,
      }),
    })
  }

  /**
   * Creates an ApolloLink to deliver result for an ApolloClient
   * @param {ApolloLinkContext} ctx
   * @return {ApolloLink}
   */
  function createApolloLink(ctx: ApolloLinkContext): ApolloLink {
    return new ApolloLink(
      operation =>
        new Observable(observer => {
          const { query, variables, operationName } = operation
          graphql(schema, print(query), null, ctx, variables, operationName)
            .then(result => {
              // console.log(operationName, variables, result.data)
              const value = result
              observer.next(value)
              observer.complete(value)
            })
            .catch(e => {
              console.error(e)
              observer.error(e)
            })
        }),
    )
  }

  /**
   * Executed whenever account changes
   * @param {OnAccountChangeCallback} cb
   */
  async function handleCurrentAccountChange(cb: OnAccountChangeCallback): void {
    const { web3 } = window
    if (!shouldUpdateAccount(web3, 0)) return
    if (cb) cb(state.account, getAccountFromWeb3(web3, 0))
    await updateConfig(web3, 0)
  }

  /**
   * Executed whenever provider changes
   * @param {OnProviderChangeCallback} cb
   */
  async function handleCurrentProviderChange(
    cb: OnProviderChangeCallback,
  ): void {
    const { web3 } = window
    if (!shouldUpdateProvider(web3)) return
    if (cb) cb(state.provider, getProviderFromWeb3(web3))
    await updateConfig(web3, 0)
  }

  /**
   * Starts interval timers that watch for account / provider updates
   * @param {ApolloClientOptions} options
   */
  function pollForUpdates(options: ApolloClientOptions): void {
    const { onAccountChange, onProviderChange } = options
    setInterval(() => handleCurrentAccountChange(onAccountChange), 1000)
    setInterval(() => handleCurrentProviderChange(onProviderChange), 1000)
  }

  /**
   * Creates an ApolloClient
   * @return {ApolloClient}
   */
  async function createClient(): ApolloClient {
    await updateConfig(window.web3, 0)
    const link = createApolloLink(state)
    const cache = createApolloCache({ introspectionQueryResultData })
    return new ApolloClient({ link, cache })
  }

  // initialize account/provider polling
  pollForUpdates(options)

  // create the client
  return await createClient()
}
