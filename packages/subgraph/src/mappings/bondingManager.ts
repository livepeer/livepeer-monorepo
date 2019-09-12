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
import { Transcoder, Delegator, Share, Pool } from '../types/schema'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'

import { makePoolId, makeShareId, percOf, percOfWithDenom } from './util'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
)

// Handler for TranscoderUpdate events
export function transcoderUpdated(event: TranscoderUpdate): void {
  // Bind BondingManager contract
  let bondingManager = BondingManager.bind(event.address)
  let currentRound = roundsManager.currentRound()
  let transcoderAddress = event.params.transcoder
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
  let bondedAmount = delegatorData.value0
  let fees = delegatorData.value1

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

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex())
  }

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

  updateDelegatorWithEarnings(delegator, currentRound, bondedAmount, fees)
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
  let bondedAmount = delegatorData.value0
  let fees = delegatorData.value1

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

  updateDelegatorWithEarnings(delegator, currentRound, bondedAmount, fees)
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
  let rewardTokens = event.params.amount
  let shares = new Array<string>()

  let transcoderRewardPool = transcoder.rewardCut.isZero()
    ? BigInt.fromI32(0)
    : percOf(rewardTokens, transcoder.rewardCut as BigInt)
  let delegatorRewardPool = rewardTokens.minus(transcoderRewardPool)

  // Get pool
  let poolId = makePoolId(transcoderAddress, currentRound)
  let pool = Pool.load(poolId) as Pool
  if (pool == null) {
    pool = new Pool(poolId)
  }

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3

  // Update reward tokens
  pool.rewardTokens = event.params.amount

  let delegatorAddress: Address
  let delegator: Delegator
  let share: Share
  let delegators: Array<string> = transcoder.delegators as Array<string>
  let shareId: string
  let delegatorTotalStake: BigInt
  let delegatorRewardShare: BigInt
  let pendingStakeAndFees: Array<BigInt>

  // Calculate each delegator's reward tokens for this round
  // and update its pending stake
  for (let i = 0; i < delegators.length; i++) {
    delegatorAddress = Address.fromString(delegators[i])
    delegator = Delegator.load(delegators[i]) as Delegator

    // no rewards for delegator if it claimed earnings before transcoder
    // called reward
    if (parseInt(delegator.lastClaimRound, 10) >= currentRound.toI32()) {
      continue
    }

    pendingStakeAndFees = getPendingStakeAndFees(delegator, currentRound)

    delegatorTotalStake = BigInt.compare(
      delegator.bondedAmount as BigInt,
      pendingStakeAndFees[0] as BigInt
    )
      ? (delegator.bondedAmount as BigInt)
      : (pendingStakeAndFees[0] as BigInt)

    delegatorRewardShare = pool.claimableStake.isZero()
      ? BigInt.fromI32(0)
      : percOfWithDenom(
          delegatorRewardPool,
          delegatorTotalStake,
          pool.claimableStake as BigInt
        )

    shareId = makeShareId(delegatorAddress, currentRound)

    share = new Share(shareId)
    share.rewardTokens = delegatorRewardShare
    share.round = currentRound.toString()
    share.delegator = delegatorAddress.toHex()
    share.save()

    if (pool.shares == null) {
      pool.shares = new Array<string>()
    }

    // Add share to pool
    shares = pool.shares as Array<string>
    shares.push(shareId)
    pool.shares = shares

    if (transcoderAddress == delegatorAddress) {
      delegator.pendingStake = delegatorTotalStake
        .plus(delegatorRewardShare)
        .plus(transcoderRewardPool)
    } else {
      delegator.pendingStake = delegatorTotalStake.plus(delegatorRewardShare)
    }

    delegator.save()
  }

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

  let bondedAmount = delegatorData.value0
  let fees = delegatorData.value1
  updateDelegatorWithEarnings(delegator, endRound, bondedAmount, fees)
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  delegator.bondedAmount = BigInt.fromI32(0)
  delegator.save()
}

export function withdrawFees(event: WithdrawFees): void {
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
  let currentRound = roundsManager.currentRound()

  updateDelegatorWithEarnings(
    delegator,
    currentRound,
    delegator.pendingStake as BigInt,
    delegator.pendingFees as BigInt
  )
}

export function updateDelegatorWithEarnings(
  delegator: Delegator,
  endRound: BigInt,
  bondedAmount: BigInt,
  fees: BigInt
): void {
  let delegateAddress = Address.fromString(delegator.delegate)
  let currentRound = roundsManager.currentRound()

  delegator.bondedAmount = bondedAmount
  delegator.fees = fees
  delegator.lastClaimRound = endRound.toString()

  if (endRound.toI32() == currentRound.toI32()) {
    delegator.pendingStake = BigInt.fromI32(0)
    delegator.pendingFees = BigInt.fromI32(0)

    let poolId = makePoolId(delegateAddress, endRound)
    let pool = Pool.load(poolId) as Pool
    if (pool == null) {
      pool = new Pool(poolId)
    }

    // Reduce the pool's claimableStake if delegator claimed before delegate
    // called reward
    if (!pool.rewardTokens) {
      pool.claimableStake = pool.claimableStake.minus(
        delegator.bondedAmount as BigInt
      )
      pool.save()
    }
  }

  delegator.save()
}

export function getPendingStakeAndFees(
  delegator: Delegator,
  endRound: BigInt
): Array<BigInt> {
  let delegateAddress = Address.fromString(delegator.delegate)
  let currentBondedAmount = delegator.bondedAmount as BigInt
  let currentFeesAmount = delegator.fees as BigInt
  let share: Share
  let shareId: string

  for (
    let i = parseInt(delegator.lastClaimRound, 10) + 1;
    i <= endRound.toI32();
    i++
  ) {
    shareId = makeShareId(delegateAddress, BigInt.fromI32(i as i32))
    share = Share.load(shareId) as Share
    currentBondedAmount = currentBondedAmount.plus(share.rewardTokens as BigInt)
    currentFeesAmount = currentFeesAmount.plus(share.fees as BigInt)
  }

  return [currentBondedAmount, currentFeesAmount]
}
