import Eth from 'ethjs'
import { decodeEvent } from 'ethjs-abi'
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
  provider: 'http://localhost:8545',
  account: '',
  gas: 6700000,
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
  /**
   * Parses an encoded string of transcoding options
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
   * @param  {string} addr - an ETH address
   * @return {string}
   */
  padAddress: addr => ADDRESS_PAD + addr.substr(2),
  /**
   * Encodes an event filter object into a topic list
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
const toBN = n => (BN.isBN(n) ? n : new BN(n))
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))
const prop = (k: string | number) => (x): any => x[k]
const toBool = (x: any): boolean => !!x
const toString = (x: Eth.BN): string => x.toString(10)
const toNumber = (x: Eth.BN): number => Number(x.toString(10))
const headToNumber = compose(toNumber, prop(0))
const headToBool = compose(toBool, prop(0))
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
 * @return {{ et, gash: Eth, defaultTx: { from: string, gas: number } }}
 */
export async function initRPC({
  account,
  gas,
  provider,
}): Promise<{
  eth: Eth,
  defaultTx: { from: string, gas: number },
}> {
  const ethjsProvider = new Eth.HttpProvider(provider)
  const eth = new Eth(ethjsProvider)
  const accounts = await eth.accounts()
  const from = new Set(accounts).has(account)
    ? account
    : accounts[account] || accounts[0]
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
 * @param {string} opts.provider  - the httpProvider for contract RPC
 * @param {Object} opts.artifacts - ...
 */
export async function initContracts(opts): Promise<Object<string, Contract>> {
  // Merge pass options with defaults
  const { account, artifacts, gas, provider } = { ...DEFAULTS, ...opts }
  // Instanstiate new ethjs instance with specified provider
  const { eth, accounts, defaultTx } = await initRPC({ account, gas, provider })
  // Create a LivepeerToken contract instance
  const LivepeerToken = await getContractAt(eth, {
    ...artifacts.LivepeerToken,
    defaultTx,
  })
  // Create a LivepeerTokenFaucet contract instance
  const LivepeerTokenFaucet = await getContractAt(eth, {
    ...artifacts.LivepeerTokenFaucet,
    defaultTx,
  })
  // Create a Controller contract instance
  const Controller = await getContractAt(eth, {
    ...artifacts.Controller,
    defaultTx,
  })
  // Create a BondingManager contract instance
  const BondingManager = await getContractAt(eth, {
    ...artifacts.BondingManager,
    defaultTx,
    address: (await Controller.getContract(Eth.keccak256('BondingManager')))[0],
  })
  // Create a JobsManager contract instance
  const JobsManager = await getContractAt(eth, {
    ...artifacts.JobsManager,
    defaultTx,
    address: (await Controller.getContract(Eth.keccak256('JobsManager')))[0],
  })
  // Create a RoundsManager contract instance
  const RoundsManager = await getContractAt(eth, {
    ...artifacts.RoundsManager,
    defaultTx,
    address: (await Controller.getContract(Eth.keccak256('RoundsManager')))[0],
  })
  const contracts = {
    BondingManager,
    Controller,
    JobsManager,
    LivepeerToken,
    LivepeerTokenFaucet,
    RoundsManager,
  }
  const abis = Object.entries(artifacts)
    .map(([k, v]) => ({ [k]: v.abi }))
    .reduce((a, b) => ({ ...a, ...b }), {})
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
  }
}

/**
 * Gives back a nice big object with useful methods for interacting with Livepeer contracts
 * @param {Object} args[0] - options passed to `initContracts()`
 */
