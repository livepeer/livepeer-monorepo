export function transformJob({
  id,
  streamId,
  transcodingOptions,
  broadcaster,
}) {
  return {
    type: 'JobType',
    id,
    broadcaster,
    profiles: transcodingOptions.map(({ hash, ...profile }) => ({
      id: hash,
      ...profile,
    })),
    streamId: streamId,
  }
}

export const mockAccount = ({ id = '', ...account } = {}) => ({
  id,
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
