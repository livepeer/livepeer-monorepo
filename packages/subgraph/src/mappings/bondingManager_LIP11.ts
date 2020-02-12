// Import types and APIs from graph-ts
import { Address, store, dataSource } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  WithdrawStake,
  Bond,
  Unbond,
  Rebond,
} from '../types/BondingManager_LIP11/BondingManager'

import {
  Transcoder,
  Delegator,
  UnbondingLock,
  BondEvent,
  UnbondEvent,
  WithdrawStakeEvent,
  RebondEvent,
} from '../types/schema'

import { makeUnbondingLockId, getRoundsManagerInstance } from './util'

export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address)
  let newDelegateAddress = event.params.newDelegate
  let oldDelegateAddress = event.params.oldDelegate
  let delegatorAddress = event.params.delegator
  let additionalAmount = event.params.additionalAmount
  let delegateData = bondingManager.getDelegator(newDelegateAddress)
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let EMPTY_ADDRESS = Address.fromString(
    '0000000000000000000000000000000000000000',
  )

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
    oldDelegateAddress.toHex() != EMPTY_ADDRESS.toHex() &&
    oldDelegateAddress.toHex() != newDelegateAddress.toHex()
  ) {
    let oldTranscoder = Transcoder.load(oldDelegateAddress.toHex())
    let oldDelegate = Delegator.load(oldDelegateAddress.toHex())
    let delegateData = bondingManager.getDelegator(oldDelegateAddress)

    // if previous delegate was itself, set status and unassign reference to self
    if (oldDelegateAddress.toHex() == delegatorAddress.toHex()) {
      oldTranscoder.status = 'NotRegistered'
      oldTranscoder.delegator = null
    }

    oldTranscoder.totalStake = delegateData.value3
    oldDelegate.delegatedAmount = delegateData.value3

    oldDelegate.save()
    oldTranscoder.save()
  }

  transcoder.totalStake = delegateData.value3
  delegate.delegatedAmount = delegateData.value3

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
  bondEvent.oldDelegate = oldDelegateAddress.toHex()
  bondEvent.delegator = delegatorAddress.toHex()
  bondEvent.additionalAmount = additionalAmount
  bondEvent.save()
}

// Handler for Unbond events
export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegateAddress = event.params.delegate
  let delegatorAddress = event.params.delegator
  let unbondingLockId = event.params.unbondingLockId
  let uniqueUnbondingLockId = makeUnbondingLockId(
    delegatorAddress,
    unbondingLockId,
  )
  let withdrawRound = event.params.withdrawRound
  let amount = event.params.amount
  let delegator = Delegator.load(delegatorAddress.toHex())
  let delegateData = bondingManager.getDelegator(delegateAddress)
  let roundsManager = getRoundsManagerInstance(dataSource.network())
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

  delegate.delegatedAmount = delegateData.value3
  transcoder.totalStake = delegateData.value3

  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  delegator.lastClaimRound = currentRound.toString()
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.startRound = delegatorData.value4
  delegator.unbonded = delegator.unbonded.plus(amount)

  // Delegator no longer delegated to anyone if it does not have a bonded amount
  // so remove it from delegate
  if (delegatorData.value0.isZero()) {
    // If unbonding from self and no longer has a bonded amount
    // update transcoder status and delegator
    if (delegatorAddress.toHex() == delegateAddress.toHex()) {
      transcoder.status = 'NotRegistered'
      transcoder.delegator = null
    }

    // Update delegator's delegate
    delegator.delegate = null
  }

  unbondingLock.unbondingLockId = unbondingLockId.toI32()
  unbondingLock.delegator = delegatorAddress.toHex()
  unbondingLock.delegate = delegateAddress.toHex()
  unbondingLock.withdrawRound = withdrawRound
  unbondingLock.amount = amount

  // Apply store updates
  delegate.save()
  transcoder.save()
  unbondingLock.save()
  delegator.save()

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
  unbondEvent.amount = amount
  unbondEvent.withdrawRound = unbondingLock.withdrawRound
  unbondEvent.unbondingLockId = unbondingLock.unbondingLockId
  unbondEvent.delegate = delegateAddress.toHex()
  unbondEvent.delegator = delegator.id
  unbondEvent.save()
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
    unbondingLockId,
  )
  let transcoder = Transcoder.load(delegateAddress.toHex())
  let delegate = Delegator.load(delegateAddress.toHex())
  let delegator = Delegator.load(delegatorAddress.toHex())
  let delegateData = bondingManager.getDelegator(delegateAddress)

  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()

  // If rebonding from unbonded and is self-bonding then update transcoder status
  if (
    !delegator.delegate &&
    delegateAddress.toHex() == delegatorAddress.toHex()
  ) {
    transcoder.status = 'Registered'
    transcoder.delegator = delegatorAddress.toHex()
  }

  // update delegator
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  delegator.delegate = delegateAddress.toHex()
  delegator.startRound = delegatorData.value4
  delegator.lastClaimRound = currentRound.toString()
  delegator.bondedAmount = delegatorData.value0
  delegator.fees = delegatorData.value1
  delegator.unbonded = delegator.unbonded.minus(amount)

  // update delegate
  delegate.delegatedAmount = delegateData.value3
  transcoder.totalStake = delegateData.value3

  // Apply store updates
  delegate.save()
  transcoder.save()
  delegator.save()
  store.remove('UnbondingLock', uniqueUnbondingLockId)

  // Store transaction info
  let rebondEvent = new RebondEvent(event.transaction.hash.toHex() + 'Rebond')
  rebondEvent.hash = event.transaction.hash.toHex()
  rebondEvent.blockNumber = event.block.number
  rebondEvent.gasUsed = event.transaction.gasUsed
  rebondEvent.gasPrice = event.transaction.gasPrice
  rebondEvent.timestamp = event.block.timestamp
  rebondEvent.from = event.transaction.from.toHex()
  rebondEvent.to = event.transaction.to.toHex()
  rebondEvent.round = currentRound.toString()
  rebondEvent.delegator = delegator.id
  rebondEvent.delegate = delegate.id
  rebondEvent.amount = amount
  rebondEvent.unbondingLockId = unbondingLockId.toI32()
  rebondEvent.save()
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegatorAddress = event.params.delegator
  let unbondingLockId = event.params.unbondingLockId
  let amount = event.params.amount
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let uniqueUnbondingLockId = makeUnbondingLockId(
    delegatorAddress,
    unbondingLockId,
  )
  store.remove('UnbondingLock', uniqueUnbondingLockId)

  // Store transaction info
  let withdrawStakeEvent = new WithdrawStakeEvent(
    event.transaction.hash.toHex() + 'WithdrawStake',
  )
  withdrawStakeEvent.hash = event.transaction.hash.toHex()
  withdrawStakeEvent.blockNumber = event.block.number
  withdrawStakeEvent.gasUsed = event.transaction.gasUsed
  withdrawStakeEvent.gasPrice = event.transaction.gasPrice
  withdrawStakeEvent.timestamp = event.block.timestamp
  withdrawStakeEvent.from = event.transaction.from.toHex()
  withdrawStakeEvent.to = event.transaction.to.toHex()
  withdrawStakeEvent.round = currentRound.toString()
  withdrawStakeEvent.amount = amount
  withdrawStakeEvent.unbondingLockId = unbondingLockId.toI32()
  withdrawStakeEvent.delegator = delegatorAddress.toHex()
  withdrawStakeEvent.save()
}
