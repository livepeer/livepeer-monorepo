// Import types and APIs from graph-ts
import { Address, BigInt, store, log } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  TranscoderUpdate,
  TranscoderResigned,
  TranscoderEvicted,
  TranscoderSlashed,
  ClaimEarningsCall,
  WithdrawStake,
  WithdrawFees,
  Bond,
  Unbond,
  Rebond,
  Reward as RewardEvent // alias Reward event to avoid name collision with entity type
} from '../types/BondingManager_LIP11/BondingManager'
import { Controller } from '../types/BondingManager_LIP11/Controller'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Pool,
  Delegator,
  Share,
  UnbondingLock
} from '../types/schema'

import { makePoolId, makeShareId, makeUnbondingLockId } from './util'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
)

// Bind Controller contract
let controller = Controller.bind(
  Address.fromString('f96d54e490317c557a967abfa5d6e33006be69b3')
)

// Deprecated target contracts
let BondingManagerV1 = '0x81eb0b10ff8703905904e4d91cf6aa575d59736f'
let BondingManagerV2 = '0x5a9512826eaaf1fe4190f89443314e95a515fe24'

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

// Handler for Bond events
export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address)
  let newTranscoderAddress = event.params.newDelegate
  let oldTranscoderAddress = event.params.oldDelegate
  let bondedAmount = event.params.bondedAmount
  let delegatorAddress = event.params.delegator
  let currentRound = roundsManager.currentRound()

  // Get old delegate data
  let oldDelegateData = bondingManager.getDelegator(oldTranscoderAddress)

  // Get new delegate data
  let newDelegateData = bondingManager.getDelegator(newTranscoderAddress)

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(delegatorAddress.toHex())
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex())
  }

  // Create new transcoder if it does not yet exist
  let newTranscoder = Transcoder.load(newTranscoderAddress.toHex())
  if (newTranscoder == null) {
    newTranscoder = new Transcoder(newTranscoderAddress.toHex())
  }

  // Create new delegate if it does not yet exist
  let newDelegate = Delegator.load(newTranscoderAddress.toHex())
  if (newDelegate == null) {
    newDelegate = new Delegator(newTranscoderAddress.toHex())
  }

  // Add delegator to transcoder if bonding to it for first time
  if (newTranscoderAddress.toHex() != oldTranscoderAddress.toHex()) {
    // Update old transcoder if delegator is bonding to a new one
    if (
      oldTranscoderAddress.toHex() !=
      '0x0000000000000000000000000000000000000000'
    ) {
      // Remove delegator from old transcoder
      let oldTranscoder = Transcoder.load(oldTranscoderAddress.toHex())
      let oldDelegate = Delegator.load(oldTranscoderAddress.toHex())
      let delegators = oldTranscoder.delegators
      let i = delegators.indexOf(delegatorAddress.toHex())
      delegators.splice(i, 1)
      oldTranscoder.delegators = delegators

      // Update old transcoder's stake
      let oldTranscoderTotalStake = bondingManager.transcoderTotalStake(
        oldTranscoderAddress
      )

      // Update old transcoder's total stake
      oldTranscoder.totalStake = oldTranscoderTotalStake

      // Update old delegate's delegated amount
      oldDelegate.delegatedAmount = oldDelegateData.value3

      oldTranscoder.save()
      oldDelegate.save()
    }

    if (newTranscoder.delegators == null) {
      newTranscoder.delegators = new Array<string>()
    }

    // Add delegator to delegate
    let delegators = newTranscoder.delegators
    let i = delegators.indexOf(delegatorAddress.toHex())
    if (i == -1) {
      delegators.push(delegatorAddress.toHex())
      newTranscoder.delegators = delegators
    }
    delegator.delegate = newTranscoderAddress.toHex()
  }

  // Update new transcoder's total stake
  let newTranscoderTotalStake = bondingManager.transcoderTotalStake(
    newTranscoderAddress
  )

  // Update new transcoder's total stake
  newTranscoder.totalStake = newTranscoderTotalStake

  // Update new delegate's delegated amount
  newDelegate.delegatedAmount = newDelegateData.value3

  // Update delegator's start round
  delegator.startRound = currentRound.plus(BigInt.fromI32(1)).toString()

  // Update delegator's last claim round
  delegator.lastClaimRound = currentRound.toString()

  // Update delegator's bonded amount
  delegator.bondedAmount = bondedAmount

  // Update delegator's fees
  delegator.fees = delegator.pendingFees

  // Update delegator's pending stake
  delegator.pendingStake = BigInt.fromI32(0)

  // Update delegator's pending fees
  delegator.pendingFees = BigInt.fromI32(0)

  // Apply store updates
  newDelegate.save()
  newTranscoder.save()
  delegator.save()
}

