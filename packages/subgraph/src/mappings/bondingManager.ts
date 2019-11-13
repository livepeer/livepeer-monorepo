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
  Reward
} from '../types/BondingManager/BondingManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Delegator,
  Pool,
  TranscoderUpdatedEvent,
  TranscoderSlashedEvent,
  TranscoderResignedEvent,
  TranscoderEvictedEvent,
  BondEvent,
  UnbondEvent,
  RewardEvent,
  ClaimEarningsEvent,
  WithdrawStakeEvent,
  WithdrawFeesEvent
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
  transcoder.delegator = transcoderAddress.toHex()
  transcoder.pendingRewardCut = pendingRewardCut
  transcoder.pendingFeeShare = pendingFeeShare
  transcoder.pendingPricePerSegment = pendingPricePerSegment
  transcoder.active = active
  transcoder.status = registered ? 'Registered' : 'NotRegistered'

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderUpdatedEvent = new TranscoderUpdatedEvent(
    event.transaction.hash.toHex() + '-TranscoderUpdate'
  )
  transcoderUpdatedEvent.hash = event.block.hash.toHex()
  transcoderUpdatedEvent.blockNumber = event.block.number
  transcoderUpdatedEvent.gasUsed = event.transaction.gasUsed
  transcoderUpdatedEvent.gasPrice = event.transaction.gasPrice
  transcoderUpdatedEvent.timestamp = event.block.timestamp
  transcoderUpdatedEvent.from = event.transaction.from.toHex()
  transcoderUpdatedEvent.to = event.transaction.to.toHex()
  transcoderUpdatedEvent.round = currentRound.toString()
  transcoderUpdatedEvent.delegate = transcoderAddress.toHex()
  transcoderUpdatedEvent.pendingRewardCut = pendingRewardCut
  transcoderUpdatedEvent.pendingFeeShare = pendingFeeShare
  transcoderUpdatedEvent.registered = registered
  transcoderUpdatedEvent.save()
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
  let transcoderResignedEvent = new TranscoderResignedEvent(
    event.transaction.hash.toHex() + '-TranscoderResigned'
  )
  transcoderResignedEvent.hash = event.block.hash.toHex()
  transcoderResignedEvent.blockNumber = event.block.number
  transcoderResignedEvent.gasUsed = event.transaction.gasUsed
  transcoderResignedEvent.gasPrice = event.transaction.gasPrice
  transcoderResignedEvent.timestamp = event.block.timestamp
  transcoderResignedEvent.from = event.transaction.from.toHex()
  transcoderResignedEvent.to = event.transaction.to.toHex()
  transcoderResignedEvent.round = currentRound.toString()
  transcoderResignedEvent.delegate = transcoderAddress.toHex()
  transcoderResignedEvent.save()
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

  let transcoderEvictedEvent = new TranscoderEvictedEvent(
    event.transaction.hash.toHex() + '-TranscoderEvicted'
  )
  transcoderEvictedEvent.hash = event.block.hash.toHex()
  transcoderEvictedEvent.blockNumber = event.block.number
  transcoderEvictedEvent.gasUsed = event.transaction.gasUsed
  transcoderEvictedEvent.gasPrice = event.transaction.gasPrice
  transcoderEvictedEvent.timestamp = event.block.timestamp
  transcoderEvictedEvent.from = event.transaction.from.toHex()
  transcoderEvictedEvent.to = event.transaction.to.toHex()
  transcoderEvictedEvent.round = currentRound.toString()
  transcoderEvictedEvent.delegate = transcoderAddress.toHex()
  transcoderEvictedEvent.save()
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
  let transcoderSlashedEvent = new TranscoderSlashedEvent(
    event.transaction.hash.toHex() + '-TranscoderSlashed'
  )

  transcoderSlashedEvent.hash = event.block.hash.toHex()
  transcoderSlashedEvent.blockNumber = event.block.number
  transcoderSlashedEvent.gasUsed = event.transaction.gasUsed
  transcoderSlashedEvent.gasPrice = event.transaction.gasPrice
  transcoderSlashedEvent.timestamp = event.block.timestamp
  transcoderSlashedEvent.from = event.transaction.from.toHex()
  transcoderSlashedEvent.to = event.transaction.to.toHex()
  transcoderSlashedEvent.round = currentRound.toString()
  transcoderSlashedEvent.delegate = transcoderAddress.toHex()
  transcoderSlashedEvent.save()
}

