import { Address, BigInt, log } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import { DistributeFees } from '../types/JobsManager/JobsManager'

import { RoundsManager } from '../types/RoundsManager/RoundsManager'

// Import entity types generated from the GraphQL schema
import { Transcoder, Delegator, Pool, Share } from '../types/schema'

import { makePoolId, makeShareId } from './util'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
)

export function distributeFees(event: DistributeFees): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let currentRound = roundsManager.currentRound()
  let delegatorAddress: Address
  let delegator: Delegator
  let share: Share
  let delegators: Array<string> = transcoder.delegators as Array<string>
  let poolId = makePoolId(transcoderAddress, currentRound)
  let pool = Pool.load(poolId)
  let shareId: string
  let delegatorTotalStake: BigInt
  let delegatorTotalFees: BigInt
  let delegatorFeeShare: BigInt
  let delegatorEquity: BigInt
  let delegatorEquityPercentage: BigInt
  let feeSharePercent = transcoder.feeShare.gt(BigInt.fromI32(0))
    ? transcoder.feeShare.div(BigInt.fromI32(1000000))
    : (transcoder.feeShare as BigInt)
  let fees = event.params.fees
  let feeShare = fees.times(feeSharePercent)
  let transcoderFees = fees.minus(feeShare)

  // Update each delegator's earned fees
  for (let i = 0; i < delegators.length; i++) {
    delegatorAddress = Address.fromString(delegators[i])
    delegator = Delegator.load(delegators[i]) as Delegator

    // no rewards for delegator if it claimed earnings before transcoder
    // called reward
    if (parseInt(delegator.lastClaimRound, 10) >= currentRound.toI32()) {
      continue
    }

    delegatorTotalStake = BigInt.compare(
      delegator.bondedAmount as BigInt,
      delegator.pendingStake as BigInt
    )
      ? (delegator.bondedAmount as BigInt)
      : (delegator.pendingStake as BigInt)

    delegatorTotalFees = BigInt.compare(
      delegator.fees as BigInt,
      delegator.pendingFees as BigInt
    )
      ? (delegator.fees as BigInt)
      : (delegator.pendingFees as BigInt)

    delegatorEquity = delegatorTotalStake.div(transcoder.totalStake as BigInt)
    delegatorEquityPercentage = delegatorEquity.div(BigInt.fromI32(1000000))
    delegatorFeeShare = feeShare.times(delegatorEquityPercentage)

    shareId = makeShareId(delegatorAddress, currentRound)
    share = Share.load(shareId) as Share
    if (share == null) {
      share = new Share(shareId)
    }
    share.fees = delegatorFeeShare
    share.round = currentRound.toString()
    share.delegator = delegatorAddress.toHex()
    share.save()

    if (transcoderAddress == delegatorAddress) {
      delegator.pendingFees = delegatorTotalFees
        .plus(delegatorFeeShare)
        .plus(transcoderFees)
    } else {
      delegator.pendingFees = delegatorTotalFees.plus(delegatorFeeShare)
    }

    delegator.save()
  }

  // Update pool fees
  pool.fees = pool.fees.plus(event.params.fees)

  // Update transcoder's accrued fees
  transcoder.accruedFees = transcoder.accruedFees.plus(event.params.fees)

  // Apply store updates
  pool.save()
  transcoder.save()
}
