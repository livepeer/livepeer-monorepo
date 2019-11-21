export interface Account {
  id: string
  tokenBalance: string
  ethBalance: string
  allowance: string
}

export interface Transcoder {
  id: string
  active?: boolean
  status?: string
  lastRewardRound?: Round
  rewardCut?: string
  feeShare?: string
  pricePerSegment?: string
  pendingRewardCut?: string
  pendingFeeShare?: string
  pendingPricePerSegment?: string
  totalStake?: string
  accruedFees?: string
  pools?: [Pool]
  delegators?: [Delegator]
  delegator?: Delegator
}

export interface Delegator {
  id: string
  delegate?: Transcoder
  startRound?: number
  lastClaimRound?: Round
  bondedAmount?: string
  pendingStake?: string
  status?: string
  fees?: string
  delegatedAmount?: string
  allowance?: string
  unbondingLocks?: [UnbondingLock]
}

export interface ThreeBoxSpace {
  name: string
  url: string
  description: string
}

export interface Round {
  id: string
  initialized?: boolean
  length?: string
  timestamp?: string
  lastInitializedRound?: Round
  startBlock?: string
  pools?: [Pool]
  mintableTokens?: string
}

export interface Pool {
  id: string
  round?: Round
  transcoder?: Transcoder
  fees?: string
  rewardTokens?: string
  totalStake?: string
  rewardCut?: string
  feeShare?: string
}

export interface UnbondingLock {
  id: string
  unbondingLockId?: number
  withdrawRound?: number
  delegator?: Delegator
  delegate?: Transcoder
  amount?: string
  withdrawRound?: number
}

export interface Protocol {
  totalTokenSupply?: string
  totalBondedToken?: string
  paused?: boolean
  targetBondingRate?: string
  transcoderPoolMaxSize?: string
  maxEarningsClaimsRounds?: string
}

export interface Transaction {
  id: string
  hash?: string
  blockNumber?: string
  timestamp?: string
  to?: string
  from?: string
  gasUsed?: string
  gasPrice?: string
}