export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address)
  let newDelegateAddress = event.params.delegate
  let delegatorAddress = event.params.delegator

  let transcoderTotalStake = bondingManager.transcoderTotalStake(
    newDelegateAddress
  )
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  let transcoder = Transcoder.load(newDelegateAddress.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(newDelegateAddress.toHex())
  }

  let delegate = Delegator.load(newDelegateAddress.toHex())
  if (delegate == null) {
    delegate = new Delegator(newDelegateAddress.toHex())
  }

  let delegator = Delegator.load(delegatorAddress.toHex())
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex())
  }

  if (transcoder.delegators == null) {
    transcoder.delegators = new Array<string>()
  }

  // If self delegating, assign reference to self
  if (delegatorAddress.toHex() == newDelegateAddress.toHex()) {
    transcoder.delegator = delegatorAddress.toHex()
  }

  // Changing delegate
  if (
    delegator.delegate != null &&
    delegator.delegate != newDelegateAddress.toHex()
  ) {
    let oldTranscoder = Transcoder.load(delegator.delegate) as Transcoder
    let oldDelegate = Delegator.load(delegator.delegate) as Delegator

    let oldTranscoderTotalStake = bondingManager.transcoderTotalStake(
      Address.fromString(oldTranscoder.id)
    )

    oldTranscoder.totalStake = oldTranscoderTotalStake
    oldDelegate.delegatedAmount = oldTranscoderTotalStake

    // remove from old transcoder's array of delegators
    let oldTranscoderDelegators = oldTranscoder.delegators
    if (oldTranscoderDelegators.length) {
      let i = oldTranscoderDelegators.indexOf(delegatorAddress.toHex())
      oldTranscoderDelegators.splice(i, 1)
      oldTranscoder.delegators = oldTranscoderDelegators
    }

    oldDelegate.save()
    oldTranscoder.save()
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

  delegator.delegate = newDelegateAddress.toHex()
  delegator.lastClaimRound = currentRound.toString()
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.startRound = delegatorData.value4
  delegator.principal = delegator.principal.plus(additionalAmount)

  delegate.save()
  delegator.save()
  transcoder.save()

  // Store transaction info
  let bondEvent = new BondEvent(event.transaction.hash.toHex() + '-Bond')
  bondEvent.hash = event.block.hash.toHex()
  bondEvent.blockNumber = event.block.number
  bondEvent.gasUsed = event.transaction.gasUsed
  bondEvent.gasPrice = event.transaction.gasPrice
  bondEvent.timestamp = event.block.timestamp
  bondEvent.from = event.transaction.from.toHex()
  bondEvent.to = event.transaction.to.toHex()
  bondEvent.round = currentRound.toString()
  bondEvent.newDelegate = newDelegateAddress.toHex()
  bondEvent.additionalAmount = additionalAmount
  bondEvent.save()
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
  delegator.lastClaimRound = currentRound.toString()
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.startRound = delegatorData.value4
  delegator.unbonded = delegator.unbonded.plus(delegatorData.value0)

  // Apply store updates
  delegate.save()
  delegator.save()
  transcoder.save()

  // Store transaction info
  let unbondEvent = new UnbondEvent(event.transaction.hash.toHex() + '-Unbond')
  unbondEvent.hash = event.block.hash.toHex()
  unbondEvent.blockNumber = event.block.number
  unbondEvent.gasUsed = event.transaction.gasUsed
  unbondEvent.gasPrice = event.transaction.gasPrice
  unbondEvent.timestamp = event.block.timestamp
  unbondEvent.from = event.transaction.from.toHex()
  unbondEvent.to = event.transaction.to.toHex()
  unbondEvent.round = currentRound.toString()
  unbondEvent.amount = delegatorData.value0
  unbondEvent.withdrawRound = delegatorData.value5
  unbondEvent.delegate = transcoderAddress
  unbondEvent.delegator = delegatorAddress.toHex()
  unbondEvent.save()
}

