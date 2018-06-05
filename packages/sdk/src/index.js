import Eth from 'ethjs'
import SignerProvider from 'ethjs-provider-signer'
import EthereumTx from 'ethereumjs-tx'
import {
  decodeParams,
  decodeEvent,
  encodeMethod,
  encodeSignature,
} from 'ethjs-abi'
import LivepeerTokenArtifact from '../etc/LivepeerToken'
import LivepeerTokenFaucetArtifact from '../etc/LivepeerTokenFaucet'
import ControllerArtifact from '../etc/Controller'
import JobsManagerArtifact from '../etc/JobsManager'
import RoundsManagerArtifact from '../etc/RoundsManager'
import BondingManagerArtifact from '../etc/BondingManager'

// Constants
export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ADDRESS_PAD = '0x000000000000000000000000'
export const VIDEO_PROFILE_ID_SIZE = 8
export const VIDEO_PROFILES = {
  P720p60fps16x9: {
    hash: 'a7ac137a',
    name: 'P720p60fps16x9',
    bitrate: '6000k',
    framerate: 60,
    resolution: '1280x720',
  },
  P720p30fps16x9: {
    hash: '49d54ea9',
    name: 'P720p30fps16x9',
    bitrate: '4000k',
    framerate: 30,
    resolution: '1280x720',
  },
  P720p30fps4x3: {
    hash: '79332fe7',
    name: 'P720p30fps4x3',
    bitrate: '3500k',
    framerate: 30,
    resolution: '960x720',
  },
  P576p30fps16x9: {
    hash: '5ecf4b52',
    name: 'P576p30fps16x9',
    bitrate: '1500k',
    framerate: 30,
    resolution: '1024x576',
  },
  P360p30fps16x9: {
    hash: '93c717e7',
    name: 'P360p30fps16x9',
    bitrate: '1200k',
    framerate: 30,
    resolution: '640x360',
  },
  P360p30fps4x3: {
    hash: 'b60382a0',
    name: 'P360p30fps4x3',
    bitrate: '1000k',
    framerate: 30,
    resolution: '480x360',
  },
  P240p30fps16x9: {
    hash: 'c0a6517a',
    name: 'P240p30fps16x9',
    bitrate: '600k',
    framerate: 30,
    resolution: '426x240',
  },
  P240p30fps4x3: {
    hash: 'd435c53a',
    name: 'P240p30fps4x3',
    bitrate: '600k',
    framerate: 30,
    resolution: '320x240',
  },
  P144p30fps16x9: {
    hash: 'fca40bf9',
    name: 'P144p30fps16x9',
    bitrate: '400k',
    framerate: 30,
    resolution: '256x144',
  },
}

const DELEGATOR_STATUS = ['Pending', 'Bonded', 'Unbonding', 'Unbonded']
DELEGATOR_STATUS.Pending = DELEGATOR_STATUS[0]
DELEGATOR_STATUS.Bonded = DELEGATOR_STATUS[1]
DELEGATOR_STATUS.Unbonding = DELEGATOR_STATUS[2]
DELEGATOR_STATUS.Unbonded = DELEGATOR_STATUS[3]
export { DELEGATOR_STATUS }
const TRANSCODER_STATUS = ['NotRegistered', 'Registered', 'Resigned']
TRANSCODER_STATUS.NotRegistered = TRANSCODER_STATUS[0]
TRANSCODER_STATUS.Registered = TRANSCODER_STATUS[1]
TRANSCODER_STATUS.Resigned = TRANSCODER_STATUS[2]
export { TRANSCODER_STATUS }

// Defaults
export const DEFAULTS = {
  controllerAddress: '0xf96d54e490317c557a967abfa5d6e33006be69b3',
  provider: 'https://mainnet.infura.io/srFaWg0SlljdJAoClX3B',
  privateKeys: {}, // { [publicKey: string]: privateKey }
  account: '',
  gas: 0,
  artifacts: {
    LivepeerToken: LivepeerTokenArtifact,
    LivepeerTokenFaucet: LivepeerTokenFaucetArtifact,
    Controller: ControllerArtifact,
    JobsManager: JobsManagerArtifact,
    RoundsManager: RoundsManagerArtifact,
    BondingManager: BondingManagerArtifact,
  },
}

