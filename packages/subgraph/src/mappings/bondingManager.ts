import { Address, BigInt } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  ClaimEarningsCall,
  BondCall,
  Unbond as UnbondEvent,
  WithdrawStake as WithdrawStakeEvent,
  TranscoderUpdate as TranscoderUpdateEvent,
  TranscoderResigned as TranscoderResignedEvent,
  TranscoderEvicted as TranscoderEvictedEvent,
  TranscoderSlashed as TranscoderSlashedEvent,
  WithdrawFees as WithdrawFeesEvent,
  ParameterUpdate as ParameterUpdateEvent,
  Reward as RewardEvent,
} from '../types/BondingManager/BondingManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Delegator,
  Pool,
  TranscoderUpdated,
  TranscoderSlashed,
  TranscoderResigned,
  TranscoderEvicted,
  Bond,
  Unbond,
  Reward,
  EarningsClaimed,
  WithdrawStake,
  WithdrawFees,
  ParameterUpdate,
  Round,
  Protocol,
} from '../types/schema'

import { makePoolId, makeEventId } from '../../utils/helpers'

// Handler for TranscoderUpdate events
export function transcoderUpdated(event: TranscoderUpdateEvent): void {
  let transcoderAddress = event.params.transcoder
  let bondingManager = BondingManager.bind(event.address)
  let protocol = Protocol.load('0') || new Protocol('0')
  let transcoder =
    Transcoder.load(transcoderAddress.toHex()) ||
    new Transcoder(transcoderAddress.toHex())

  let active = bondingManager.isActiveTranscoder(
    transcoderAddress,
    BigInt.fromI32(protocol.currentRound as i32),
  )

  // Update transcoder
  transcoder.delegator = transcoderAddress.toHex()
  transcoder.pendingRewardCut = event.params.pendingRewardCut
  transcoder.pendingFeeShare = event.params.pendingFeeShare
  transcoder.pendingPricePerSegment = event.params.pendingPricePerSegment
  transcoder.active = active

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderUpdated = new TranscoderUpdated(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  transcoderUpdated.hash = event.transaction.hash.toHex()
  transcoderUpdated.blockNumber = event.block.number
  transcoderUpdated.gasUsed = event.transaction.gasUsed
  transcoderUpdated.gasPrice = event.transaction.gasPrice
  transcoderUpdated.timestamp = event.block.timestamp
  transcoderUpdated.from = event.transaction.from.toHex()
  transcoderUpdated.to = event.transaction.to.toHex()
  transcoderUpdated.round = protocol.currentRound
  transcoderUpdated.delegate = transcoderAddress.toHex()
  transcoderUpdated.rewardCut = event.params.pendingRewardCut
  transcoderUpdated.feeShare = event.params.pendingFeeShare
  transcoderUpdated.save()
}

// Handler for TranscoderResigned events
export function transcoderResigned(event: TranscoderResignedEvent): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let protocol = Protocol.load('0') || new Protocol('0')

  // Update transcoder
  transcoder.active = false
  transcoder.status = 'NotRegistered'
  transcoder.delegator = null

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderResigned = new TranscoderResigned(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  transcoderResigned.hash = event.transaction.hash.toHex()
  transcoderResigned.blockNumber = event.block.number
  transcoderResigned.gasUsed = event.transaction.gasUsed
  transcoderResigned.gasPrice = event.transaction.gasPrice
  transcoderResigned.timestamp = event.block.timestamp
  transcoderResigned.from = event.transaction.from.toHex()
  transcoderResigned.to = event.transaction.to.toHex()
  transcoderResigned.round = protocol.currentRound
  transcoderResigned.delegate = transcoderAddress.toHex()
  transcoderResigned.save()
}

// Handler for TranscoderEvicted events
export function transcoderEvicted(event: TranscoderEvictedEvent): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let protocol = Protocol.load('0') || new Protocol('0')

  // Update transcoder
  transcoder.active = false

  // Apply store updates
  transcoder.save()

  let transcoderEvicted = new TranscoderEvicted(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  transcoderEvicted.hash = event.transaction.hash.toHex()
  transcoderEvicted.blockNumber = event.block.number
  transcoderEvicted.gasUsed = event.transaction.gasUsed
  transcoderEvicted.gasPrice = event.transaction.gasPrice
  transcoderEvicted.timestamp = event.block.timestamp
  transcoderEvicted.from = event.transaction.from.toHex()
  transcoderEvicted.to = event.transaction.to.toHex()
  transcoderEvicted.round = protocol.currentRound
  transcoderEvicted.delegate = transcoderAddress.toHex()
  transcoderEvicted.save()
}

// Handler for TranscoderSlashed events
export function transcoderSlashed(event: TranscoderSlashedEvent): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let bondingManager = BondingManager.bind(event.address)
  let protocol = Protocol.load('0') || new Protocol('0')
  let delegateData = bondingManager.getDelegator(transcoderAddress)

  // Update transcoder total stake
  transcoder.totalStake = delegateData.value3

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderSlashed = new TranscoderSlashed(
    makeEventId(event.transaction.hash, event.logIndex),
  )

  transcoderSlashed.hash = event.transaction.hash.toHex()
  transcoderSlashed.blockNumber = event.block.number
  transcoderSlashed.gasUsed = event.transaction.gasUsed
  transcoderSlashed.gasPrice = event.transaction.gasPrice
  transcoderSlashed.timestamp = event.block.timestamp
  transcoderSlashed.from = event.transaction.from.toHex()
  transcoderSlashed.to = event.transaction.to.toHex()
  transcoderSlashed.round = protocol.currentRound
  transcoderSlashed.delegate = transcoderAddress.toHex()
  transcoderSlashed.save()
}

