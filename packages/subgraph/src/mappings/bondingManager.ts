import { Address, BigInt } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  Bond,
  Unbond,
  ClaimEarningsCall,
  WithdrawStake,
  TranscoderUpdate,
  TranscoderResigned,
  TranscoderEvicted,
  TranscoderSlashed,
  WithdrawFees,
  Reward as RewardEvent // alias Reward event to avoid name collision with entity type
} from '../types/BondingManager/BondingManager'

// Import entity types generated from the GraphQL schema
import { Transcoder, Delegator, Pool } from '../types/schema'
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
}

// Handler for TranscoderResigned events
export function transcoderResigned(event: TranscoderResigned): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())

  // Update transcoder
  transcoder.active = false
  transcoder.status = 'NotRegistered'

  // Apply store updates
  transcoder.save()
}

// Handler for TranscoderEvicted events
export function transcoderEvicted(event: TranscoderEvicted): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())

  // Update transcoder
  transcoder.active = false
  transcoder.status = 'NotRegistered'

  // Apply store updates
  transcoder.save()
}

// Handler for TranscoderSlashed events
export function transcoderSlashed(event: TranscoderSlashed): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let bondingManager = BondingManager.bind(event.address)
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress)

  // Update transcoder total stake
  transcoder.totalStake = totalStake

  // Apply store updates
  transcoder.save()
}

export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address)
  let transcoderAddress = event.params.delegate
  let delegatorAddress = event.params.delegator
  let transcoderTotalStake = bondingManager.transcoderTotalStake(
    transcoderAddress
  )
  let currentRound = roundsManager.currentRound()

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex())
  }

  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.lastClaimRound = currentRound.toString()

  // Create transcoder if it does not yet exist
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex())
  }

  // Create delegate if it does not yet exist
  let delegate = Delegator.load(transcoderAddress.toHex())
  if (delegate == null) {
    delegate = new Delegator(transcoderAddress.toHex())
  }

  // Get delegate data
  let delegateData = bondingManager.getDelegator(transcoderAddress)

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3

  if (transcoder.delegators == null) {
    transcoder.delegators = new Array<string>()
  }

  // Add delegator to delegate if it's not already
  let delegators = transcoder.delegators
  let i = delegators.indexOf(delegatorAddress.toHex())
  if (i == -1) {
    delegators.push(delegatorAddress.toHex())
    transcoder.delegators = delegators
  }

  // Update delegate's total stake
  transcoder.totalStake = transcoderTotalStake

  delegator.delegate = transcoderAddress.toHex()

  // Update delegator's start round
  delegator.startRound = currentRound.plus(BigInt.fromI32(1)).toString()

  delegate.save()
  delegator.save()
  transcoder.save()
}

export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
  let currentRound = roundsManager.currentRound()

  // delegate is not emitted in the deprecated event so grab it from delegator
  let transcoderAddress = Address.fromString(delegator.delegate)

  let transcoder = Transcoder.load(transcoderAddress.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex())
  }

  let delegate = Delegator.load(transcoderAddress.toHex())
  if (delegate == null) {
    delegate = new Delegator(transcoderAddress.toHex())
  }

  // Get delegate data
  let delegateData = bondingManager.getDelegator(transcoderAddress)

  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress)

  // Get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.lastClaimRound = currentRound.toString()

  // Update delegate's total stake
  transcoder.totalStake = totalStake

  // Remove delegator from delegate
  let delegators = transcoder.delegators
  if (delegators != null) {
    let i = delegators.indexOf(delegatorAddress.toHex())
    delegators.splice(i, 1)
    transcoder.delegators = delegators
  }

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3

  // Remote delegate from delegator
  delegator.delegate = null

  // Update delegator's start round
  delegator.startRound = delegatorData.value4.toString()

  // Apply store updates
  delegate.save()
  delegator.save()
  transcoder.save()
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
}

export function claimEarnings(call: ClaimEarningsCall): void {
  let delegatorAddress = call.transaction.from
  let endRound = call.inputs._endRound
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
  let bondingManager = BondingManager.bind(call.to)
  let delegatorData = bondingManager.getDelegator(
    Address.fromString(delegator.id)
  )

  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.lastClaimRound = endRound.toString()
  delegator.save()
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  delegator.bondedAmount = BigInt.fromI32(0)
  delegator.save()
}

export function withdrawFees(event: WithdrawFees): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.lastClaimRound = currentRound.toString()
  delegator.save()
}

export function updateDelegatorWithEarnings(
  delegator: Delegator,
  endRound: BigInt,
  bondedAmount: BigInt,
  fees: BigInt
): void {
  delegator.bondedAmount = bondedAmount
  delegator.fees = fees
  delegator.lastClaimRound = endRound.toString()
  delegator.save()
}