// Utils
export const utils = {
  getMethodHash: item => {
    // const sig = `${item.name}(${item.inputs.map(x => x.type).join(',')})`
    // const hash = Eth.keccak256(sig)
    // return hash
    return encodeSignature(item)
  },
  findAbiByName: (abis, name) => {
    const [abi] = abis.filter(item => {
      if (item.type !== 'function') return false
      if (item.name === name) return true
    })
    return abi
  },
  findAbiByHash: (abis, hash) => {
    const [abi] = abis.filter(item => {
      if (item.type !== 'function') return false
      return encodeSignature(item) === hash
    })
    return abi
  },
  encodeMethodParams: (abi, params) => {
    return encodeMethod(abi, params)
  },
  decodeMethodParams: (abi, bytecode) => {
    return decodeParams(
      abi.inputs.map(x => x.name),
      abi.inputs.map(x => x.type),
      `0x${bytecode.substr(10)}`,
      false,
    )
  },
  decodeContractInput: (contracts, contractAddress, input) => {
    for (const key in contracts) {
      const contract = contracts[key]
      if (contract.address !== contractAddress) continue
      const hash = input.substring(0, 10)
      const abi = utils.findAbiByHash(contract.abi, hash)
      return {
        contract: key,
        method: abi.name,
        params: Object.entries(utils.decodeMethodParams(abi, input)).reduce(
          (obj, [k, v]) => {
            return {
              ...obj,
              [k]: Array.isArray(v)
                ? v.map(_v => (BN.isBN(_v) ? toString(_v) : _v))
                : BN.isBN(v)
                  ? toString(v)
                  : v,
            }
          },
          {},
        ),
      }
    }
    return { contract: '', method: '', params: {} }
  },
  /**
   * Polls for a transaction receipt
   * @ignore
   * @param {string}   txHash - the transaction hash
   * @param {Eth}      eth    - an instance of Ethjs
   * @return {Object}
   */
  getTxReceipt: async (txHash, eth) => {
    return await new Promise((resolve, reject) => {
      setTimeout(async function pollForReceipt() {
        try {
          const receipt = await eth.getTransactionReceipt(txHash)
          if (receipt) {
            return receipt.status === '0x1'
              ? // success
                resolve(receipt)
              : // fail
                reject(
                  new Error(
                    JSON.stringify(
                      {
                        receipt,
                        transaction: await eth.getTransactionByHash(
                          receipt.transactionHash,
                        ),
                      },
                      null,
                      2,
                    ),
                  ),
                )
          }
          setTimeout(pollForReceipt, 300)
        } catch (err) {
          reject(err)
        }
      }, 0)
    })
  },
  /**
   * Parses an encoded string of transcoding options
   * @ignore
   * @param  {string} opts - transcoding options
   * @return {Object[]}
   */
  parseTranscodingOptions: opts => {
    const profiles = Object.values(VIDEO_PROFILES)
    const validHashes = new Set(profiles.map(x => x.hash))
    let hashes = []
    for (let i = 0; i < opts.length; i += VIDEO_PROFILE_ID_SIZE) {
      const hash = opts.slice(i, i + VIDEO_PROFILE_ID_SIZE)
      if (!validHashes.has(hash)) continue
      hashes.push(hash)
    }
    return hashes.map(x => profiles.find(({ hash }) => x === hash))
  },
  /**
   * Serializes a list of transcoding profiles name into a hash
   * @ignore
   * @param  {string[]} name - transcoding profile name
   * @return {string}
   */
  serializeTranscodingProfiles: names => {
    return [
      ...new Set( // dedupe profiles
        names.map(
          x =>
            VIDEO_PROFILES[x]
              ? VIDEO_PROFILES[x].hash
              : VIDEO_PROFILES.P240p30fps4x3.hash,
        ),
      ),
    ].join('')
  },
  /**
   * Pads an address with 0s on the left (for topic encoding)
   * @ignore
   * @param  {string} addr - an ETH address
   * @return {string}
   */
  padAddress: addr => ADDRESS_PAD + addr.substr(2),
  /**
   * Encodes an event filter object into a topic list
   * @ignore
   * @param  {Function} event   - a contract event method
   * @param  {Object}   filters - key/value map of indexed event params
   * @return {string[]}
   */
  encodeEventTopics: (event, filters) => {
    return event.abi.inputs.reduce(
      (topics, { indexed, name, type }, i) => {
        if (!indexed) return topics
        if (!filters.hasOwnProperty(name)) return [...topics, null]
        if (type === 'address' && 'string' === typeof filters[name])
          return [...topics, utils.padAddress(filters[name])]
        return [...topics, filters[name]]
      },
      [event().options.defaultFilterObject.topics[0]],
    )
  },
  /**
   * Turns a raw event log into a result object
   * @ignore
   * @param  {Function} event  - a contract event method
   * @param  {string}   data   - bytecode from log
   * @param  {string[]} topics - list of topics for log query
   * @return {Object}
   */
  decodeEvent: event => ({ data, topics }) => {
    return decodeEvent(event.abi, data, topics, false)
  },
}

// Helper functions
// ethjs returns a Result type from rpc requests
// these functions help with formatting those values
const { BN } = Eth
const toBN = n => (BN.isBN(n) ? n : new BN(n.toString(10), 10))
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))
const prop = (k: string | number) => (x): any => x[k]
const toBool = (x: any): boolean => !!x
const toString = (x: Eth.BN): string => x.toString(10)
const toNumber = (x: Eth.BN): string => Number(x.toString(10))
const headToBool = compose(toBool, prop(0))
const headToString = compose(toString, prop(0))
const headToNumber = compose(toNumber, prop(0))
const invariant = (name, pos, type) => {
  throw new Error(`Missing argument "${name}" (${type}) at position ${pos}`)
}
const formatDuration = ms => {
  const seconds = (ms / 1000).toFixed(1)
  const minutes = (ms / (1000 * 60)).toFixed(1)
  const hours = (ms / (1000 * 60 * 60)).toFixed(1)
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1)
  if (seconds < 60) return seconds + ' sec'
  else if (minutes < 60) return minutes + ' min'
  else if (hours < 24) return hours + ' hours'
  return days + ' days'
}

/**
 * Deploys contract and return instance at deployed address
 * @ignore
 * @param {*} eth
 * @param {*} args
 */
export async function deployContract(
  eth,
  { abi, bytecode, defaultTx },
): Promise<Contract> {
  const contract = eth.contract(abi, bytecode, defaultTx)
  const txHash = await contract.new()
  const receipt = await eth.getTransactionSuccess(txHash)
  return contract.at(receipt.contractAddress)
}

/**
 * Creates a contract instance from a specific address
 * @ignore
 * @param {Eth}    eth     - ethjs instance
 * @param {string} address -
 * @param {Object} args[0] - an object containing all relevant Livepeer Artifacts
 */
export function getContractAt(
  eth,
  { abi, bytecode, address, defaultTx },
): Contract {
  return eth.contract(abi, bytecode, defaultTx).at(address)
}

/**
 * Creates an instance of Eth and a default transaction object
 * @ignore
 * @return {{ et, gas: Eth, defaultTx: { from: string, gas: number } }}
 */
export async function initRPC({
  account,
  privateKeys,
  gas,
  provider,
}): Promise<{
  eth: Eth,
  defaultTx: { from: string, gas: number },
}> {
  const usePrivateKeys = 0 < Object.keys(privateKeys).length
  const ethjsProvider =
    'object' === typeof provider && provider
      ? provider
      : usePrivateKeys
        ? // Use provider-signer to locally sign transactions
          new SignerProvider(provider, {
            signTransaction: (rawTx, cb) => {
              const tx = new EthereumTx(rawTx)
              tx.sign(privateKeys[from])
              cb(null, '0x' + tx.serialize().toString('hex'))
            },
            accounts: cb => cb(null, accounts),
            timeout: 10 * 1000,
          })
        : // Use default signer
          new Eth.HttpProvider(provider || DEFAULTS.provider)
  const eth = new Eth(ethjsProvider)
  const accounts = usePrivateKeys
    ? Object.keys(privateKeys)
    : await eth.accounts()
  const from =
    // select account by address or index
    // default to EMPTY_ADDRESS (read-only; cannot transact)
    new Set(accounts).has(account)
      ? account
      : accounts[account] || EMPTY_ADDRESS
  return {
    eth,
    provider,
    accounts,
    defaultTx: {
      from,
      gas,
    },
  }
}