// Handler for Unbond events
export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegateAddress = event.params.delegate
  let delegatorAddress = event.params.delegator
  let unbondingLockId = event.params.unbondingLockId
  let uniqueUnbondingLockId = makeUnbondingLockId(
    delegatorAddress,
    unbondingLockId
  )
  let withdrawRound = event.params.withdrawRound
  let amount = event.params.amount
  let delegator = Delegator.load(delegatorAddress.toHex())
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress)
  let currentRound = roundsManager.currentRound()

  let transcoder = Transcoder.load(delegateAddress.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(delegateAddress.toHex())
  }

  let delegate = Delegator.load(delegateAddress.toHex())
  if (delegate == null) {
    delegate = new Delegator(delegateAddress.toHex())
  }

  let unbondingLock = UnbondingLock.load(uniqueUnbondingLockId)
  if (unbondingLock == null) {
    unbondingLock = new UnbondingLock(uniqueUnbondingLockId)
  }

  // get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  // Get delegate data
  let delegateData = bondingManager.getDelegator(delegateAddress)

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3

  // Update transcoder's total stake
  transcoder.totalStake = totalStake

  // Update delegator's last claim round
  delegator.lastClaimRound = currentRound.toString()

  // Update delegator's bonded amount
  delegator.bondedAmount = delegatorData.value0

  // Update delegator's fees
  delegator.fees = delegatorData.value1

  // Update delegator's pending stake
  delegator.pendingStake = BigInt.fromI32(0)

  // Update delegator's pending fees
  delegator.pendingFees = BigInt.fromI32(0)

  // Delegator no longer delegated to anyone if it does not have a bonded amount
  // so remove it from delegate
  if (!delegatorData.value0) {
    let delegators = transcoder.delegators
    if (delegators != null) {
      let i = delegators.indexOf(delegatorAddress.toHex())
      delegators.splice(i, 1)
      transcoder.delegators = delegators
    }

    // Update delegator's delegate
    delegator.delegate = null

    // Update delegator's start round
    delegator.startRound = delegatorData.value4.toString()
  }

  unbondingLock.id = uniqueUnbondingLockId
  unbondingLock.unbondingLockId = unbondingLockId.toI32()
  unbondingLock.delegator = delegateAddress.toHex()
  unbondingLock.withdrawRound = withdrawRound.toHex()
  unbondingLock.amount = amount

  // Apply store updates
  delegate.save()
  transcoder.save()
  unbondingLock.save()
  delegator.save()
}