export function bond(call: BondCall): void {
  // After LIP11 was deployed (at block 6192000), we no longer have to rely on
  // this call handler to get the amount bonded.
  // https://forum.livepeer.org/t/tributary-release-protocol-upgrade/354
  if (call.block.number.le(BigInt.fromI32(6192000))) {
    let bondingManager = BondingManager.bind(call.to)
    let newDelegateAddress = call.inputs._to
    let delegatorAddress = call.from
    let amount = call.inputs._amount
    let delegatorData = bondingManager.getDelegator(delegatorAddress)
    let delegateData = bondingManager.getDelegator(newDelegateAddress)
    let protocol = Protocol.load('0') || new Protocol('0')
    let round = Round.load(protocol.currentRound)
    let transcoder =
      Transcoder.load(newDelegateAddress.toHex()) ||
      new Transcoder(newDelegateAddress.toHex())
    let delegator =
      Delegator.load(delegatorAddress.toHex()) ||
      new Delegator(delegatorAddress.toHex())
    let delegate =
      Delegator.load(newDelegateAddress.toHex()) ||
      new Delegator(newDelegateAddress.toHex())

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

      // keep track of how much stake moved during this round.
      round.totalMovedStake = round.totalMovedStake.plus(
        delegatorData.value0.minus(amount),
      )

      // keep track of how much new stake was introduced this round
      round.totalNewStake = round.totalNewStake.plus(amount)

      round.save()
    }

    transcoder.totalStake = delegateData.value3
    delegate.delegatedAmount = delegateData.value3

    // delegator rebonding
    if (!delegator.delegate && delegator.bondedAmount.gt(BigInt.fromI32(0))) {
      delegator.unbonded = delegator.unbonded.minus(
        delegator.bondedAmount as BigInt,
      )
    }

    delegator.delegate = newDelegateAddress.toHex()
    delegator.lastClaimRound = protocol.currentRound
    delegator.bondedAmount = delegatorData.value0
    delegator.fees = delegatorData.value1
    delegator.startRound = delegatorData.value4
    delegator.principal = delegator.principal.plus(amount)

    delegate.save()
    delegator.save()
    transcoder.save()
    protocol.save()

    // Store transaction info
    let bond = new Bond(
      makeEventId(call.transaction.hash, call.transaction.index),
    )
    bond.hash = call.transaction.hash.toHex()
    bond.blockNumber = call.block.number
    bond.gasUsed = call.transaction.gasUsed
    bond.gasPrice = call.transaction.gasPrice
    bond.timestamp = call.block.timestamp
    bond.from = call.transaction.from.toHex()
    bond.to = call.transaction.to.toHex()
    bond.round = protocol.currentRound
    bond.newDelegate = newDelegateAddress.toHex()
    bond.bondedAmount = delegatorData.value0
    bond.additionalAmount = amount
    bond.delegator = delegatorAddress.toHex()
    bond.save()
  }
}

