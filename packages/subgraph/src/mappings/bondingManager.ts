import { Address, BigInt } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  ClaimEarningsCall,
  Bond,
  Unbond,
  WithdrawStake,
  TranscoderUpdate,
  TranscoderResigned,
  TranscoderEvicted,
  TranscoderSlashed,
  WithdrawFees,
  Reward as RewardEvent // alias Reward event to avoid name collision with entity type
} from '../types/BondingManager/BondingManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Delegator,
  Pool,
  TranscoderUpdatedTransaction,
  TranscoderResignedTransaction,
  TranscoderEvictedTransaction,
  TranscoderSlashedTransaction,
  BondTransaction,
  UnbondTransaction,
  RewardTransaction,
  ClaimEarningsTransaction,
  WithdrawStakeTransaction,
  WithdrawFeesTransaction
} from '../types/schema'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'

import { makePoolId } from './util'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
)

// Handler for TranscoderUpdate events
export function transcoderUpdated(event: TranscoderUpdate): void {
  let transcoderAddress = event.params.transcoder
  let bondingManager = BondingManager.bind(event.address)
  let currentRound = roundsManager.currentRound()

  let transcoder = Transcoder.load(transcoderAddress.toHex())

  // Create transcoder if it does not yet exist
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex())
  }

  let active = bondingManager.isActiveTranscoder(
    transcoderAddress,
    currentRound
  )
  let registered = event.params.registered
  let pendingRewardCut = event.params.pendingRewardCut
  let pendingFeeShare = event.params.pendingFeeShare
  let pendingPricePerSegment = event.params.pendingPricePerSegment

  // Update transcoder
  transcoder.pendingRewardCut = pendingRewardCut
  transcoder.pendingFeeShare = pendingFeeShare
  transcoder.pendingPricePerSegment = pendingPricePerSegment
  transcoder.active = active
  transcoder.status = registered ? 'Registered' : 'NotRegistered'

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderUpdatedTransaction = new TranscoderUpdatedTransaction(
    event.transaction.hash.toHex()
  )
  transcoderUpdatedTransaction.blockNumber = event.block.number
  transcoderUpdatedTransaction.gasUsed = event.transaction.gasUsed
  transcoderUpdatedTransaction.gasPrice = event.transaction.gasPrice
  transcoderUpdatedTransaction.timestamp = event.block.timestamp
  transcoderUpdatedTransaction.from = event.transaction.from.toHex()
  transcoderUpdatedTransaction.to = event.transaction.to.toHex()
  transcoderUpdatedTransaction.round = currentRound.toString()
  transcoderUpdatedTransaction.delegate = transcoderAddress.toHex()
  transcoderUpdatedTransaction.pendingRewardCut = pendingRewardCut
  transcoderUpdatedTransaction.pendingFeeShare = pendingFeeShare
  transcoderUpdatedTransaction.registered = registered
  transcoderUpdatedTransaction.save()
}

// Handler for TranscoderResigned events
export function transcoderResigned(event: TranscoderResigned): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let currentRound = roundsManager.currentRound()

  // Update transcoder
  transcoder.active = false
  transcoder.status = 'NotRegistered'

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderResignedTransaction = new TranscoderResignedTransaction(
    event.transaction.hash.toHex()
  )
  transcoderResignedTransaction.blockNumber = event.block.number
  transcoderResignedTransaction.gasUsed = event.transaction.gasUsed
  transcoderResignedTransaction.gasPrice = event.transaction.gasPrice
  transcoderResignedTransaction.timestamp = event.block.timestamp
  transcoderResignedTransaction.from = event.transaction.from.toHex()
  transcoderResignedTransaction.to = event.transaction.to.toHex()
  transcoderResignedTransaction.round = currentRound.toString()
  transcoderResignedTransaction.delegate = transcoderAddress.toHex()
  transcoderResignedTransaction.save()
}