// Handler for Reward events
export function reward(event: Reward): void {
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

  let rewardEvent = new RewardEvent(event.transaction.hash.toHex() + '-Reward')
  rewardEvent.hash = event.transaction.hash.toHex()
  rewardEvent.blockNumber = event.block.number
  rewardEvent.gasUsed = event.transaction.gasUsed
  rewardEvent.gasPrice = event.transaction.gasPrice
  rewardEvent.timestamp = event.block.timestamp
  rewardEvent.from = event.transaction.from.toHex()
  rewardEvent.to = event.transaction.to.toHex()
  rewardEvent.round = currentRound.toString()
  rewardEvent.rewardTokens = event.params.amount
  rewardEvent.delegate = transcoderAddress.toHex()
  rewardEvent.save()
}

export function claimEarnings(call: ClaimEarningsCall): void {
  let delegatorAddress = call.transaction.from
  let endRound = call.inputs._endRound
  let currentRound = roundsManager.currentRound()
  let delegator = Delegator.load(delegatorAddress.toHex())
  let bondingManager = BondingManager.bind(call.to)
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  let claimEarningsEvent = new ClaimEarningsEvent(
    call.transaction.hash.toHex() + '-ClaimEarnings'
  )
  claimEarningsEvent.hash = call.transaction.hash.toHex()
  claimEarningsEvent.blockNumber = call.block.number
  claimEarningsEvent.gasUsed = call.transaction.gasUsed
  claimEarningsEvent.gasPrice = call.transaction.gasPrice
  claimEarningsEvent.timestamp = call.block.timestamp
  claimEarningsEvent.from = call.transaction.from.toHex()
  claimEarningsEvent.to = call.transaction.to.toHex()
  claimEarningsEvent.round = currentRound.toString()
  claimEarningsEvent.delegate = delegator.id
  claimEarningsEvent.delegator = delegatorAddress.toHex()
  claimEarningsEvent.startRound = delegator.lastClaimRound.toString()
  claimEarningsEvent.endRound = endRound.toString()
  claimEarningsEvent.rewardTokens = delegatorData.value0.minus(
    delegator.bondedAmount as BigInt
  )
  claimEarningsEvent.fees = delegatorData.value1.minus(delegator.fees as BigInt)
  claimEarningsEvent.save()

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
  let withdrawStakeEvent = new WithdrawStakeEvent(
    event.transaction.hash.toHex() + '-WithdrawStake'
  )
  withdrawStakeEvent.hash = event.block.hash.toHex()
  withdrawStakeEvent.blockNumber = event.block.number
  withdrawStakeEvent.gasUsed = event.transaction.gasUsed
  withdrawStakeEvent.gasPrice = event.transaction.gasPrice
  withdrawStakeEvent.timestamp = event.block.timestamp
  withdrawStakeEvent.from = event.transaction.from.toHex()
  withdrawStakeEvent.to = event.transaction.to.toHex()
  withdrawStakeEvent.round = currentRound.toString()
  withdrawStakeEvent.amount = delegator.bondedAmount
  withdrawStakeEvent.delegator = delegatorAddress.toHex()
  withdrawStakeEvent.save()

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
  let withdrawFeesTransaction = new WithdrawFeesEvent(
    event.transaction.hash.toHex() + '-WithdrawFeesEvent'
  )
  withdrawFeesTransaction.hash = event.block.hash.toHex()
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
