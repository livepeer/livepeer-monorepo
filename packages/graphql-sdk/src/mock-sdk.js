import {
  utils,
  ADDRESS_PAD,
  EMPTY_ADDRESS,
  DELEGATOR_STATUS,
  TRANSCODER_STATUS,
  VIDEO_PROFILE_ID_SIZE,
  VIDEO_PROFILES,
} from '@livepeer/sdk'

/**
 * Mock SDK Interface
 */

const livepeer = {
  config: {
    eth: {
      net_version: async () => '1',
    },
    contracts: {},
  },
  constants: {
    ADDRESS_PAD,
    EMPTY_ADDRESS,
    DELEGATOR_STATUS,
    TRANSCODER_STATUS,
    VIDEO_PROFILE_ID_SIZE,
    VIDEO_PROFILES,
  },
  rpc: {
    getBlock: async id => ({
      number: /latest/.test(id)
        ? `${CURRENT_BLOCK++}`
        : /earliest/.test(id)
          ? '0'
          : `${id}`,
    }),
    getENSName: async id => ALL_ENS_NAMES[id] || '',
    getENSAddress: async name => ALL_ENS_ADDRESSES[name] || '',
    getEthBalance: async id =>
      ALL_ETH_BALANCES[
        await livepeer.utils.resolveAddress(livepeer.rpc.getENSAddress, id)
      ],
    getTokenBalance: async id =>
      ALL_TOKEN_BALANCES[
        await livepeer.utils.resolveAddress(livepeer.rpc.getENSAddress, id)
      ],
    getBroadcaster: async id =>
      ALL_BROADCASTERS[
        await livepeer.utils.resolveAddress(livepeer.rpc.getENSAddress, id)
      ],
    getCurrentRoundInfo: async () => ALL_ROUNDS[100],
    getDelegator: async id =>
      ALL_DELEGATORS[
        await livepeer.utils.resolveAddress(livepeer.rpc.getENSAddress, id)
      ],
    getJob: async id => ALL_JOBS[id],
    getJobs: async ({ broadcaster } = {}) =>
      broadcaster
        ? ALL_JOBS.filter(x => x.broadcaster === broadcaster).reverse()
        : ALL_JOBS.slice().reverse(),
    getTranscoder: async id =>
      ALL_TRANSCODERS[
        await livepeer.utils.resolveAddress(livepeer.rpc.getENSAddress, id)
      ],
    getTranscoders: async () => Object.values(ALL_TRANSCODERS),
    getProtocolPaused: async () => false,
    getProtocol: async () => PROTOCOL,
  },
  utils: {
    ...utils,
    resolveAddress: async (resolve, addrOrName) => {
      return utils.isValidAddress(addrOrName)
        ? addrOrName
        : await livepeer.rpc.getENSAddress(addrOrName)
    },
  },
}

/**
 * Mock Contract Data
 */

let CURRENT_BLOCK = 0

const ALL_ENS_ADDRESSES = {
  'foo.test': EMPTY_ADDRESS.replace(/00/g, '11'),
  'bar.test': EMPTY_ADDRESS.replace(/00/g, '22'),
}

const ALL_ENS_NAMES = {
  [`${EMPTY_ADDRESS.replace(/00/g, '11')}`]: '',
  // simulate reverse lookup fail (happens most of the time)
  [`${EMPTY_ADDRESS.replace(/00/g, '22')}`]: 'bar.test',
}

const ALL_ETH_BALANCES = {
  [EMPTY_ADDRESS.replace(/00/g, '11')]: '0',
  [EMPTY_ADDRESS.replace(/00/g, '22')]: '1000000000',
}

const ALL_TOKEN_BALANCES = {
  [EMPTY_ADDRESS.replace(/00/g, '11')]: '0',
  [EMPTY_ADDRESS.replace(/00/g, '22')]: '9999999999',
}