// Handler for TranscoderEvicted events
export function transcoderEvicted(event: TranscoderEvicted): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let currentRound = roundsManager.currentRound()

  // Update transcoder
  transcoder.active = false
  transcoder.status = 'NotRegistered'

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderEvictedTransaction = new TranscoderEvictedTransaction(
    event.transaction.hash.toHex()
  )

  transcoderEvictedTransaction.blockNumber = event.block.number
  transcoderEvictedTransaction.gasUsed = event.transaction.gasUsed
  transcoderEvictedTransaction.gasPrice = event.transaction.gasPrice
  transcoderEvictedTransaction.timestamp = event.block.timestamp
  transcoderEvictedTransaction.from = event.transaction.from.toHex()
  transcoderEvictedTransaction.to = event.transaction.to.toHex()
  transcoderEvictedTransaction.round = currentRound.toString()
  transcoderEvictedTransaction.delegate = transcoderAddress.toHex()
  transcoderEvictedTransaction.save()
}

// Handler for TranscoderSlashed events
export function transcoderSlashed(event: TranscoderSlashed): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let bondingManager = BondingManager.bind(event.address)
  let currentRound = roundsManager.currentRound()
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress)

  // Update transcoder total stake
  transcoder.totalStake = totalStake

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderSlashedTransaction = new TranscoderSlashedTransaction(
    event.transaction.hash.toHex()
  )

  transcoderSlashedTransaction.blockNumber = event.block.number
  transcoderSlashedTransaction.gasUsed = event.transaction.gasUsed
  transcoderSlashedTransaction.gasPrice = event.transaction.gasPrice
  transcoderSlashedTransaction.timestamp = event.block.timestamp
  transcoderSlashedTransaction.from = event.transaction.from.toHex()
  transcoderSlashedTransaction.to = event.transaction.to.toHex()
  transcoderSlashedTransaction.round = currentRound.toString()
  transcoderSlashedTransaction.delegate = transcoderAddress.toHex()
  transcoderSlashedTransaction.save()
}

export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address)
  let transcoderAddress = event.params.delegate
  let delegatorAddress = event.params.delegator
  let EMPTY_ADDRESS = Address.fromString(
    '0000000000000000000000000000000000000000'
  )
  let transcoderTotalStake = bondingManager.transcoderTotalStake(
    transcoderAddress
  )
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  // Deprecated event always emits an empty old transcoder / delegate address
  let oldTranscoder = new Transcoder(EMPTY_ADDRESS.toHex())
  let oldDelegate = new Delegator(EMPTY_ADDRESS.toHex())

  let transcoder = Transcoder.load(transcoderAddress.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex())
  }

  let delegate = Delegator.load(transcoderAddress.toHex())
  if (delegate == null) {
    delegate = new Delegator(transcoderAddress.toHex())
  }

  let delegator = Delegator.load(delegatorAddress.toHex())
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex())
  }

  if (transcoder.delegators == null) {
    transcoder.delegators = new Array<string>()
  }

  // Update delegator's start round if in an unbonded state
  if (delegator.bondedAmount.equals(BigInt.fromI32(0))) {
    delegator.startRound = currentRound.plus(BigInt.fromI32(1)).toString()
  }

  // Changing delegate
  if (
    delegator.delegate != null &&
    delegator.delegate != transcoderAddress.toHex()
  ) {
    oldTranscoder = Transcoder.load(delegator.delegate) as Transcoder
    oldDelegate = Delegator.load(delegator.delegate) as Delegator

    let oldTranscoderTotalStake = bondingManager.transcoderTotalStake(
      Address.fromString(oldTranscoder.id)
    )

    oldTranscoder.totalStake = oldTranscoderTotalStake
    oldDelegate.delegatedAmount = oldTranscoderTotalStake

    // remove from old transcoder's array of delegators
    let oldTranscoderDelegators = oldTranscoder.delegators
    if (oldTranscoderDelegators != null) {
      let i = oldTranscoderDelegators.indexOf(delegatorAddress.toHex())
      oldTranscoderDelegators.splice(i, 1)
      oldTranscoder.delegators = oldTranscoderDelegators
    }

    oldDelegate.save()
    oldTranscoder.save()

    delegator.startRound = currentRound.plus(BigInt.fromI32(1)).toString()
  }

  // Update transcoder / delegate
  let delegators = transcoder.delegators
  let i = delegators.indexOf(delegatorAddress.toHex())
  if (i == -1) {
    delegators.push(delegatorAddress.toHex())
    transcoder.delegators = delegators
  }
  transcoder.totalStake = transcoderTotalStake
  delegate.delegatedAmount = transcoderTotalStake

  // additional amount == new bondedAmount minus previous bonded amount
  let additionalAmount = delegatorData.value0.minus(
    delegator.bondedAmount as BigInt
  )

  // no existing delegate && has bondedAmount == rebonding
  // Subtract bondedAmount from unbonded
  if (!delegator.delegate && delegator.bondedAmount.gt(BigInt.fromI32(0))) {
    delegator.unbonded = delegator.unbonded.minus(
      delegator.bondedAmount as BigInt
    )
  }

  delegator.delegate = transcoderAddress.toHex()
  delegator.lastClaimRound = currentRound.toString()
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.principal = delegator.principal.plus(additionalAmount)

  delegate.save()
  delegator.save()
  transcoder.save()

  // Store transaction info
  let bondTransaction = new BondTransaction(event.transaction.hash.toHex())
  bondTransaction.blockNumber = event.block.number
  bondTransaction.gasUsed = event.transaction.gasUsed
  bondTransaction.gasPrice = event.transaction.gasPrice
  bondTransaction.timestamp = event.block.timestamp
  bondTransaction.from = event.transaction.from.toHex()
  bondTransaction.to = event.transaction.to.toHex()
  bondTransaction.round = currentRound.toString()
  bondTransaction.newDelegate = transcoderAddress.toHex()
  bondTransaction.oldDelegate = oldTranscoder.id
  bondTransaction.additionalAmount = additionalAmount
  bondTransaction.save()
}

