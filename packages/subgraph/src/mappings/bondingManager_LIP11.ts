// Import types and APIs from graph-ts
import { Address, store, dataSource } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  WithdrawStake as WithdrawStakeEvent,
  Bond as BondEvent,
  Unbond as UnbondEvent,
  Rebond as RebondEvent,
} from '../types/BondingManager_LIP11/BondingManager'

import {
  Transcoder,
  Delegator,
  UnbondingLock,
  Bond,
  Unbond,
  WithdrawStake,
  Rebond,
  Round,
} from '../types/schema'

import {
  makeUnbondingLockId,
  getRoundsManagerInstance,
  makeEventId,
} from './util'

export function bond(event: BondEvent): void {
  let bondingManager = BondingManager.bind(event.address)
  let newDelegateAddress = event.params.newDelegate
  let oldDelegateAddress = event.params.oldDelegate
  let delegatorAddress = event.params.delegator
  let bondedAmount = event.params.bondedAmount
  let additionalAmount = event.params.additionalAmount
  let delegateData = bondingManager.getDelegator(newDelegateAddress)
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let round = Round.load(currentRound.toString())
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

    // keep track of how much stake moved during this round.
    round.totalMovedStake = round.totalMovedStake.plus(
      delegatorData.value0.minus(additionalAmount),
    )

    // keep track of how much new stake was introduced this round
    round.totalNewStake = round.totalNewStake.plus(additionalAmount)

    round.save()
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
  let bond = new Bond(makeEventId(event.transaction.hash, event.logIndex))
  bond.hash = event.transaction.hash.toHex()
  bond.blockNumber = event.block.number
  bond.gasUsed = event.transaction.gasUsed
  bond.gasPrice = event.transaction.gasPrice
  bond.timestamp = event.block.timestamp
  bond.from = event.transaction.from.toHex()
  bond.to = event.transaction.to.toHex()
  bond.round = currentRound.toString()
  bond.newDelegate = newDelegateAddress.toHex()
  bond.oldDelegate = oldDelegateAddress.toHex()
  bond.delegator = delegatorAddress.toHex()
  bond.bondedAmount = bondedAmount
  bond.additionalAmount = additionalAmount
  bond.save()
}

// Handler for Unbond events
export function unbond(event: UnbondEvent): void {
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
  let unbond = new Unbond(makeEventId(event.transaction.hash, event.logIndex))
  unbond.hash = event.transaction.hash.toHex()
  unbond.blockNumber = event.block.number
  unbond.gasUsed = event.transaction.gasUsed
  unbond.gasPrice = event.transaction.gasPrice
  unbond.timestamp = event.block.timestamp
  unbond.from = event.transaction.from.toHex()
  unbond.to = event.transaction.to.toHex()
  unbond.round = currentRound.toString()
  unbond.amount = amount
  unbond.withdrawRound = unbondingLock.withdrawRound
  unbond.unbondingLockId = unbondingLock.unbondingLockId
  unbond.delegate = delegateAddress.toHex()
  unbond.delegator = delegator.id
  unbond.save()
}

// Handler for Rebond events
export function rebond(event: RebondEvent): void {
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
  let rebond = new Rebond(makeEventId(event.transaction.hash, event.logIndex))
  rebond.hash = event.transaction.hash.toHex()
  rebond.blockNumber = event.block.number
  rebond.gasUsed = event.transaction.gasUsed
  rebond.gasPrice = event.transaction.gasPrice
  rebond.timestamp = event.block.timestamp
  rebond.from = event.transaction.from.toHex()
  rebond.to = event.transaction.to.toHex()
  rebond.round = currentRound.toString()
  rebond.delegator = delegator.id
  rebond.delegate = delegate.id
  rebond.amount = amount
  rebond.unbondingLockId = unbondingLockId.toI32()
  rebond.save()
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStakeEvent): void {
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
  withdrawStake.round = currentRound.toString()
  withdrawStake.amount = amount
  withdrawStake.unbondingLockId = unbondingLockId.toI32()
  withdrawStake.delegator = delegatorAddress.toHex()
  withdrawStake.save()
}
