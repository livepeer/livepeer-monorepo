import { Observable, ApolloLink } from 'apollo-link'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { CachePersistor } from 'apollo-cache-persist'
import { withClientState } from 'apollo-link-state'
import { ApolloClient } from 'apollo-client'
import { graphql, parse, print, subscribe } from 'graphql'
import Livepeer from '@livepeer/sdk'
import { schema, introspectionQueryResultData } from '@livepeer/graphql-sdk'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  mergeSchemas,
} from 'graphql-tools'
import { HttpLink } from 'apollo-link-http'
import axios from 'axios'

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
  const state = {
    ...initialState,
    updating: false,
    etherscanApiKey: options.etherscanApiKey,
  }

  /**
   * Merges remote graphql schema with local one
   * @return {Object}
   */
  async function createSchema() {
    // If subgraph is unavailable return local schema without remote schema
    if (!(await isSubgraphAvailable(options.livepeerSubgraph))) {
      // Extend Transcoder type with rewards field to match remote schema
      const linkTypeDefs = `
        type Reward {
          rewardTokens: String,
          round: Round
        }
        extend type Transcoder {
          rewards: [Reward]
        }
      `
      return mergeSchemas({
        schemas: [schema, linkTypeDefs],
      })
    }

    const subgraphServiceLink = new HttpLink({
      uri: options.livepeerSubgraph,
    })

    const createSubgraphServiceSchema = async () => {
      const executableSchema = makeRemoteExecutableSchema({
        schema: await introspectSchema(subgraphServiceLink),
        link: subgraphServiceLink,
      })
      return executableSchema
    }

    const subgraphSchema = await createSubgraphServiceSchema()

    return mergeSchemas({
      schemas: [schema, subgraphSchema],
    })
  }

  // Only poll subgraph periodically instead of on every request
  let lastCheckedSubgraph = 0
  let subgraphPromise = null
  function pollSubgraph(url: string) {
    if (
      Date.now() - lastCheckedSubgraph > 10 * 1000 ||
      subgraphPromise === null
    ) {
      lastCheckedSubgraph = Date.now()
      subgraphPromise = axios({
        url,
        method: 'post',
        data: {
          query: `
          query TranscoderQuery {
            transcoders(first: 1) {
              id
            }
          }
        `,
        },
      })
    }
    return subgraphPromise
  }

  /**
   * Determines whether livepeer subgraph is available
   * @param {string} url
   * @return {boolean}
   */
  async function isSubgraphAvailable(url: string): boolean {
    const IS_WEB3_AVAILABLE = window.web3
    const IS_MAINNET =
      IS_WEB3_AVAILABLE && `${window.web3.version.network}` === '1'

    // If no subgraph endpoint is provided OR if web3 is available and not
    // on mainnnet, do not use subgraph data
    if ((IS_WEB3_AVAILABLE && !IS_MAINNET) || !url) {
      return false
    }
    try {
      const res = await pollSubgraph(url)
      return res.status === 200
    } catch (e) {
      return false
    }
  }

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
      state.account = getAccountFromWeb3(web3, accountIndex)
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
    const account = getAccountFromWeb3(web3, accountIndex) || state.account
    const provider =
      options.provider || getProviderFromWeb3(web3) || state.provider
    const gas = options.defaultGas || 0
    const { controllerAddress } = options
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
    const cache = new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData,
      }),
    })
    if (window.localStorage) {
      const { localStorage } = window
      const persistor = (state.persistor = new CachePersistor({
        cache,
        storage: localStorage,
        debug: true,
      }))
      const SCHEMA_VERSION = '0'
      const SCHEMA_VERSION_KEY = 'apollo-schema-version'
      const currentVersion = localStorage.getItem(SCHEMA_VERSION_KEY)
      if (currentVersion === SCHEMA_VERSION) {
        persistor.restore()
      } else {
        persistor
          .purge()
          .then(() => {
            localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION)
            console.log(
              'Upgraded schema cache persistor storage apollo schema version',
            )
          })
          .catch(err => {
            console.warn(
              'Could not upgrade schema cache persistor storage apollo schema version',
            )
            console.error(err)
          })
      }
    }
    return cache
  }

  /**
   * Creates an ApolloLink to deliver result for an ApolloClient
   * @param {ApolloLinkContext} ctx
   * @return {ApolloLink}
   */
  function createApolloLink(
    ctx: ApolloLinkContext,
    cache: InMemoryCache,
  ): ApolloLink {
    // Lets an app describe how non-schema queries can be resolved
    const stateLink = options.stateLink
      ? withClientState({
          cache,
          ...options.stateLink,
        })
      : null
    const mainLink = new ApolloLink(
      operation =>
        new Observable(async observer => {
          const { query, variables, operationName } = operation
          const [def] = query.definitions
          const mergedSchema = await createSchema()
          if (def && def.operation === 'subscription') {
            subscribe(
              mergedSchema,
              parse(print(query)),
              null,
              ctx,
              variables,
              operationName,
            )
              .then(async sub => {
                while (true) {
                  const { value } = await sub.next()
                  observer.next(value)
                }
              })
              .catch(e => {
                console.error(e)
                observer.error(e)
              })
          } else {
            graphql(
              mergedSchema,
              print(query),
              null,
              ctx,
              variables,
              operationName,
            )
              .then(value => {
                observer.next(value)
                observer.complete(value)
              })
              .catch(e => {
                console.error(e)
                observer.error(e)
              })
          }
        }),
    )
    return !stateLink ? mainLink : ApolloLink.from([stateLink, mainLink])
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
    const cache = createApolloCache({ introspectionQueryResultData })
    const link = createApolloLink(state, cache)
    return new ApolloClient({ link, cache })
  }

  // initialize account/provider polling
  pollForUpdates(options)

  // create the client
  return await createClient()
}