export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  let transcoderAddress = delegator.delegate
  let currentRound = roundsManager.currentRound()

  let transcoder = Transcoder.load(transcoderAddress)
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress)
  }

  let delegate = Delegator.load(transcoderAddress)
  if (delegate == null) {
    delegate = new Delegator(transcoderAddress)
  }

  let totalStake = bondingManager.transcoderTotalStake(
    Address.fromString(transcoderAddress)
  )

  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  transcoder.totalStake = totalStake
  delegate.delegatedAmount = totalStake

  // Remove delegator from delegate
  let delegators = transcoder.delegators
  if (delegators != null) {
    let i = delegators.indexOf(delegatorAddress.toHex())
    delegators.splice(i, 1)
    transcoder.delegators = delegators
  }

  // Delegator no longer bonded to anyone
  delegator.delegate = null
  delegator.startRound = null
  delegator.lastClaimRound = currentRound.toString()
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.unbonded = delegator.unbonded.plus(delegatorData.value0)

  // Apply store updates
  delegate.save()
  delegator.save()
  transcoder.save()

  // Store transaction info
  let unbondTransaction = new UnbondTransaction(event.transaction.hash.toHex())
  unbondTransaction.blockNumber = event.block.number
  unbondTransaction.gasUsed = event.transaction.gasUsed
  unbondTransaction.gasPrice = event.transaction.gasPrice
  unbondTransaction.timestamp = event.block.timestamp
  unbondTransaction.from = event.transaction.from.toHex()
  unbondTransaction.to = event.transaction.to.toHex()
  unbondTransaction.round = currentRound.toString()
  unbondTransaction.amount = delegatorData.value0
  unbondTransaction.withdrawRound = delegatorData.value5.toI32()
  unbondTransaction.delegate = transcoderAddress
  unbondTransaction.delegator = delegatorAddress.toHex()
  unbondTransaction.save()
}