export function unbond(event: UnbondEvent): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  let transcoderAddress = delegator.delegate
  let protocol = Protocol.load('0') || new Protocol('0')
  let transcoder =
    Transcoder.load(transcoderAddress) || new Transcoder(transcoderAddress)
  let delegate =
    Delegator.load(transcoderAddress) || new Delegator(transcoderAddress)
  let delegateData = bondingManager.getDelegator(
    Address.fromString(transcoderAddress),
  )
  let delegatorData = bondingManager.getDelegator(delegatorAddress)

  transcoder.totalStake = delegateData.value3
  delegate.delegatedAmount = delegateData.value3

  // Delegator no longer bonded to anyone
  delegator.delegate = null
  delegator.lastClaimRound = protocol.currentRound
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.startRound = delegatorData.value4
  delegator.unbonded = delegator.unbonded.plus(delegatorData.value0)

  // Apply store updates
  delegate.save()
  delegator.save()
  transcoder.save()
  protocol.save()

  // Store transaction info
  let unbond = new Unbond(makeEventId(event.transaction.hash, event.logIndex))
  unbond.hash = event.transaction.hash.toHex()
  unbond.blockNumber = event.block.number
  unbond.gasUsed = event.transaction.gasUsed
  unbond.gasPrice = event.transaction.gasPrice
  unbond.timestamp = event.block.timestamp
  unbond.from = event.transaction.from.toHex()
  unbond.to = event.transaction.to.toHex()
  unbond.round = protocol.currentRound
  unbond.amount = delegatorData.value0
  unbond.withdrawRound = delegatorData.value5
  unbond.delegate = transcoderAddress
  unbond.delegator = delegatorAddress.toHex()
  unbond.save()
}

// Handler for Reward events
export function reward(event: RewardEvent): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let delegate = Delegator.load(transcoderAddress.toHex())
  let protocol = Protocol.load('0') || new Protocol('0')
  let poolId = makePoolId(transcoderAddress.toHex(), protocol.currentRound)
  let pool = Pool.load(poolId)

  delegate.delegatedAmount = delegate.delegatedAmount.plus(event.params.amount)

  pool.rewardTokens = event.params.amount
  pool.feeShare = transcoder.feeShare
  pool.rewardCut = transcoder.rewardCut

  transcoder.totalStake = transcoder.totalStake.plus(event.params.amount)
  transcoder.lastRewardRound = protocol.currentRound

  transcoder.save()
  delegate.save()
  pool.save()
  protocol.save()

  let reward = new Reward(makeEventId(event.transaction.hash, event.logIndex))
  reward.hash = event.transaction.hash.toHex()
  reward.blockNumber = event.block.number
  reward.gasUsed = event.transaction.gasUsed
  reward.gasPrice = event.transaction.gasPrice
  reward.timestamp = event.block.timestamp
  reward.from = event.transaction.from.toHex()
  reward.to = event.transaction.to.toHex()
  reward.round = protocol.currentRound
  reward.rewardTokens = event.params.amount
  reward.delegate = transcoderAddress.toHex()
  reward.save()
}