/**
 * Creates instances of all main Livepeer contracts
 * @ignore
 * @param {string} opts.provider  - the httpProvider for contract RPC
 * @param {Object} opts.artifacts - ...
 */
export async function initContracts(
  opts = {},
): Promise<Object<string, Contract>> {
  // Merge pass options with defaults
  const {
    account = DEFAULTS.account,
    artifacts = DEFAULTS.artifacts,
    controllerAddress = DEFAULTS.controllerAddress,
    gas = DEFAULTS.gas,
    privateKeys = DEFAULTS.privateKeys,
    provider = DEFAULTS.provider,
  } = opts
  // Instanstiate new ethjs instance with specified provider
  const { eth, accounts, defaultTx } = await initRPC({
    account,
    gas,
    privateKeys,
    provider,
  })
  const contracts = {
    LivepeerToken: null,
    LivepeerTokenFaucet: null,
    BondingManager: null,
    JobsManager: null,
    RoundsManager: null,
  }
  const hashes = {
    LivepeerToken: {},
    LivepeerTokenFaucet: {},
    BondingManager: {},
    JobsManager: {},
    RoundsManager: {},
  }
  // Create a Controller contract instance
  const Controller = await getContractAt(eth, {
    ...artifacts.Controller,
    defaultTx,
    address: controllerAddress,
  })
  for (const name of Object.keys(contracts)) {
    // Get contract address from Controller
    const hash = Eth.keccak256(name)
    const address = (await Controller.getContract(hash))[0]
    // Create contract instance
    contracts[name] = await getContractAt(eth, {
      ...artifacts[name],
      defaultTx,
      address,
    })
    for (const item of contracts[name].abi) {
      hashes[name][utils.getMethodHash(item)] = item.name
    }
  }
  // Add the Controller contract to the contracts object
  contracts.Controller = Controller
  // Key ABIs by contract name
  const abis = Object.entries(artifacts)
    .map(([k, v]) => ({ [k]: v.abi }))
    .reduce((a, b) => ({ ...a, ...b }), {})
  // Create a list of events in each contract
  const events = Object.entries(abis)
    .map(([contract, abi]) => {
      return abi.filter(x => x.type === 'event').map(abi => ({
        abi,
        contract,
        event: contracts[contract][abi.name],
        name: abi.name,
      }))
    })
    .reduce(
      (a, b) =>
        b.reduce((events, { name, event, abi, contract }) => {
          // console.log(contract, name, abis[contract])
          event.abi = abi
          event.contract = contract
          return { ...events, [name]: event }
        }, a),
      {},
    )
  return {
    abis,
    accounts,
    contracts,
    defaultTx,
    eth,
    events,
    hashes,
  }
}

/**
 * Livepeer SDK main module exports
 * @namespace module~exports
 */

/**
 * Livepeer SDK factory function. Creates an instance of the Livepeer SDK -- an object with useful methods for interacting with Livepeer protocol smart contracts
 * @memberof module~exports
 * @name default
 * @param {LivepeerSDKOptions} opts - SDK configuration options
 * @return {Promise<LivepeerSDK>}
 *
 * @example
 *
 * // Here we're naming the default export "LivepeerSDK"
 * import LivepeerSDK from '@livepeer/sdk'
 *
 * // Call the factory function and await its Promise
 * LivepeerSDK().then(sdk => {
 *   // Your Livepeer SDK instance is now ready to use
 * })
 *
 */