const ALL_BROADCASTERS = {
  [EMPTY_ADDRESS.replace(/00/g, '11')]: {
    address: EMPTY_ADDRESS.replace(/00/g, '11'),
    deposit: '0',
    withdrawBlock: '0',
  },
  [EMPTY_ADDRESS.replace(/00/g, '22')]: {
    address: EMPTY_ADDRESS.replace(/00/g, '22'),
    deposit: '1000',
    withdrawBlock: '50',
  },
}

const ALL_DELEGATORS = {
  [EMPTY_ADDRESS.replace(/00/g, '11')]: {
    address: EMPTY_ADDRESS.replace(/00/g, '11'),
    allowance: '0',
    delegateAddress: EMPTY_ADDRESS.replace(/00/g, '22'),
    bondedAmount: '0',
    fees: '0',
    delegatedAmount: '0',
    lastClaimRound: '0',
    pendingFees: '0',
    pendingStake: '0',
    startRound: '0',
    status: DELEGATOR_STATUS.Unbonded,
    withdrawAmount: '0',
    withdrawRound: '0',
    nextUnbondingLockId: '0',
  },
  [EMPTY_ADDRESS.replace(/00/g, '22')]: {
    address: EMPTY_ADDRESS.replace(/00/g, '22'),
    allowance: '0',
    delegateAddress: EMPTY_ADDRESS.replace(/00/g, '11'),
    bondedAmount: '0',
    fees: '0',
    delegatedAmount: '0',
    lastClaimRound: '0',
    pendingFees: '0',
    pendingStake: '0',
    startRound: '0',
    status: DELEGATOR_STATUS.Unbonded,
    withdrawAmount: '0',
    withdrawRound: '0',
    nextUnbondingLockId: '0',
  },
}

const ALL_JOBS = [
  {
    id: '0',
    streamId: 'x36xhzz',
    transcodingOptions: [VIDEO_PROFILES.P144p30fps16x9],
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '11'),
  },
  {
    id: '1',
    streamId: 'x36xhzz',
    transcodingOptions: [
      VIDEO_PROFILES.P144p30fps16x9,
      VIDEO_PROFILES.P240p30fps16x9,
    ],
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  },
  {
    id: '2',
    streamId: 'baz',
    transcodingOptions: [
      VIDEO_PROFILES.P360p30fps16x9,
      VIDEO_PROFILES.P720p30fps4x3,
      VIDEO_PROFILES.P576p30fps16x9,
    ],
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  },
  {
    id: '3',
    streamId: 'baz',
    transcodingOptions: [],
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  },
]

const ALL_ROUNDS = {
  100: {
    id: '100',
    initialized: false,
    lastInitializedRound: '99',
    length: '50',
    startBlock: '12345',
  },
}

const ALL_TRANSCODERS = {
  [EMPTY_ADDRESS.replace(/00/g, '11')]: {
    active: false,
    address: EMPTY_ADDRESS.replace(/00/g, '11'),
    blockRewardCut: '0',
    feeShare: '0',
    lastRewardRound: '0',
    pricePerSegment: '0',
    pendingRewardCut: '0',
    pendingFeeShare: '0',
    pendingPricePerSegment: '0',
    rewardCut: '0',
    status: TRANSCODER_STATUS.NotRegistered,
    totalStake: '0',
  },
  [EMPTY_ADDRESS.replace(/00/g, '22')]: {
    active: true,
    address: EMPTY_ADDRESS.replace(/00/g, '22'),
    blockRewardCut: '0',
    feeShare: '0',
    lastRewardRound: '0',
    pricePerSegment: '0',
    pendingRewardCut: '0',
    pendingFeeShare: '0',
    pendingPricePerSegment: '0',
    rewardCut: '0',
    status: TRANSCODER_STATUS.Registered,
    totalStake: '0',
  },
}

const PROTOCOL = {
  paused: false,
  totalTokenSupply: '0',
  totalBondedToken: '0',
  targetBondingRate: '0',
  transcoderPoolMaxSize: '0',
}

export default livepeer