export function claimEarnings(call: ClaimEarningsCall): void {
  // The Streamflow release introduced an event emitter for EarningsClaimed, so
  // we can ignore this call handler henceforth after the block in which the
  // protocol was paused prior to the streamflow upgrade
  if (call.block.number.le(BigInt.fromI32(9274414))) {
    let delegatorAddress = call.from
    let endRound = call.inputs._endRound
    let protocol = Protocol.load('0') || new Protocol('0')
    let delegator =
      Delegator.load(delegatorAddress.toHex()) ||
      new Delegator(delegatorAddress.toHex())
    let bondingManager = BondingManager.bind(call.to)
    let delegatorData = bondingManager.getDelegator(delegatorAddress)
    let bondedAmount = delegator.bondedAmount
    let lastClaimRound = delegator.lastClaimRound

    delegator.bondedAmount = delegatorData.value0
    delegator.fees = delegatorData.value1
    delegator.lastClaimRound = endRound.toString()
    delegator.save()

    let earningsClaimed = new EarningsClaimed(
      makeEventId(call.transaction.hash, call.transaction.index),
    )
    earningsClaimed.hash = call.transaction.hash.toHex()
    earningsClaimed.blockNumber = call.block.number
    earningsClaimed.gasUsed = call.transaction.gasUsed
    earningsClaimed.gasPrice = call.transaction.gasPrice
    earningsClaimed.timestamp = call.block.timestamp
    earningsClaimed.from = call.transaction.from.toHex()
    earningsClaimed.to = call.transaction.to.toHex()
    earningsClaimed.round = protocol.currentRound
    earningsClaimed.delegate = delegator.id
    earningsClaimed.delegator = delegatorAddress.toHex()
    earningsClaimed.startRound = lastClaimRound.toString()
    earningsClaimed.endRound = endRound.toString()
    earningsClaimed.rewardTokens = delegatorData.value0.minus(
      bondedAmount as BigInt,
    )
    earningsClaimed.fees = delegatorData.value1.minus(delegator.fees as BigInt)
    earningsClaimed.save()
  }
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStakeEvent): void {
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  let protocol = Protocol.load('0') || new Protocol('0')

  // Store transaction info
  let withdrawStake = new WithdrawStake(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  withdrawStake.hash = event.transaction.hash.toHex()
  withdrawStake.blockNumber = event.block.number
  withdrawStake.gasUsed = event.transaction.gasUsed
  withdrawStake.gasPrice = event.transaction.gasPrice
  withdrawStake.timestamp = event.block.timestamp
  withdrawStake.from = event.transaction.from.toHex()
  withdrawStake.to = event.transaction.to.toHex()
  withdrawStake.round = protocol.currentRound
  withdrawStake.amount = delegator.bondedAmount
  withdrawStake.delegator = delegatorAddress.toHex()
  withdrawStake.save()

  delegator.bondedAmount = BigInt.fromI32(0)
  delegator.save()
}

export function withdrawFees(event: WithdrawFeesEvent): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegatorAddress = event.params.delegator
  let delegator = Delegator.load(delegatorAddress.toHex())
  let protocol = Protocol.load('0') || new Protocol('0')
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let withdrawnFees = delegator.fees as BigInt

  // Store transaction info
  let withdrawFeesTransaction = new WithdrawFees(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  withdrawFeesTransaction.hash = event.transaction.hash.toHex()
  withdrawFeesTransaction.blockNumber = event.block.number
  withdrawFeesTransaction.gasUsed = event.transaction.gasUsed
  withdrawFeesTransaction.gasPrice = event.transaction.gasPrice
  withdrawFeesTransaction.timestamp = event.block.timestamp
  withdrawFeesTransaction.from = event.transaction.from.toHex()
  withdrawFeesTransaction.to = event.transaction.to.toHex()
  withdrawFeesTransaction.round = protocol.currentRound
  withdrawFeesTransaction.amount = withdrawnFees
  withdrawFeesTransaction.delegator = delegatorAddress.toHex()
  withdrawFeesTransaction.save()

  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.withdrawnFees = delegator.withdrawnFees.plus(withdrawnFees)
  delegator.lastClaimRound = protocol.currentRound
  delegator.save()
}

export function parameterUpdate(event: ParameterUpdateEvent): void {
  let bondingManager = BondingManager.bind(event.address)
  let protocol = Protocol.load('0') || new Protocol('0')

  if (event.params.param == 'unbondingPeriod') {
    protocol.unbondingPeriod = bondingManager.unbondingPeriod()
  }

  if (event.params.param == 'numActiveTranscoders') {
    protocol.numActiveTranscoders = bondingManager.getTranscoderPoolMaxSize()
  }

  if (event.params.param == 'maxEarningsClaimsRounds') {
    protocol.maxEarningsClaimsRounds = bondingManager.maxEarningsClaimsRounds()
  }

  protocol.save()

  let parameterUpdate = new ParameterUpdate(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  parameterUpdate.hash = event.transaction.hash.toHex()
  parameterUpdate.blockNumber = event.block.number
  parameterUpdate.gasUsed = event.transaction.gasUsed
  parameterUpdate.gasPrice = event.transaction.gasPrice
  parameterUpdate.timestamp = event.block.timestamp
  parameterUpdate.from = event.transaction.from.toHex()
  parameterUpdate.to = event.transaction.to.toHex()
  parameterUpdate.param = event.params.param

  // The first time this event was emitted the first round was not yet set
  if (protocol.currentRound) {
    parameterUpdate.round = protocol.currentRound
  }

  parameterUpdate.save()
}
