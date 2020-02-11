import { Address, BigInt, dataSource } from '@graphprotocol/graph-ts'

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
  Reward,
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
  WithdrawFeesEvent,
} from '../types/schema'

import { makePoolId, getRoundsManagerInstance } from './util'

// Handler for TranscoderUpdate events
export function transcoderUpdated(event: TranscoderUpdate): void {
  let transcoderAddress = event.params.transcoder
  let bondingManager = BondingManager.bind(event.address)
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let transcoder = Transcoder.load(transcoderAddress.toHex())

  // Create transcoder if it does not yet exist
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex())
  }

  let active = bondingManager.isActiveTranscoder(
    transcoderAddress,
    currentRound,
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
    event.transaction.hash.toHex() + '-TranscoderUpdate',
  )
  transcoderUpdatedEvent.hash = event.transaction.hash.toHex()
  transcoderUpdatedEvent.blockNumber = event.block.number
  transcoderUpdatedEvent.gasUsed = event.transaction.gasUsed
  transcoderUpdatedEvent.gasPrice = event.transaction.gasPrice
  transcoderUpdatedEvent.timestamp = event.block.timestamp
  transcoderUpdatedEvent.from = event.transaction.from.toHex()
  transcoderUpdatedEvent.to = event.transaction.to.toHex()
  transcoderUpdatedEvent.round = currentRound.toString()
  transcoderUpdatedEvent.delegate = transcoderAddress.toHex()
  transcoderUpdatedEvent.rewardCut = pendingRewardCut
  transcoderUpdatedEvent.feeShare = pendingFeeShare
  transcoderUpdatedEvent.save()
}