export default async function initLivepeerSDK(
  opts: Object,
): Object<string, (...args: Array<any>) => Promise<any>> {
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
  // RPC methods
  const rpc = {
    // Tokens

    /**
   * Gets the total supply of LPT available in the protocol
   * @return {number}
   */
    async getTokenTotalSupply(): Promise<number> {
      return headToNumber(await LivepeerToken.totalSupply())
    },

    /**
   * Gets a user's token balance
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getTokenBalance(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<number> {
      return headToNumber(await LivepeerToken.balanceOf(addr))
    },

    /**
   * Gets a user's token deposit
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getTokenDeposit(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<number> {
      return headToNumber(await JobsManager.broadcasterDeposits(addr))
    },

    /**
   * Gets general information about tokens
   * @param  {string} addr - user's ETH address
   * @return {{ totalSupply: number, balance: number, deposit: number }}
   */
    async getTokenInfo(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<{
      totalSupply: number,
      balance: number,
      deposit: number,
    }> {
      return {
        totalSupply: await rpc.getTokenTotalSupply(),
        balance: await rpc.getTokenBalance(addr),
        deposit: await rpc.getTokenDeposit(addr),
      }
    },

    // Faucet

    /**
   * ...
   * @return {number}
   */
    async getFaucetAmount(): Promise<number> {
      return headToNumber(await LivepeerTokenFaucet.requestAmount())
    },

    /**
   * ...
   * @return {number}
   */
    async getFaucetTapRate(): Promise<number> {
      return headToNumber(await LivepeerTokenFaucet.requestWait())
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getFaucetTapAt(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<number> {
      return (
        headToNumber(await LivepeerTokenFaucet.nextValidRequest(addr)) * 1000
      )
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getFaucetTapIn(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<number> {
      const now = Date.now()
      const then = await rpc.getFaucetTapAt(addr)
      const t = then - now
      return t > 0 ? t : 0
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getFaucetInfo(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<{
      amount: number,
      tapRate: number,
      tapAt: number,
      tapIn: number,
    }> {
      return {
        amount: await rpc.getFaucetAmount(),
        tapRate: await rpc.getFaucetTapRate(),
        tapAt: await rpc.getFaucetTapAt(addr),
        tapIn: await rpc.getFaucetTapIn(addr),
      }
    },

    // Delegator

    /**
   * ...
   * @return {number}
   */
    async getBondingManagerIsInitialized(): Promise<boolean> {
      return toBool(await BondingManager.isInitialized())
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getDelegatorStatus(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<string> {
      const status = headToNumber(await BondingManager.delegatorStatus(addr))
      return DELEGATOR_STATUS[status]
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getDelegatorStake(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<number> {
      return headToNumber(await BondingManager.delegatorStake(addr))
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getDelegator(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<{
      address: string,
      status: string,
      delegateAddress: string,
      bondedAmount: number,
      unbondedAmount: number,
      delegateStake: number,
      lastClaimRound: ?number,
      startRound: ?number,
      withdrawRound: ?number,
    }> {
      const isInitialized = await rpc.getBondingManagerIsInitialized()
      const status = await rpc.getDelegatorStatus(addr)
      if (!isInitialized || status === DELEGATOR_STATUS.Unbonded) {
        return {
          address: addr,
          status: DELEGATOR_STATUS.Unbonded,
          stake: null, // bonded amount, but includes past rounds, rewards and fees, etc
          bondedAmount: 0,
          unbondedAmount: 0,
          delegateAddress: '',
          delegateStake: null,
          lastClaimRound: null,
          startRound: null,
          withdrawRound: null,
        }
      }
      const stake = await rpc.getDelegatorStake(addr)
      const d = await BondingManager.getDelegator(addr)
      const delegateAddress =
        d.delegateAddress === EMPTY_ADDRESS ? '' : d.delegateAddress
      const bondedAmount = toNumber(d.bondedAmount)
      const unbondedAmount = toNumber(d.unbondedAmount)
      const delegateStake = toNumber(d.delegatedAmount)
      const lastClaimRound = toNumber(d.lastClaimTokenPoolsSharesRound)
      const startRound = toNumber(d.startRound)
      const withdrawRound = toNumber(d.withdrawRound)
      return {
        address: addr,
        status,
        stake,
        bondedAmount,
        unbondedAmount,
        delegateAddress,
        delegateStake,
        lastClaimRound: lastClaimRound ? lastClaimRound : null,
        startRound: startRound ? startRound : null,
        withdrawRound: withdrawRound ? withdrawRound : null,
      }
    },

    // Transcoder

    /**
   * ...
   * @return {number}
   */
    async getTotalActiveTranscoders(): Promise<number> {
      return headToNumber(await BondingManager.getActivePoolSize())
    },

    /**
   * ...
   * @return {number}
   */
    async getTotalCandidateTranscoders(): Promise<number> {
      return headToNumber(await BondingManager.getCandidatePoolSize())
    },

    /**
   * ...
   * @return {number}
   */
    async getTotalReserveTranscoders(): Promise<number> {
      return headToNumber(await BondingManager.getReservePoolSize())
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getTranscoderIsActive(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<boolean> {
      return headToBool(await BondingManager.isActiveTranscoder(addr))
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getTranscoderStatus(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<string> {
      const status = headToNumber(await BondingManager.transcoderStatus(addr))
      return TRANSCODER_STATUS[status]
    },

    /**
   * ...
   * @param  {string} addr - user's ETH address
   * @return {number}
   */
    async getTranscoder(
      addr: string = invariant('addr', 0, 'string'),
    ): Promise<{
      active: boolean,
      address: string,
      status: string,
      delegateStake: ?number,
      delegatorWithdrawRound: ?number,
      lastRewardRound: ?number,
      blockRewardCut: ?number,
      feeShare: ?number,
      pricePerSegment: ?number,
      pendingBlockRewardCut: ?number,
      pendingFeeShare: ?number,
      pendingPricePerSegment: ?number,
    }> {
      const status = await rpc.getTranscoderStatus(addr)
      if (TRANSCODER_STATUS.NotRegistered === status) {
        return {
          active: false,
          address: addr,
          status,
          delegateStake: null,
          delegatorWithdrawRound: null,
          lastRewardRound: null,
          blockRewardCut: null,
          feeShare: null,
          pricePerSegment: null,
          pendingBlockRewardCut: null,
          pendingFeeShare: null,
          pendingPricePerSegment: null,
        }
      }
      const active = await rpc.getTranscoderIsActive(addr)
      const { delegateStake } = await rpc.getDelegator(addr)
      const t = await BondingManager.getTranscoder(addr)
      const delegatorWithdrawRound = toNumber(t.delegatorWithdrawRound)
      const lastRewardRound = toNumber(t.lastRewardRound)
      const blockRewardCut = toNumber(t.blockRewardCut)
      const feeShare = toNumber(t.feeShare)
      const pricePerSegment = toNumber(t.pricePerSegment)
      const pendingBlockRewardCut = toNumber(t.pendingBlockRewardCut)
      const pendingFeeShare = toNumber(t.pendingFeeShare)
      const pendingPricePerSegment = toNumber(t.pendingPricePerSegment)
      return {
        active,
        address: addr,
        status,
        delegateStake,
        delegatorWithdrawRound: delegatorWithdrawRound
          ? delegatorWithdrawRound
          : null,
        lastRewardRound: lastRewardRound ? lastRewardRound : null,
        blockRewardCut: blockRewardCut ? blockRewardCut : null,
        feeShare: feeShare ? feeShare : null,
        pricePerSegment: pricePerSegment ? pricePerSegment : null,
        pendingBlockRewardCut: pendingBlockRewardCut
          ? pendingBlockRewardCut
          : null,
        pendingFeeShare: pendingFeeShare ? pendingFeeShare : null,
        pendingPricePerSegment: pendingPricePerSegment
          ? pendingPricePerSegment
          : null,
      }
    },

    /**
   * ...
   * @return {boolean}
   */
    async getActiveTranscoders() {
      return await Promise.all(
        Array(await rpc.getTotalActiveTranscoders())
          .fill(0)
          .map(async (_, i) => {
            const res = await BondingManager.getCandidateTranscoderAtPosition(i)
            const address = res[0]
            return await rpc.getTranscoder(address)
          }),
      )
    },

    /**
   * ...
   * @return {boolean}
   */
    async getRoundsManagerIsInitialized(): Promise<boolean> {
      return headToBool(await RoundsManager.isInitialized())
    },

    /**
   * ...
   * @return {number}
   */
    async getRoundLength(): Promise<number> {
      return headToNumber(await RoundsManager.roundLength())
    },

    /**
   * ...
   * @return {number}
   */
    async getRoundsPerYear(): Promise<number> {
      return headToNumber(await RoundsManager.roundsPerYear())
    },

    /**
   * ...
   * @return {number}
   */
    async getCurrentRound(): Promise<number> {
      return headToNumber(await RoundsManager.currentRound())
    },

    /**
   * ...
   * @return {boolean}
   */
    async getCurrentRoundIsInitialized(): Promise<boolean> {
      return headToBool(await RoundsManager.currentRoundInitialized())
    },

    /**
   * ...
   * @return {number}
   */
    async getCurrentRoundStartBlock(): Promise<number> {
      return headToNumber(await RoundsManager.currentRoundStartBlock())
    },

    /**
   * ...
   * @return {number}
   */
    async getLastInitializedRound(): Promise<number> {
      return headToNumber(await RoundsManager.lastInitializedRound())
    },

    /**
   * ...
   * @return {number}
   */
    async getRoundInfo(): {
      currentRound: ?number,
      currentRoundInitialized: boolean,
      currentRoundStartBlock: ?number,
      lastInitializedRound: ?number,
      roundLength: ?number,
      roundsPerYear: ?number,
    } {
      const isInitialized = await rpc.getRoundsManagerIsInitialized()
      if (!isInitialized) {
        return {
          currentRound: null,
          currentRoundInitialized: false,
          currentRoundStartBlock: null,
          lastInitializedRound: null,
          roundLength: null,
          roundsPerYear: null,
        }
      }
      const roundLength = await rpc.getRoundLength()
      const roundsPerYear = await rpc.getRoundsPerYear()
      const currentRound = await rpc.getCurrentRound()
      const currentRoundInitialized = await rpc.getCurrentRoundIsInitialized()
      const lastInitializedRound = await rpc.getLastInitializedRound()
      const currentRoundStartBlock = await rpc.getCurrentRoundStartBlock()
      return {
        currentRound,
        currentRoundInitialized,
        currentRoundStartBlock,
        lastInitializedRound,
        roundLength,
        roundsPerYear,
      }
    },

    // Jobs

    /**
   * ...
   * @return {boolean}
   */
    async getJobsManagerIsInitialized(): Promise<boolean> {
      return headToBool(await JobsManager.isInitialized())
    },

    /**
   * ...
   * @return {number}
   */
    async getTotalJobs(): Promise<number> {
      return headToNumber(await JobsManager.numJobs())
    },

    /**
   * ...
   * @return {number}
   */
    async getJobVerificationRate(): Promise<number> {
      return headToNumber(await JobsManager.verificationRate())
    },

    /**
   * ...
   * @return {number}
   */
    async getJobEndingPeriod(): Promise<number> {
      return headToNumber(await JobsManager.jobEndingPeriod())
    },

    /**
   * ...
   * @return {number}
   */
    async getJobVerificationPeriod(): Promise<number> {
      return headToNumber(await JobsManager.verificationPeriod())
    },

    /**
   * ...
   * @return {number}
   */
    async getJobSlashingPeriod(): Promise<number> {
      return headToNumber(await JobsManager.slashingPeriod())
    },

    /**
   * ...
   * @return {number}
   */
    async getJobFinderFee(): Promise<number> {
      return headToNumber(await JobsManager.finderFee())
    },

    /**
   * Gets general info about the state of jobs in the protocol
   * @return {{
   *   totalJobs: number,
   *   verificationRate: ?number,
   *   verificationPeriod: ?number,
   *   slashingPeriod: ?number,
   *   endingPeriod: ?number,
   *   finderFee: ?number
   * }}
   */
    async getJobsInfo(): {
      totalJobs: number,
      verificationRate: ?number,
      verificationPeriod: ?number,
      slashingPeriod: ?number,
      endingPeriod: ?number,
      finderFee: ?number,
    } {
      const isInitialized = await rpc.getJobsManagerIsInitialized()
      if (!isInitialized) {
        return {
          totalJobs: 0,
          verificationRate: null,
          verificationPeriod: null,
          slashingPeriod: null,
          endingPeriod: null,
          finderFee: null,
        }
      }
      const totalJobs = await rpc.getTotalJobs()
      const verificationRate = await rpc.getJobVerificationRate()
      const endingPeriod = await rpc.getJobEndingPeriod()
      const verificationPeriod = await rpc.getJobEndingPeriod()
      const slashingPeriod = await rpc.getJobSlashingPeriod()
      const finderFee = await rpc.getJobFinderFee()
      return {
        totalJobs,
        verificationRate,
        verificationPeriod,
        slashingPeriod,
        endingPeriod,
        finderFee,
      }
    },

    /**
   * Gets a job by id
   * @param  {number} id - the job id
   * @return {{
   *   jobId: number,
   *   streamId: string,
   *   transcodingOptions: Array<Object>,
   *   transcoder: string,
   *   broadcaster: string
   * }}
   */
    async getJob(id: number = invariant('id', 0, 'number')): Promise<Object> {
      const x = await JobsManager.getJob(id)
      return {
        jobId: Number(id),
        streamId: x.streamId,
        transcodingOptions: utils.parseTranscodingOptions(x.transcodingOptions),
        transcoder: x.transcoderAddress,
        broadcaster: x.broadcasterAddress,
      }
    },

    /**
   * Gets a list of jobs
   * @param  {number} opts.from - 
   * @param  {number} opts.to   - 
   * @return {{
   *   jobId: number,
   *   streamId: string,
   *   transcodingOptions: Array<Object>,
   *   transcoder: string,
   *   broadcaster: string
   * }}
   */
    async getJobs(
      { to, from, blocksAgo = 100 * 10000, ...filters } = {},
    ): Array<{
      streamId: string,
      transcodingOptions: Array<Object>,
      transcoder: string,
      broadcaster: string,
    }> {
      const event = events.NewJob
      const head = await config.eth.blockNumber()
      const fromBlock = from || Math.max(0, head - blocksAgo)
      const toBlock = to || 'latest'
      const topics = utils.encodeEventTopics(event, filters)
      const params = {
        fromBlock,
        toBlock,
        topics,
      }
      // @TODO - caching algorithm
      // const key = JSON.stringify(params)
      const results =
        // cache[key] ||
        (await config.eth.getLogs(params)).map(
          compose(
            x => ({
              jobId: toNumber(x.jobId),
              streamId: x.streamId,
              transcodingOptions: utils.parseTranscodingOptions(
                x.transcodingOptions,
              ),
              transcoder: x.transcoder,
              broadcaster: x.broadcaster,
            }),
            utils.decodeEvent(event),
          ),
        )
      // cache[key] = results
      return results
    },

    /**
   * ...
   * @return {number}
   */
    async tapFaucet(tx = config.defaultTx): Promise<number> {
      const ms = await rpc.getFaucetTapIn(tx.from)
      if (ms > 0)
        throw new Error(
          `Can't tap the faucet right now. Your next tap is in ${formatDuration(
            ms,
          )}.`,
        )
      await LivepeerTokenFaucet.request(tx)
      // updated balance
      return await rpc.getTokenBalance(tx.from)
    },

    /**
   * ...
   * @return {number}
   */
    async initializeRound(tx = config.defaultTx): Promise<Object> {
      await RoundsManager.initializeRound(tx)
      // updated round info
      return rpc.getRoundInfo()
    },

    /**
   * ...
   * @return {Object}
   */
    async bond(
      { to, amount }: { to: string, amount: number } = {},
      tx = config.defaultTx,
    ): Promise<Object> {
      // make sure current round is initialized
      if (!await rpc.getCurrentRoundIsInitialized()) {
        await rpc.initializeRound(tx)
      }
      // make sure balance is higher than bond
      const balance = (await LivepeerToken.balanceOf(tx.from))[0]
      if (!balance.gte(toBN(amount))) {
        throw new Error(
          `Cannot bond ${toNumber(
            toBN(amount),
          )} LPT because is it greater than your current balance (${balance} LPT).`,
        )
      }
      // approve BondingManager address / amount with LivepeerToken...
      const { address } = BondingManager
      await LivepeerToken.approve(address, toBN(amount), tx)
      // ...aaaand bond!
      await BondingManager.bond(toBN(amount), to, tx)
      // updated delegator info
      return await rpc.getDelegator(tx.from)
    },

    /**
   * ...
   * @return {Object}
   */
    async unbond(tx = config.defaultTx): Promise<Object> {
      const { status } = await rpc.getDelegator(tx.from)
      // Can only unbond successfully when not already "Unbonding"
      if (status === DELEGATOR_STATUS.Unbonding) {
        console.warn('This account is already unbonding.')
      } else {
        await BondingManager.unbond()
      }
      return await rpc.getDelegator(tx.from)
    },

    /**
   * ...
   * @return {Object}
   */
    async setupTranscoder(
      {
        blockRewardCut, // percentage
        feeShare, // percentage
        pricePerSegment, // lpt
      }: {
        blockRewardCut: number,
        feeShare: number,
        pricePerSegment: number,
      } = {},
      tx = config.defaultTx,
    ) {
      await BondingManager.transcoder(
        toBN(blockRewardCut),
        toBN(feeShare),
        toBN(pricePerSegment),
        tx,
      )
      // updated transcoder info
      return await rpc.getTranscoder(tx.from)
    },

    /**
   * ...
   * @return {Object}
   */
    async deposit(
      amount: number = invariant('amount', 0, 'number'),
      tx = config.defaultTx,
    ): Promise<Object> {
      // make sure balance is higher than deposit
      const balance = (await LivepeerToken.balanceOf(tx.from))[0]
      if (!balance.gte(toBN(amount))) {
        throw new Error(
          `Cannot deposit ${toNumber(
            toBN(amount),
          )} LPT because is it greater than your current balance (${balance} LPT).`,
        )
      }
      // approve JobsManager address / amount with LivepeerToken...
      const { address } = JobsManager
      await LivepeerToken.approve(address, toBN(amount), tx)
      // ...aaaand deposit!
      await JobsManager.deposit(toBN(amount), tx)
      // updated token info
      return await rpc.getTokenInfo(tx.from)
    },

    /**
   * ...
   * @return {Object}
   */
    async withdraw(amount: ?number, tx = config.defaultTx): Promise<Object> {
      // withdraw all (default)
      if ('undefined' === typeof amount) {
        await JobsManager.withdraw()
      } else {
        // withdraw specific amount
        const a = toBN(amount)
        const b = (await JobsManager.broadcasterDeposits(tx.from))[0]
        const c = b.sub(a)
        await JobsManager.withdraw()
        await rpc.deposit(c, tx)
      }
      // updated token info
      return await rpc.getTokenInfo(tx.from)
    },

    /**
   * ...
   * @return {Object}
   */
    async createJob(
      {
        streamId,
        profiles = [
          // default profiles
          'P240p30fps4x3',
          'P360p30fps16x9',
        ],
        maxPricePerSegment,
      }: {
        streamId: string,
        profiles: Array<string>,
        maxPricePerSegment: number,
      },
      tx = config.defaultTx,
    ): Promise<Object> {
      // ensure there are active transcoders
      // ...maybe we should also throw if deposit is below some theshold?
      if ((await rpc.getTotalActiveTranscoders()) < 1) {
        throw Error(
          'Cannnot create a job at this time since there are no active transcoders',
        )
      }
      await JobsManager.job(
        streamId,
        utils.serializeTranscodingProfiles(profiles),
        toBN(maxPricePerSegment),
        tx,
      )
      // latest job
      return (await rpc.getJobs({ broadcaster: tx.from, blocksAgo: 0 }))[0]
    },
  }

  return {
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
}