// Handler for Rebond events
export function rebond(event: Rebond): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegateAddress = event.params.delegate
  let delegatorAddress = event.params.delegator
  let unbondingLockId = event.params.unbondingLockId
  let uniqueUnbondingLockId = makeUnbondingLockId(
    delegatorAddress,
    unbondingLockId
  )
  let transcoder = Transcoder.load(delegateAddress.toHex())
  let delegate = Delegator.load(delegateAddress.toHex())
  let delegator = Delegator.load(delegatorAddress.toHex())
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress)
  let currentRound = roundsManager.currentRound()

  // Get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  // Get delegate data
  let delegateData = bondingManager.getDelegator(delegateAddress)

  // Update delegator's delegate
  delegator.delegate = delegateAddress.toHex()

  // Update delegator's start round
  delegator.startRound = delegatorData.value4.toString()

  // Update delegator's last claim round
  delegator.lastClaimRound = currentRound.toString()

  // Update delegator's bonded amount
  delegator.bondedAmount = delegatorData.value0

  // Update delegator's fees
  delegator.fees = delegatorData.value1

  // Update delegator's pending stake
  delegator.pendingStake = BigInt.fromI32(0)

  // Update delegator's pending fees
  delegator.pendingFees = BigInt.fromI32(0)

  // Update delegate's delegatedAmount
  delegate.delegatedAmount = delegateData.value3

  // Update delegate's total stake
  transcoder.totalStake = totalStake

  // Apply store updates
  delegate.save()
  transcoder.save()
  delegator.save()
  store.remove('UnbondingLock', uniqueUnbondingLockId)
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

  // Recreate unique id from transcoder address and round
  // We use this to keep track of a transcoder's rewards for each round
  let poolId = makePoolId(transcoderAddress, currentRound)

  // Get pool
  let pool = new Pool(poolId)

  // Update transcoder total stake and last reward round
  transcoder.totalStake = totalStake
  transcoder.lastRewardRound = currentRound.toString()

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3

  // Update reward tokens
  pool.rewardTokens = event.params.amount

  let delegatorAddress: Address
  let pendingStakeAsOfNow: BigInt
  let delegator: Delegator
  let share: Share
  let delegators: Array<string> = transcoder.delegators as Array<string>
  let roundsSinceLastClaim: number
  let shareId: string

  // Calculate each delegator's reward tokens for this round
  for (let i = 0; i < delegators.length; i++) {
    delegatorAddress = Address.fromString(delegators[i])
    delegator = Delegator.load(delegators[i]) as Delegator

    if (currentRound.toI32() > parseInt(delegator.lastClaimRound, 10)) {
      let callResult = bondingManager.try_pendingStake(
        delegatorAddress,
        currentRound
      )
      // If this call is reverted it means a delegator claimed its earnings
      // during the same block its delegate called reward and therefore
      // delegator.lastClaimRound is not yet updated in our local state.
      if (callResult.reverted) {
        log.info(
          'pendingStake reverted. A delegator claimed its earnings inside the same block its delegate called reward',
          []
        )
      } else {
        pendingStakeAsOfNow = callResult.value

        shareId = makeShareId(delegatorAddress, currentRound)
        share = Share.load(shareId) as Share
        if (share == null) {
          share = new Share(shareId)
        }

        roundsSinceLastClaim =
          currentRound.toI32() - parseInt(delegator.lastClaimRound, 10)

        if (roundsSinceLastClaim > 1) {
          share.rewardTokens = pendingStakeAsOfNow.minus(
            delegator.pendingStake as BigInt
          )
        } else {
          share.rewardTokens = pendingStakeAsOfNow.minus(
            delegator.bondedAmount as BigInt
          )
        }

        share.round = currentRound.toString()
        share.delegator = delegatorAddress.toHex()
        share.save()

        delegator.pendingStake = pendingStakeAsOfNow
        delegator.save()
      }
    }
  }

  transcoder.save()
  delegate.save()
  pool.save()
}

export function claimEarnings(call: ClaimEarningsCall): void {
  let delegatorAddress = call.transaction.from
  let delegator = Delegator.load(delegatorAddress.toHex())
  let bondingManager = BondingManager.bind(call.to)
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  // Get target contract address
  let targetContract = controller
    .getContract(bondingManager.targetContractId())
    .toHex()

  // Check to see if target contract is deprecated
  let isDeprecated =
    targetContract == BondingManagerV1 || targetContract == BondingManagerV2

  // Account for getDelegator return signature change
  let lastClaimRound = isDeprecated
    ? delegatorData.value6
    : delegatorData.value5

  if (currentRound.toI32() > lastClaimRound.toI32()) {
    delegator.bondedAmount = delegatorData.value0
    delegator.fees = delegatorData.value1
    delegator.pendingStake = bondingManager.pendingStake(
      delegatorAddress,
      currentRound
    )
    delegator.pendingFees = bondingManager.pendingFees(
      delegatorAddress,
      currentRound
    )
  } else {
    delegator.bondedAmount = delegator.pendingStake
    delegator.fees = delegator.pendingFees
    delegator.pendingStake = BigInt.fromI32(0)
    delegator.pendingFees = BigInt.fromI32(0)
  }

  delegator.lastClaimRound = lastClaimRound.toString()
  delegator.save()
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegatorAddress = event.params.delegator
  let unbondingLockId = event.params.unbondingLockId
  let uniqueUnbondingLockId = makeUnbondingLockId(
    delegatorAddress,
    unbondingLockId
  )
  store.remove('UnbondingLock', uniqueUnbondingLockId)
}

export function withdrawFees(event: WithdrawFees): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let currentRound = roundsManager.currentRound()

  delegator.bondedAmount = delegatorData.value0
  delegator.fees = BigInt.fromI32(0)
  delegator.pendingFees = BigInt.fromI32(0)
  delegator.pendingStake = BigInt.fromI32(0)
  delegator.lastClaimRound = currentRound.toString()
  delegator.save()
}
