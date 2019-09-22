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
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

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
    let oldTranscoder = Transcoder.load(delegator.delegate)
    let oldDelegate = Delegator.load(delegator.delegate)

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
  let delegator = Delegator.load(delegatorAddress.toHex())
  let bondingManager = BondingManager.bind(call.to)
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

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
  let delegator = Delegator.load(delegatorAddress.toHex())
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.lastClaimRound = currentRound.toString()
  delegator.save()
}