// Handler for Reward events
export function reward(event: RewardEvent): void {
  let bondingManager = BondingManager.bind(event.address)
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let delegate = Delegator.load(transcoderAddress.toHex())
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress)
  let currentRound = roundsManager.currentRound()
  let delegateData = bondingManager.getDelegator(transcoderAddress)
  let poolId = makePoolId(transcoderAddress, currentRound)
  let pool = Pool.load(poolId)

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3

  // Update reward tokens
  pool.rewardTokens = event.params.amount

  // Update transcoder total stake and last reward round
  transcoder.totalStake = totalStake
  transcoder.lastRewardRound = currentRound.toString()

  transcoder.save()
  delegate.save()
  pool.save()

  let rewardTransaction = new RewardTransaction(event.transaction.hash.toHex())
  rewardTransaction.blockNumber = event.block.number
  rewardTransaction.gasUsed = event.transaction.gasUsed
  rewardTransaction.gasPrice = event.transaction.gasPrice
  rewardTransaction.timestamp = event.block.timestamp
  rewardTransaction.from = event.transaction.from.toHex()
  rewardTransaction.to = event.transaction.to.toHex()
  rewardTransaction.round = currentRound.toString()
  rewardTransaction.rewardTokens = event.params.amount
  rewardTransaction.delegate = transcoderAddress.toHex()
  rewardTransaction.save()
}

export function claimEarnings(call: ClaimEarningsCall): void {
  let delegatorAddress = call.transaction.from
  let endRound = call.inputs._endRound
  let currentRound = roundsManager.currentRound()
  let delegator = Delegator.load(delegatorAddress.toHex())
  let bondingManager = BondingManager.bind(call.to)
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  let claimEarningsTransaction = new ClaimEarningsTransaction(
    call.transaction.hash.toHex()
  )
  claimEarningsTransaction.blockNumber = call.block.number
  claimEarningsTransaction.gasUsed = call.transaction.gasUsed
  claimEarningsTransaction.gasPrice = call.transaction.gasPrice
  claimEarningsTransaction.timestamp = call.block.timestamp
  claimEarningsTransaction.from = call.transaction.from.toHex()
  claimEarningsTransaction.to = call.transaction.to.toHex()
  claimEarningsTransaction.round = currentRound.toString()
  claimEarningsTransaction.delegate = delegator.id
  claimEarningsTransaction.delegator = delegatorAddress.toHex()
  claimEarningsTransaction.startRound = delegator.lastClaimRound
  claimEarningsTransaction.endRound = endRound.toString()
  claimEarningsTransaction.rewardTokens = delegatorData.value0.minus(
    delegator.bondedAmount as BigInt
  )
  claimEarningsTransaction.fees = delegatorData.value1.minus(
    delegator.fees as BigInt
  )
  claimEarningsTransaction.save()

  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.lastClaimRound = endRound.toString()
  delegator.save()
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  let currentRound = roundsManager.currentRound()

  // Store transaction info
  let withdrawStakeTransaction = new WithdrawStakeTransaction(
    event.transaction.hash.toHex()
  )
  withdrawStakeTransaction.blockNumber = event.block.number
  withdrawStakeTransaction.gasUsed = event.transaction.gasUsed
  withdrawStakeTransaction.gasPrice = event.transaction.gasPrice
  withdrawStakeTransaction.timestamp = event.block.timestamp
  withdrawStakeTransaction.from = event.transaction.from.toHex()
  withdrawStakeTransaction.to = event.transaction.to.toHex()
  withdrawStakeTransaction.round = currentRound.toString()
  withdrawStakeTransaction.amount = delegator.bondedAmount
  withdrawStakeTransaction.delegator = delegatorAddress.toHex()
  withdrawStakeTransaction.save()

  delegator.bondedAmount = BigInt.fromI32(0)
  delegator.save()
}

export function withdrawFees(event: WithdrawFees): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  // Store transaction info
  let withdrawFeesTransaction = new WithdrawFeesTransaction(
    event.transaction.hash.toHex()
  )
  withdrawFeesTransaction.blockNumber = event.block.number
  withdrawFeesTransaction.gasUsed = event.transaction.gasUsed
  withdrawFeesTransaction.gasPrice = event.transaction.gasPrice
  withdrawFeesTransaction.timestamp = event.block.timestamp
  withdrawFeesTransaction.from = event.transaction.from.toHex()
  withdrawFeesTransaction.to = event.transaction.to.toHex()
  withdrawFeesTransaction.round = currentRound.toString()
  withdrawFeesTransaction.amount = delegator.fees
  withdrawFeesTransaction.delegator = delegatorAddress.toHex()
  withdrawFeesTransaction.save()

  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.lastClaimRound = currentRound.toString()
  delegator.save()
}
