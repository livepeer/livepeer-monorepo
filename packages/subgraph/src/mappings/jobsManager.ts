import { Address, BigInt } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import { DistributeFees } from '../types/JobsManager/JobsManager'

import { RoundsManager } from '../types/RoundsManager/RoundsManager'

// Import entity types generated from the GraphQL schema
import { Transcoder, Delegator, Pool, Share } from '../types/schema'

import { makePoolId, makeShareId, percOf, percOfWithDenom } from './util'

import { getPendingStakeAndFees } from './bondingManager'

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
  let delegatorFeePool: BigInt
  let pendingStakeAndFees: Array<BigInt>
  let fees = event.params.fees

  if (transcoder.feeShare.isZero()) {
    delegatorFeePool = fees
  } else {
    delegatorFeePool = percOf(fees, transcoder.feeShare as BigInt)
  }

  let transcoderFeePool = fees.minus(delegatorFeePool)

  // Update each delegator's earned fees
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

    delegatorTotalFees = BigInt.compare(
      delegator.fees as BigInt,
      pendingStakeAndFees[1] as BigInt
    )
      ? (delegator.fees as BigInt)
      : (pendingStakeAndFees[1] as BigInt)

    delegatorFeeShare = percOfWithDenom(
      delegatorFeePool,
      delegatorTotalStake,
      pool.claimableStake as BigInt
    )

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
        .plus(transcoderFeePool)
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
