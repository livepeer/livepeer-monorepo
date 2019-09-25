// Import types and APIs from graph-ts
import { Address, store, BigInt } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  WithdrawStake,
  Bond,
  Unbond,
  Rebond
} from '../types/BondingManager_LIP11/BondingManager'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Delegator,
  UnbondingLock,
  BondTransaction,
  UnbondTransaction,
  WithdrawStakeTransaction,
  RebondTransaction
} from '../types/schema'

import { makeUnbondingLockId } from './util'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
)

export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address)
  let transcoderAddress = event.params.newDelegate
  let delegatorAddress = event.params.delegator
  let additionalAmount = event.params.additionalAmount
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
  bondTransaction.oldDelegate = event.params.oldDelegate.toHex()
  bondTransaction.delegator = delegatorAddress.toHex()
  bondTransaction.additionalAmount = additionalAmount
  bondTransaction.save()
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

  delegate.delegatedAmount = totalStake
  transcoder.totalStake = totalStake

  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  delegator.lastClaimRound = currentRound.toString()
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.unbonded = delegator.unbonded.plus(amount)

  // Delegator no longer delegated to anyone if it does not have a bonded amount
  // so remove it from delegate
  if (delegatorData.value0.isZero()) {
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

  unbondingLock.unbondingLockId = unbondingLockId.toI32()
  unbondingLock.delegator = delegatorAddress.toHex()
  unbondingLock.delegate = delegateAddress.toHex()
  unbondingLock.withdrawRound = withdrawRound.toI32()
  unbondingLock.amount = amount

  // Apply store updates
  delegate.save()
  transcoder.save()
  unbondingLock.save()
  delegator.save()

  // Store transaction info
  let unbondTransaction = new UnbondTransaction(event.transaction.hash.toHex())
  unbondTransaction.blockNumber = event.block.number
  unbondTransaction.gasUsed = event.transaction.gasUsed
  unbondTransaction.gasPrice = event.transaction.gasPrice
  unbondTransaction.timestamp = event.block.timestamp
  unbondTransaction.from = event.transaction.from.toHex()
  unbondTransaction.to = event.transaction.to.toHex()
  unbondTransaction.round = currentRound.toString()
  unbondTransaction.amount = amount
  unbondTransaction.withdrawRound = unbondingLock.withdrawRound
  unbondTransaction.unbondingLockId = unbondingLock.unbondingLockId
  unbondTransaction.delegate = delegateAddress.toHex()
  unbondTransaction.delegator = delegator.id
  unbondTransaction.save()
}

// Handler for Rebond events
export function rebond(event: Rebond): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegateAddress = event.params.delegate
  let delegatorAddress = event.params.delegator
  let amount = event.params.amount
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

  // update delegator
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  delegator.delegate = delegateAddress.toHex()
  delegator.startRound = delegatorData.value4.toString()
  delegator.lastClaimRound = currentRound.toString()
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.unbonded = delegator.unbonded.minus(amount)

  // update delegate
  delegate.delegatedAmount = totalStake
  transcoder.totalStake = totalStake

  // Apply store updates
  delegate.save()
  transcoder.save()
  delegator.save()
  store.remove('UnbondingLock', uniqueUnbondingLockId)

  // Store transaction info
  let rebondTransaction = new RebondTransaction(event.transaction.hash.toHex())
  rebondTransaction.blockNumber = event.block.number
  rebondTransaction.gasUsed = event.transaction.gasUsed
  rebondTransaction.gasPrice = event.transaction.gasPrice
  rebondTransaction.timestamp = event.block.timestamp
  rebondTransaction.from = event.transaction.from.toHex()
  rebondTransaction.to = event.transaction.to.toHex()
  rebondTransaction.round = currentRound.toString()
  rebondTransaction.delegator = delegator.id
  rebondTransaction.delegate = delegate.id
  rebondTransaction.amount = amount
  rebondTransaction.unbondingLockId = unbondingLockId.toI32()
  rebondTransaction.save()
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegatorAddress = event.params.delegator
  let unbondingLockId = event.params.unbondingLockId
  let amount = event.params.amount
  let currentRound = roundsManager.currentRound()
  let uniqueUnbondingLockId = makeUnbondingLockId(
    delegatorAddress,
    unbondingLockId
  )
  store.remove('UnbondingLock', uniqueUnbondingLockId)

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
  withdrawStakeTransaction.amount = amount
  withdrawStakeTransaction.unbondingLockId = unbondingLockId.toI32()
  withdrawStakeTransaction.delegator = delegatorAddress.toHex()
  withdrawStakeTransaction.save()
}
