import { GraphQLSchema } from 'graphql'
export { default as schema } from './schema'
export const introspectionQueryResultData = {
  __schema: {
    types: [
      {
        kind: 'INTERFACE',
        name: 'Account',
        possibleTypes: [
          {
            name: 'AccountType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Broadcaster',
        possibleTypes: [
          {
            name: 'BroadcasterType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Delegator',
        possibleTypes: [
          {
            name: 'DelegatorType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Transcoder',
        possibleTypes: [
          {
            name: 'TranscoderType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Job',
        possibleTypes: [
          {
            name: 'JobType',
          },
        ],
      },
    ],
  },
}

export const mockAccount = ({ id = '', ...account } = {}) => ({
  id,
  ensName: '',
  ethBalance: '0',
  tokenBalance: '0',
  ...account,
  broadcaster: mockBroadcaster({
    id,
    ...account.broadcaster,
  }),
  delegator: mockDelegator({
    id,
    ...account.delegator,
  }),
  transcoder: mockTranscoder({
    id,
    ...account.transcoder,
  }),
})

export const mockBroadcaster = ({ id = '', ...broadcaster } = {}) => ({
  deposit: '0',
  id,
  jobs: [],
  withdrawBlock: '0',
  ...broadcaster,
})

export const mockDelegator = ({ id = '', ...delegator } = {}) => ({
  allowance: '0',
  bondedAmount: '0',
  id,
  delegateAddress: '',
  delegatedAmount: '0',
  fees: '0',
  lastClaimRound: '0',
  pendingFees: '0',
  pendingStake: '0',
  startRound: '0',
  status: 'Unbonded',
  withdrawRound: '0',
  ...delegator,
})

export const mockRound = ({ id = '', ...round } = {}) => ({
  id,
  initialized: false,
  lastInitializedRound: '0',
  length: '0',
  startBlock: '0',
  ...round,
})

export const mockProtocol = ({ id = '', ...protocol } = {}) => ({
  paused: false,
  ...protocol,
})

export const mockTranscoder = ({ id = '', ...transcoder } = {}) => ({
  active: false,
  feeShare: '0',
  id,
  lastRewardRound: '0',
  pricePerSegment: '0',
  pendingRewardCut: '0',
  pendingFeeShare: '0',
  pendingPricePerSegment: '0',
  rewardCut: '0',
  status: '',
  totalStake: '0',
  ...transcoder,
})