export default async function createLivepeerSDK(
  opts: LivepeerSDKOptions,
): Promise<LivepeerSDK> {
  const { events, ...config } = await initContracts(opts)
  const {
    BondingManager,
    Controller,
    JobsManager,
    LivepeerToken,
    LivepeerTokenFaucet,
    RoundsManager,
  } = config.contracts
  // Cache
  const cache = {
    // previous log queries are held here to improve perf
  }
  /**
   * "rpc" namespace of a Livepeer SDK instance
   * @namespace livepeer~rpc
   *
   * @example
   *
   * import LivepeerSDK from '@livepeer/sdk'
   *
   * LivepeerSDK().then(({ rpc }) => {
   *   // Here, we're destructuring the sdk to expose only its rpc namespace
   *   // Now, you you are able call rpc.<method-name>()
   *   // All rpc method yield Promises. Their usage is further explained below.
   * })
   *
   */
  const rpc = {
    /**
     * Gets the ETH balance for an account
     * @memberof livepeer~rpc
     * @param {string} addr - ETH account address
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getEthBalance('0xf00...')
     * // => string
     *
     */
    async getEthBalance(addr: string): Promise<string> {
      return toString(await config.eth.getBalance(addr))
    },

    /**
     * Gets the total supply of token (LTPU) available in the protocol
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getTokenTotalSupply()
     * // => string
     */
    async getTokenTotalSupply(): Promise<string> {
      return headToString(await LivepeerToken.totalSupply())
    },

    /**
     * Gets a user's token balance (LPTU)
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getTokenBalance('0xf00...')
     * // => string
     */
    async getTokenBalance(addr: string): Promise<string> {
      return headToString(await LivepeerToken.balanceOf(addr))
    },

    /**
     * Gets general information about tokens
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<TokenInfo>}
     *
     * @example
     *
     * await rpc.getTokenInfo()
     * // => TokenInfo { totalSupply: string, balance: string }
     */
    async getTokenInfo(addr: string): Promise<TokenInfo> {
      return {
        totalSupply: await rpc.getTokenTotalSupply(),
        balance: await rpc.getTokenBalance(addr),
      }
    },

    /**
     * Transfers tokens (LPTU) from one account to another
     * @memberof livepeer~rpc
     * @param {string} to - the account ETH address to send tokens to
     * @param {string} amount - the amount of token to send (LPTU)
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {Promise<TxReceipt>}
     *
     * @example
     *
     * await rpc.transferToken('0xf00...', '10')
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async transferToken(
      to: string,
      amount: string,
      tx = config.defaultTx,
    ): Promise<TxReceipt> {
      const value = toBN(amount)
      // make sure balance is higher than transfer
      const balance = (await LivepeerToken.balanceOf(tx.from))[0]
      if (!balance.gte(value)) {
        throw new Error(
          `Cannot transfer ${toString(
            value,
          )} LPT because is it greater than your current balance (${balance} LPT).`,
        )
      }
      // approve address / amount with LivepeerToken...
      await utils.getTxReceipt(
        await LivepeerToken.approve(to, value, tx),
        config.eth,
      )
      // ...aaaand transfer!
      return await utils.getTxReceipt(
        await LivepeerToken.transfer(to, value, tx),
        config.eth,
      )
    },

    /**
     * The amount of LPT the faucet distributes when tapped
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getFaucetAmount()
     * // => string
     */
    async getFaucetAmount(): Promise<string> {
      return headToString(await LivepeerTokenFaucet.requestAmount())
    },

    /**
     * How often an address can tap the faucet (in hours)
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getFaucetWait()
     * // => string
     */
    async getFaucetWait(): Promise<string> {
      return headToString(await LivepeerTokenFaucet.requestWait())
    },

    /**
     * Next timestamp at which the given address will be allowed to tap the faucet
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getFaucetNext()
     * // => string
     */
    async getFaucetNext(addr: string): Promise<string> {
      return headToString(await LivepeerTokenFaucet.nextValidRequest(addr))
    },

    /**
     * Info about the state of the LPT faucet
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<FaucetInfo>}
     *
     * @example
     *
     * await rpc.getFaucetInfo('0xf00...')
     * // => FaucetInfo {
     * //   amount: string,
     * //   wait: string,
     * //   next: string,
     * // }
     */
    async getFaucetInfo(addr: string): Promise<FaucetInfo> {
      return {
        amount: await rpc.getFaucetAmount(),
        wait: await rpc.getFaucetWait(),
        next: await rpc.getFaucetNext(addr),
      }
    },

    /**
     * Info about a broadcaster
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<Broadcaster>}
     *
     * @example
     *
     * await rpc.getBroadcaster('0xf00...')
     * // => Broadcaster {
     * //   address: string,
     * //   deposit: string,
     * //   withdrawBlock: string,
     * // }
     */
    async getBroadcaster(addr: string): Promise<Broadcaster> {
      const b = await JobsManager.broadcasters(addr)
      return {
        address: addr,
        deposit: toString(b.deposit),
        withdrawBlock: toString(b.withdrawBlock),
      }
    },

    /**
     * The delegator status of the given address
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getDelegatorStatus('0xf00...')
     * // => 'Pending' | 'Bonded' | 'Unbonding' | 'Unbonded'
     */
    async getDelegatorStatus(addr: string): Promise<string> {
      const status = headToString(await BondingManager.delegatorStatus(addr))
      return DELEGATOR_STATUS[status]
    },

    /**
     * The delegator's stake
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getDelegatorStake('0xf00...')
     * // => string
     */
    async getDelegatorStake(addr: string): Promise<string> {
      return headToString(await BondingManager.delegatorStake(addr))
    },

    /**
     * General info about a delegator
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<Delegator>}
     *
     * @example
     *
     * await rpc.getDelegator('0xf00...')
     * // => Delegator {
     * //   allowance: string,
     * //   address: string,
     * //   bondedAmount: string,
     * //   delegateAddress: string,
     * //   delegateAmount: string,
     * //   fees: string,
     * //   lastClaimRound: string,
     * //   pendingFees: string,
     * //   pendingStake: string,
     * //   startRound: string,
     * //   status: 'Pending' | 'Bonded' | 'Unbonding' | 'Unbonded',
     * //   withdrawRound: string,
     * // }
     */
    async getDelegator(addr: string): Promise<Delegator> {
      const status = await rpc.getDelegatorStatus(addr)
      const allowance = headToString(
        await LivepeerToken.allowance(addr, BondingManager.address),
      )
      const currentRound = await rpc.getCurrentRound()
      const pendingStake = headToString(
        await BondingManager.pendingStake(addr, currentRound),
      )
      const pendingFees = headToString(
        await BondingManager.pendingFees(addr, currentRound),
      )
      const d = await BondingManager.getDelegator(addr)
      const bondedAmount = toString(d.bondedAmount)
      const fees = toString(d.fees)
      const delegateAddress =
        d.delegateAddress === EMPTY_ADDRESS ? '' : d.delegateAddress
      const delegatedAmount = toString(d.delegatedAmount)
      const lastClaimRound = toString(d.lastClaimRound)
      const startRound = toString(d.startRound)
      const withdrawRound = toString(d.withdrawRound)
      return {
        address: addr,
        allowance,
        bondedAmount,
        delegateAddress,
        delegatedAmount,
        fees,
        lastClaimRound,
        pendingFees,
        pendingStake,
        startRound,
        status,
        withdrawRound,
      }
    },

    /**
     * Whether or not the transcoder is active
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<boolean>}
     *
     * @example
     *
     * await rpc.getTranscoderIsActive('0xf00...')
     * // => boolean
     */
    async getTranscoderIsActive(addr: string): Promise<boolean> {
      return headToBool(
        await BondingManager.isActiveTranscoder(
          addr,
          await rpc.getCurrentRound(),
        ),
      )
    },

    /**
     * Gets the status of a transcoder
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getTranscoderStatus('0xf00...')
     * // => 'NotRegistered' | 'Registered' | 'Resigned'
     */
    async getTranscoderStatus(addr: string): Promise<string> {
      const status = headToString(await BondingManager.transcoderStatus(addr))
      return TRANSCODER_STATUS[status]
    },

    /**
     * Gets a transcoder's total stake
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getTranscoderTotalStake('0xf00...')
     * // => string
     */
    async getTranscoderTotalStake(addr: string): Promise<string> {
      return headToString(await BondingManager.transcoderTotalStake(addr))
    },

    /**
     * Gets info about a transcoder
     * @memberof livepeer~rpc
     * @param  {string} addr - user's ETH address
     * @return {Promise<Transcoder>}
     *
     * @example
     *
     * await rpc.getTranscoder('0xf00...')
     * // => Transcoder {
     * //   active: boolean,
     * //   address: string,
     * //   rewardCut: string,
     * //   feeShare: string,
     * //   lastRewardRound: string,
     * //   pendingRewardCut string,
     * //   pendingFeeShare: string,
     * //   pendingPricePerSegment: string,
     * //   pricePerSegment: string,
     * //   status: 'NotRegistered' | 'Registered' | 'Resigned',
     * //   totalStake: string,
     * // }
     */
    async getTranscoder(addr: string): Promise<Transcoder> {
      const status = await rpc.getTranscoderStatus(addr)
      const active = await rpc.getTranscoderIsActive(addr)
      const totalStake = await rpc.getTranscoderTotalStake(addr)
      const t = await BondingManager.getTranscoder(addr)
      const feeShare = toString(t.feeShare)
      const lastRewardRound = toString(t.lastRewardRound)
      const pendingFeeShare = toString(t.pendingFeeShare)
      const pendingPricePerSegment = toString(t.pendingPricePerSegment)
      const pendingRewardCut = toString(t.pendingRewardCut)
      const pricePerSegment = toString(t.pricePerSegment)
      const rewardCut = toString(t.rewardCut)
      return {
        active,
        address: addr,
        rewardCut,
        feeShare,
        lastRewardRound,
        pricePerSegment,
        pendingRewardCut,
        pendingFeeShare,
        pendingPricePerSegment,
        status,
        totalStake,
      }
    },

    /**
     * Gets transcoders
     * @memberof livepeer~rpc
     * @return {Array<Transcoder>}
     *
     * @example
     *
     * await rpc.getTranscoders()
     * // => Array<Transcoder>
     */
    async getTranscoders(): Promise<Array<Transcoder>> {
      const transcoders = []
      let addr = headToString(await BondingManager.getFirstTranscoderInPool())
      while (addr !== EMPTY_ADDRESS) {
        const transcoder = await rpc.getTranscoder(addr)
        transcoders.push(transcoder)
        addr = headToString(await BondingManager.getNextTranscoderInPool(addr))
      }
      return transcoders
    },

    /**
     * Whether the protocol is paused
     * @memberof livepeer~rpc
     * @return {Promise<boolean>}
     *
     * @example
     *
     * await rpc.getProtocolPaused()
     * // => boolean
     */
    async getProtocolPaused(): Promise<boolean> {
      return headToBool(await Controller.paused())
    },

    /**
     * Gets the length of a round (in blocks)
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getRoundLength()
     * // => string
     */
    async getRoundLength(): Promise<string> {
      return headToString(await RoundsManager.roundLength())
    },

    /**
     * Gets the estimated number of rounds per year
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getRoundsPerYear()
     * // => string
     */
    async getRoundsPerYear(): Promise<string> {
      return headToString(await RoundsManager.roundsPerYear())
    },

    /**
     * Gets the number of the current round
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getCurrentRound()
     * // => string
     */
    async getCurrentRound(): Promise<string> {
      return headToString(await RoundsManager.currentRound())
    },

    /**
     * Whether or not the current round is initalized
     * @memberof livepeer~rpc
     * @return {Promise<boolean>}
     *
     * @example
     *
     * await rpc.getCurrentRoundIsInitialized()
     * // => boolean
     */
    async getCurrentRoundIsInitialized(): Promise<boolean> {
      return headToBool(await RoundsManager.currentRoundInitialized())
    },

    /**
     * The block at which the current round started
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getCurrentRoundStartBlock()
     * // => string
     */
    async getCurrentRoundStartBlock(): Promise<string> {
      return headToString(await RoundsManager.currentRoundStartBlock())
    },

    /**
     * The previously intitialized round
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getLastInitializedRound()
     * // => string
     */
    async getLastInitializedRound(): Promise<string> {
      return headToString(await RoundsManager.lastInitializedRound())
    },

    /**
     * Gets general information about the rounds in the protocol
     * @memberof livepeer~rpc
     * @return {Promise<RoundInfo>}
     *
     * @example
     *
     * await rpc.getCurrentRoundInfo()
     * // => RoundInfo {
     * //   id: string,
     * //   initialized: boolean,
     * //   startBlock: string,
     * //   lastInitializedRound: string,
     * //   length: string,
     * // }
     */
    async getCurrentRoundInfo(): Promise<RoundInfo> {
      const length = await rpc.getRoundLength()
      const id = await rpc.getCurrentRound()
      const initialized = await rpc.getCurrentRoundIsInitialized()
      const lastInitializedRound = await rpc.getLastInitializedRound()
      const startBlock = await rpc.getCurrentRoundStartBlock()
      return {
        id,
        initialized,
        lastInitializedRound,
        length,
        startBlock,
      }
    },

    // Jobs

    /**
     * Total jobs that have been created
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getTotalJobs()
     * // => string
     */
    async getTotalJobs(): Promise<string> {
      return headToString(await JobsManager.numJobs())
    },

    /**
     * Verification rate for jobs
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getJobVerificationRate()
     * // => string
     */
    async getJobVerificationRate(): Promise<string> {
      return headToString(await JobsManager.verificationRate())
    },

    /**
     * Verification period for jobs
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getJobVerificationPeriod()
     * // => string
     */
    async getJobVerificationPeriod(): Promise<string> {
      return headToString(await JobsManager.verificationPeriod())
    },

    /**
     * Slashing period for jobs
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getJobVerificationSlashingPeriod()
     * // => string
     */
    async getJobVerificationSlashingPeriod(): Promise<string> {
      return headToString(await JobsManager.verificationSlashingPeriod())
    },

    /**
     * Finder fee for jobs
     * @memberof livepeer~rpc
     * @return {Promise<string>}
     *
     * @example
     *
     * await rpc.getJobFinderFee()
     * // => string
     */
    async getJobFinderFee(): Promise<string> {
      return headToString(await JobsManager.finderFee())
    },

    /**
     * Gets general info about the state of jobs in the protocol
     * @memberof livepeer~rpc
     * @return {Promise<JobsInfo>}
     *
     * @example
     *
     * await rpc.getJobsInfo()
     * // => JobsInfo {
     * //   total: string,
     * //   verificationRate: string,
     * //   verificationPeriod: string,
     * //   verificationSlashingPeriod: string,
     * //   finderFee: string,
     * // }
     */
    async getJobsInfo(): Promise<JobsInfo> {
      const total = await rpc.getTotalJobs()
      const verificationRate = await rpc.getJobVerificationRate()
      const verificationPeriod = await rpc.getJobVerificationPeriod()
      const verificationSlashingPeriod = await rpc.getJobVerificationSlashingPeriod()
      const finderFee = await rpc.getJobFinderFee()
      return {
        total,
        verificationRate,
        verificationPeriod,
        verificationSlashingPeriod,
        finderFee,
      }
    },

    /**
     * Gets a job by id
     * @memberof livepeer~rpc
     * @param  {string} id - the job id
     * @return {Promise<Job>}
     *
     * @example
     *
     * await rpc.getJob('1337')
     * // => Job {
     * //   id: string,
     * //   streamId: string,
     * //   transcodingOptions: Array<JobProfile>
     * //   transcoder: string,
     * //   broadcaster: string,
     * // }
     */
    async getJob(id: string): Promise<Job> {
      const x = await JobsManager.getJob(id)
      return {
        id: `${id}`,
        streamId: x.streamId,
        transcodingOptions: utils.parseTranscodingOptions(x.transcodingOptions),
        transcoder: x.transcoderAddress,
        broadcaster: x.broadcasterAddress,
      }
    },

    /**
     * Gets a list of jobs
     * @memberof livepeer~rpc
     * @param {string} opts.from - block to search from
     * @param {string} opts.to - block to search to
     * @param {number} opts.blocksAgo - helps determine default from block
     * @param {string} opts.broadcaster - filter to only jobs created by this broadcaster
     * @return {Array<Job>}
     *
     * @example
     *
     * await rpc.getJobs()
     * // => Array<Job>
     */
    async getJobs({
      to,
      from,
      blocksAgo = 100 * 10000,
      ...filters
    } = {}): Array<Job> {
      const event = events.NewJob
      const head = await config.eth.blockNumber()
      const fromBlock = from || Math.max(0, head - blocksAgo)
      const toBlock = to || 'latest'
      const topics = utils.encodeEventTopics(event, filters)
      const params = {
        address: JobsManager.address,
        fromBlock,
        toBlock,
        topics,
      }
      const results =
        // cache[key] ||
        (await config.eth.getLogs(params)).map(
          compose(
            x => ({
              id: toString(x.jobId),
              streamId: x.streamId,
              transcodingOptions: utils.parseTranscodingOptions(
                x.transcodingOptions,
              ),
              broadcaster: x.broadcaster,
            }),
            utils.decodeEvent(event),
          ),
        )
      // cache[key] = results
      return results.reverse()
    },

    /**
     * Gets LPT from the faucet
     * @memberof livepeer~rpc
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {Promise<TxReceipt>}
     *
     * @example
     *
     * await rpc.tapFaucet('1337')
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async tapFaucet(tx = config.defaultTx): Promise<TxReceipt> {
      // const ms = await rpc.getFaucetTapIn(tx.from)
      // if (ms > 0)
      //   throw new Error(
      //     `Can't tap the faucet right now. Your next tap is in ${formatDuration(
      //       ms,
      //     )}.`,
      //   )
      // tap the faucet
      return await utils.getTxReceipt(
        await LivepeerTokenFaucet.request(tx),
        config.eth,
      )
    },

    /**
     * Initializes the round
     * @memberof livepeer~rpc
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {Promise<TxReceipt>}
     *
     * @example
     *
     * await rpc.initializeRound()
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async initializeRound(tx = config.defaultTx): Promise<TxReceipt> {
      try {
        // initialize round
        return await utils.getTxReceipt(
          await RoundsManager.initializeRound(tx),
          config.eth,
        )
      } catch (err) {
        err.message = 'Error: initializeRound\n' + err.message
        throw err
      }
    },

    /**
     * Claims token and eth earnings from the sender's `lastClaimRound + 1` through a given `endRound`
     * @memberof livepeer~rpc
     * @param {string} endRound - the round to claim earnings until
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {string}
     *
     * @example
     *
     * await rpc.claimEarnings()
     * // => string
     */
    async claimEarnings(
      endRound: string,
      tx = config.defaultTx,
    ): Promise<string> {
      return await BondingManager.claimEarnings(endRound, {
        ...config.defaultTx,
        ...tx,
      })
    },

    async approveTokenBondAmount(
      amount: string,
      tx: TxObject,
    ): Promise<TxReceipt> {
      const token = toBN(amount)
      // TODO: - check token balance
      await utils.getTxReceipt(
        await LivepeerToken.approve(BondingManager.address, token, {
          ...config.defaultTx,
          ...tx,
        }),
        config.eth,
      )
    },

    async bondApprovedTokenAmount(
      to: string,
      amount: string,
      tx: TxObject,
    ): Promise<TxReceipt> {
      const token = toBN(amount)
      // TODO: check for existing approval / round initialization / token balance
      return await utils.getTxReceipt(
        await BondingManager.bond(token, to, { ...config.defaultTx, ...tx }),
        config.eth,
      )
    },

    /**
     * Unbonds LPT from an address
     * @memberof livepeer~rpc
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {Promise<TxReceipt>}
     *
     * @example
     *
     * await rpc.unbond()
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async unbond(tx = config.defaultTx): Promise<TxReceipt> {
      const { status } = await rpc.getDelegator(tx.from)
      // Can only unbond successfully when not already "Unbonding"
      if (status === DELEGATOR_STATUS.Unbonding) {
        throw new Error('This account is already unbonding.')
      } else {
        return await utils.getTxReceipt(
          await BondingManager.unbond(),
          config.eth,
        )
      }
    },

    /**
     * Sets transcoder parameters
     * @memberof livepeer~rpc
     * @param {string} rewardCut - the block reward cut you wish to set
     * @param {string} feeShare - the fee share you wish to set
     * @param {string} pricePerSegment - the price per segment you wish to set
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {Promise<TxReceipt>}
     *
     * @example
     *
     * await rpc.setupTranscoder('10', '10', '5')
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async setupTranscoder(
      rewardCut: string, // percentage
      feeShare: string, // percentage
      pricePerSegment: string, // lpt
      tx = config.defaultTx,
    ): Promise<TxReceipt> {
      // become a transcoder
      return await utils.getTxReceipt(
        await BondingManager.transcoder(
          toBN(rewardCut),
          toBN(feeShare),
          toBN(pricePerSegment),
          tx,
        ),
        config.eth,
      )
    },

    /**
     * Deposits ETH for broadcasting
     * @memberof livepeer~rpc
     * @param {string} amount - amount of ETH to deposit
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {Promise<TxReceipt>}
     *
     * @example
     *
     * await rpc.deposit('100')
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async deposit(amount, tx = config.defaultTx): Promise<TxReceipt> {
      // make sure balance is higher than deposit
      const balance = toBN(await rpc.getEthBalance(tx.from))
      const value = toBN(amount)
      if (!balance.gte(value)) {
        throw new Error(
          `Cannot deposit ${toString(
            toBN(value.toString(10)),
          )} LPT because is it greater than your current balance (${balance} LPT).`,
        )
      }
      // ...aaaand deposit!
      return await utils.getTxReceipt(
        await JobsManager.deposit({
          ...tx,
          value,
        }),
        config.eth,
      )
    },

    /**
     * Withdraws deposited ETH
     * @memberof livepeer~rpc
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {Promise<TxReceipt>}
     *
     * @example
     *
     * await rpc.withdraw()
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async withdraw(tx = config.defaultTx): Promise<TxReceipt> {
      return await utils.getTxReceipt(
        await JobsManager.withdraw(tx),
        config.eth,
      )
      // withdraw all (default)
      // if ('undefined' === typeof amount) {
      //   await JobsManager.withdraw()
      // } else {
      //   // withdraw specific amount
      //   const a = toBN(amount)
      //   const b = (await JobsManager.broadcasters(tx.from)).deposit
      //   const c = b.sub(a)
      //   await JobsManager.withdraw()
      //   await rpc.deposit(c, tx)
      // }
      // // updated token info
      // return await rpc.getTokenInfo(tx.from)
    },

    /**
     * Withdraws earned token (Transfers a sender's delegator `bondedAmount` to their `tokenBalance`)
     * @memberof livepeer~rpc
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {TxReceipt}
     *
     * @example
     *
     * await rpc.withdrawStake()
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async withdrawStake(tx = config.defaultTx): Promise<TxReceipt> {
      return await utils.getTxReceipt(
        await BondingManager.withdrawStake(tx),
        config.eth,
      )
    },

    /**
     * Withdraws earned fees (Transfers a sender's delegator `fees` to their `ethBalance`)
     * @memberof livepeer~rpc
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {TxReceipt}
     *
     * @example
     *
     * await rpc.withdrawFees()
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async withdrawFees(tx = config.defaultTx): Promise<TxReceipt> {
      return await utils.getTxReceipt(
        await BondingManager.withdrawFees(tx),
        config.eth,
      )
    },

    /**
     * Creates a job
     * @memberof livepeer~rpc
     * @param {string} streamId - the stream id for the job
     * @param {Array<string>} profiles - a list of profiles to transcode the job into
     * @param {string} maxPricePerSegment - the maximum LPTU price the broadcaster is willing to pay per segment
     * @param {TxConfig} [tx = config.defaultTx] - an object specifying the `from` and `gas` values of the transaction
     * @return {Promise<TxReceipt>}
     *
     * @example
     *
     * await rpc.createJob('foo', [P240p30fps4x3', 'P360p30fps16x9'], '5')
     * // => TxReceipt {
     * //   transactionHash: string,
     * //   transactionIndex": BN,
     * //   blockHash: string,
     * //   blockNumber: BN,
     * //   cumulativeGasUsed: BN,
     * //   gasUsed: BN,
     * //   contractAddress: string,
     * //   logs: Array<Log {
     * //     logIndex: BN,
     * //     blockNumber: BN,
     * //     blockHash: string,
     * //     transactionHash: string,
     * //     transactionIndex: string,
     * //     address: string,
     * //     data: string,
     * //     topics: Array<string>
     * //   }>
     * // }
     */
    async createJob(
      streamId: string,
      profiles: Array<string> = [
        // default profiles
        'P240p30fps4x3',
        'P360p30fps16x9',
      ],
      maxPricePerSegment: string,
      tx = config.defaultTx,
    ): Promise<TxReceipt> {
      // ensure there are active transcoders
      // ...maybe we should also throw if deposit is below some theshold?
      // if ((await rpc.getTotalActiveTranscoders()) < 1) {
      //   throw Error(
      //     'Cannnot create a job at this time since there are no active transcoders',
      //   )
      // }
      // create job!
      return await utils.getTxReceipt(
        await JobsManager.job(
          streamId,
          utils.serializeTranscodingProfiles(profiles),
          toBN(maxPricePerSegment),
          tx,
        ),
        config.eth,
      )
      // latest job
      // return (await rpc.getJobs({ broadcaster: tx.from, blocksAgo: 0 }))[0]
    },
  }

  return {
    create: createLivepeerSDK,
    config,
    rpc,
    utils,
    events,
    constants: {
      ADDRESS_PAD,
      EMPTY_ADDRESS,
      DELEGATOR_STATUS,
      TRANSCODER_STATUS,
      VIDEO_PROFILE_ID_SIZE,
      VIDEO_PROFILES,
    },
  }

  // Keeping typedefs down here so they show up last in the generated API table of contents

  /**
   * ABI property descriptor
   * @typedef {Object} ABIPropDescriptor
   * @prop {boolean} constants - is the method constant?
   * @prop {Array<{ name: string, type: string }>} inputs - the method params
   * @prop {Array<{ name: string, type: string }>} outputs - method return values
   * @prop {boolean} payable - is the method payable?
   * @prop {string} stateMutability - type of state mutability
   * @prop {string} type - type of contract property
   */

  /**
   * Mostly "`truffle`-style" ABI artifacts but no bytecode/network properties required
   * @typedef {Object} ContractArtifact
   * @prop {string} name - name of the contract
   * @prop {Array<ABIPropDescriptor>} abi - lists info about contract properties
   */

  /**
   * SDK configuration options
   * @typedef {Object} LivepeerSDKOptions
   * @prop {string} [controllerAddress = '0x37dC71366Ec655093b9930bc816E16e6b587F968'] - The address of the delpoyed Controller contract
   * @prop {string} [provider = 'https://rinkeby.infura.io/srFaWg0SlljdJAoClX3B'] - The ETH http provider for rpc methods
   * @prop {number} [gas = 0] - the amount of gas to include with transactions by default
   * @prop {Object<string, ContractArtifact>} artifacts - an object containing contract name -> ContractArtifact mappings
   * @prop {Object<string, string>} privateKeys - an object containing public -> private key mappings. Should be specified if using the SDK for transactions without MetaMask (via CLI, etc)
   * @prop {string|number} account - the account that will be used for transacting and data-fetching. Can be one of the publicKeys specified in the `privateKeys` option or an index of an account available via MetaMask
   */

  /**
   * An object containing contract info and utility methods for interacting with the Livepeer protocol's smart contracts
   * @typedef {Object} LivepeerSDK
   * @prop {Object<string, any>} config - this prop is mostly for debugging purposes and could change a lot in the future. Currently, it contains the following props: `abis`, `accounts`, `contracts`, `defaultTx`, `eth`
   * @prop {Object<string, any>} constants - Exposes some constant values. Currently, it contains the following props: `ADDRESS_PAD`, `DELEGATOR_STATUS`, `EMPTY_ADDRESS`, `TRANSCODER_STATUS`, `VIDEO_PROFILES`, `VIDEO_PROFILE_ID_SIZE`
   * @prop {Function} create - same as the `createLivepeerSDK` function
   * @prop {Object<string, Object>} events - Object mapping an event name -> contract event descriptor object
   * @prop {Object<string, Function>} rpc - contains all of the rpc methods available for interacting with the Livepeer protocol
   * @prop {Object<string, Function>} utils - contains utility methods. Mostly here just because. Could possibly be removed or moved into its own module in the future
   */

  /**
   * An object containing the total token supply and a user's account balance.
   * @typedef {Object} TokenInfo
   * @prop {string} totalSupply - total supply of token available in the protocol (LPTU)
   * @prop {string} balance - user's token balance (LPTU)
   */

  /**
   * Transaction config object
   * @typedef {Object} TxConfig
   * @prop {string} from - the ETH account address to sign the transaction from
   * @prop {number} gas - the amount of gas to include in the transaction
   */

  /**
   * Transaction receipt
   * @typedef {Object} TxReceipt
   * @prop {string} transactionHash - the transaction hash
   * @prop {BN} transactionIndex - the transaction index
   * @prop {string} blockHash - the transaction block hash
   * @prop {BN} blockNumber - the transaction block number
   * @prop {BN} cumulativeGasUsed - the cumulative gas used in the transaction
   * @prop {BN} gasUsed - the gas used in the transaction
   * @prop {string} contractAddress - the contract address of the transaction method
   * @prop {Array<Log>} logs - an object containing logs that were fired during the transaction
   */

  /**
   * An object representing a contract log
   * @typedef {Object} Log
   * @prop {BN} logIndex - the log index
   * @prop {BN} blockNumber - the log block number
   * @prop {string} blockHash - the log block hash
   * @prop {string} transactionHash - the log's transaction hash
   * @prop {BN} transactionIndex - the log's transaction index
   * @prop {string} address - the log's address
   * @prop {string} data - the log's data
   * @prop {Array<string>} topics - the log's topics
   */

  /**
   * Information about the status of the LPT faucet
   * @typedef {Object} FaucetInfo
   * @prop {string} amount - the amount distributed by the faucet
   * @prop {string} wait - the faucet request cooldown time
   * @prop {string} next - the next time a valid faucet request may be made
   */

  /**
   * A Broadcaster struct
   * @typedef {Object} Broadcaster
   * @prop {string} address - the ETH address of the broadcaster
   * @prop {string} deposit - the amount of LPT the broadcaster has deposited
   * @prop {string} withdrawBlock - the next block at which a broadcaster may withdraw their deposit
   */

  /**
   * A Delegator struct
   * @typedef {Object} Delegator
   * @prop {string} allowance - the delegator's LivepeerToken approved amount for transfer
   * @prop {string} address - the delegator's ETH address
   * @prop {string} bondedAmount - The amount of LPTU a delegator has bonded
   * @prop {string} delegateAddress - the ETH address of the delegator's delegate
   * @prop {string} delegatedAmount - the amount of LPTU the delegator has delegated
   * @prop {string} fees - the amount of LPTU a delegator has collected
   * @prop {string} lastClaimRound - the last round that the delegator claimed reward and fee pool shares
   * @prop {string} pendingFees - the amount of ETH the delegator has earned up to the current round
   * @prop {string} pendingStake - the amount of token the delegator has earned up to the current round
   * @prop {string} startRound - the round the delegator becomes bonded and delegated to its delegate
   * @prop {string} status - the delegator's status
   * @prop {string} withdrawRound - the round the delegator can withdraw its stake
   */

  /**
   * A Transcoder struct
   * @typedef {Object} Transcoder
   * @prop {boolean} active - whether or not the transcoder is active
   * @prop {string} address - the transcoder's ETH address
   * @prop {string} rewardCut - % of block reward cut paid to transcoder by a delegator
   * @prop {string} feeShare - % of fees paid to delegators by transcoder
   * @prop {string} lastRewardRound - last round that the transcoder called reward
   * @prop {string} pendingRewardCut - pending block reward cut for next round if the transcoder is active
   * @prop {string} pendingFeeShare - pending fee share for next round if the transcoder is active
   * @prop {string} pendingPricePerSegment - pending price per segment for next round if the transcoder is active
   * @prop {string} pricePerSegment - price per segment for a stream (LPTU)
   * @prop {string} status - the transcoder's status
   * @prop {string} totalStake - total tokens delegated toward a transcoder (including their own)
   */

  /**
   * An object containing information about the current round
   * @typedef {Object} RoundInfo
   * @prop {string} id - the number of the current round
   * @prop {boolean} initialized - whether or not the current round is initialized
   * @prop {string} startBlock - the start block of the current round
   * @prop {string} lastInitializedRound - the last round that was initialized prior to the current
   * @prop {string} length - the length of rounds
   */

  /**
   * An object containing overview information about the jobs in the protocol
   * @typedef {Object} JobsInfo
   * @prop {string} total - the total number of jobs created
   * @prop {boolean} verificationRate - the verification rate for jobs
   * @prop {string} verificationPeriod - the verification period for jobs
   * @prop {string} verificationSlashingPeriod - the slashing period for jobs
   * @prop {string} finderFee - the finder fee for jobs
   */

  /**
   * A Job struct
   * @typedef {Object} Job
   * @prop {string} jobId - the id of the job
   * @prop {string} streamId - the job's stream id
   * @prop {Array<TranscodingProfile>} transcodingOptions - transcoding profiles
   * @prop {string} [transcoder] - the ETH address of the assigned transcoder
   * @prop {string} broadcaster - the ETH address of the broadcaster who created the job
   */
}
