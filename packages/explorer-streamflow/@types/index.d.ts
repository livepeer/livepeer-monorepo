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
}

export interface Delegator {
  id: string
  delegate?: Transcoder
  startRound?: Round
  lastClaimRound?: Round
  bondedAmount?: string
  pendingStake?: string
  fees?: string
  delegatedAmount?: string
  allowance?: string
  unbondingLocks?: [UnbondingLock]
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

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.gif'
// declare module 'theme-ui'
// declare module 'qrcode.react'
// declare module 'web3-utils'