// Handler for TranscoderResigned events
export function transcoderResigned(event: TranscoderResigned): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()

  // Update transcoder
  transcoder.active = false
  transcoder.status = 'NotRegistered'
  transcoder.delegator = null

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderResignedEvent = new TranscoderResignedEvent(
    event.transaction.hash.toHex() + '-TranscoderResigned',
  )
  transcoderResignedEvent.hash = event.transaction.hash.toHex()
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
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()

  // Update transcoder
  transcoder.active = false

  // Apply store updates
  transcoder.save()

  let transcoderEvictedEvent = new TranscoderEvictedEvent(
    event.transaction.hash.toHex() + '-TranscoderEvicted',
  )
  transcoderEvictedEvent.hash = event.transaction.hash.toHex()
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
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let delegateData = bondingManager.getDelegator(transcoderAddress)

  // Update transcoder total stake
  transcoder.totalStake = delegateData.value3

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderSlashedEvent = new TranscoderSlashedEvent(
    event.transaction.hash.toHex() + '-TranscoderSlashed',
  )

  transcoderSlashedEvent.hash = event.transaction.hash.toHex()
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
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let delegateData = bondingManager.getDelegator(newDelegateAddress)

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

  // If self delegating, set status and assign reference to self
  if (delegatorAddress.toHex() == newDelegateAddress.toHex()) {
    transcoder.status = 'Registered'
    transcoder.delegator = delegatorAddress.toHex()
  }

  // Changing delegate
  if (
    delegator.delegate != null &&
    delegator.delegate != newDelegateAddress.toHex()
  ) {
    let oldTranscoder = Transcoder.load(delegator.delegate) as Transcoder
    let oldDelegate = Delegator.load(delegator.delegate) as Delegator

    // if previous delegate was itself, set status and unassign reference to self
    if (delegator.delegate == delegatorAddress.toHex()) {
      oldTranscoder.status = 'NotRegistered'
      oldTranscoder.delegator = null
    }

    let delegateData = bondingManager.getDelegator(
      Address.fromString(oldTranscoder.id),
    )

    oldTranscoder.totalStake = delegateData.value3
    oldDelegate.delegatedAmount = delegateData.value3

    oldDelegate.save()
    oldTranscoder.save()
  }

  transcoder.totalStake = delegateData.value3
  delegate.delegatedAmount = delegateData.value3

  // additional amount == new bondedAmount minus previous bonded amount
  let additionalAmount = delegatorData.value0.minus(
    delegator.bondedAmount as BigInt,
  )

  // no existing delegate && has bondedAmount == rebonding
  // Subtract bondedAmount from unbonded
  if (!delegator.delegate && delegator.bondedAmount.gt(BigInt.fromI32(0))) {
    delegator.unbonded = delegator.unbonded.minus(
      delegator.bondedAmount as BigInt,
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
  bondEvent.hash = event.transaction.hash.toHex()
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
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()

  let transcoder = Transcoder.load(transcoderAddress)
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress)
  }

  let delegate = Delegator.load(transcoderAddress)
  if (delegate == null) {
    delegate = new Delegator(transcoderAddress)
  }

  let delegateData = bondingManager.getDelegator(
    Address.fromString(transcoderAddress),
  )

  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  transcoder.totalStake = delegateData.value3
  delegate.delegatedAmount = delegateData.value3

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
  unbondEvent.hash = event.transaction.hash.toHex()
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
  let delegateData = bondingManager.getDelegator(transcoderAddress)
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let poolId = makePoolId(transcoderAddress, currentRound)
  let pool = Pool.load(poolId)

  delegate.delegatedAmount = delegateData.value3

  pool.rewardTokens = event.params.amount
  pool.feeShare = transcoder.feeShare
  pool.rewardCut = transcoder.rewardCut

  transcoder.totalStake = delegateData.value3
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
  // The Streamflow release introduced an event emitter for EarningsClaimed, so
  // we can ignore this call handler henceforth after the block in which the
  // protocol was paused prior to the streamflow upgrade
  if (call.block.number.le(BigInt.fromI32(9274414))) {
    let claimEarningsEventID = call.transaction.hash.toHex() + '-ClaimEarnings'
    let claimEarningsEvent = ClaimEarningsEvent.load(claimEarningsEventID)
    let delegatorAddress = call.from
    let endRound = call.inputs._endRound
    let roundsManager = getRoundsManagerInstance(dataSource.network())
    let currentRound = roundsManager.currentRound()
    let delegator = Delegator.load(delegatorAddress.toHex())
    let bondingManager = BondingManager.bind(call.to)
    let delegatorData = bondingManager.getDelegator(delegatorAddress)
    let bondedAmount = delegator.bondedAmount
    let lastClaimRound = delegator.lastClaimRound

    delegator.bondedAmount = delegatorData.value0
    delegator.fees = delegatorData.value1
    delegator.lastClaimRound = endRound.toString()
    delegator.save()

    claimEarningsEvent = new ClaimEarningsEvent(
      call.transaction.hash.toHex() + '-ClaimEarnings',
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
    claimEarningsEvent.startRound = lastClaimRound.toString()
    claimEarningsEvent.endRound = endRound.toString()
    claimEarningsEvent.rewardTokens = delegatorData.value0.minus(
      bondedAmount as BigInt,
    )
    claimEarningsEvent.fees = delegatorData.value1.minus(
      delegator.fees as BigInt,
    )
    claimEarningsEvent.save()
  }
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()

  // Store transaction info
  let withdrawStakeEvent = new WithdrawStakeEvent(
    event.transaction.hash.toHex() + '-WithdrawStake',
  )
  withdrawStakeEvent.hash = event.transaction.hash.toHex()
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
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let withdrawnFees = delegator.fees as BigInt

  // Store transaction info
  let withdrawFeesTransaction = new WithdrawFeesEvent(
    event.transaction.hash.toHex() + '-WithdrawFeesEvent',
  )
  withdrawFeesTransaction.hash = event.transaction.hash.toHex()
  withdrawFeesTransaction.blockNumber = event.block.number
  withdrawFeesTransaction.gasUsed = event.transaction.gasUsed
  withdrawFeesTransaction.gasPrice = event.transaction.gasPrice
  withdrawFeesTransaction.timestamp = event.block.timestamp
  withdrawFeesTransaction.from = event.transaction.from.toHex()
  withdrawFeesTransaction.to = event.transaction.to.toHex()
  withdrawFeesTransaction.round = currentRound.toString()
  withdrawFeesTransaction.amount = withdrawnFees
  withdrawFeesTransaction.delegator = delegatorAddress.toHex()
  withdrawFeesTransaction.save()

  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.withdrawnFees = delegator.withdrawnFees.plus(withdrawnFees)
  delegator.lastClaimRound = currentRound.toString()
  delegator.save()
}
