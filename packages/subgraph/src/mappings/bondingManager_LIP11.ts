// Import types and APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

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
  Protocol,
} from '../types/schema'

import {
  makeUnbondingLockId,
  makeEventId,
  EMPTY_ADDRESS,
  convertToDecimal,
} from '../../utils/helpers'

export function bond(event: BondEvent): void {
  let bondingManager = BondingManager.bind(event.address)
  let delegateData = bondingManager.getDelegator(event.params.newDelegate)
  let delegatorData = bondingManager.getDelegator(event.params.delegator)
  let protocol = Protocol.load('0') || new Protocol('0')
  let round = Round.load(protocol.currentRound)
  let transcoder =
    Transcoder.load(event.params.newDelegate.toHex()) ||
    new Transcoder(event.params.newDelegate.toHex())
  let delegate =
    Delegator.load(event.params.newDelegate.toHex()) ||
    new Delegator(event.params.newDelegate.toHex())
  let delegator =
    Delegator.load(event.params.delegator.toHex()) ||
    new Delegator(event.params.delegator.toHex())

  // If self delegating, set status and assign reference to self
  if (event.params.delegator.toHex() == event.params.newDelegate.toHex()) {
    transcoder.status = 'Registered'
    transcoder.delegator = event.params.delegator.toHex()
  }

  // Changing delegate
  if (
    event.params.oldDelegate.toHex() != EMPTY_ADDRESS.toHex() &&
    event.params.oldDelegate.toHex() != event.params.newDelegate.toHex()
  ) {
    let oldTranscoder = Transcoder.load(event.params.oldDelegate.toHex())
    let oldDelegate = Delegator.load(event.params.oldDelegate.toHex())
    let delegateData = bondingManager.getDelegator(event.params.oldDelegate)

    // if previous delegate was itself, set status and unassign reference to self
    if (event.params.oldDelegate.toHex() == event.params.delegator.toHex()) {
      oldTranscoder.status = 'NotRegistered'
      oldTranscoder.delegator = null
    }

    oldTranscoder.totalStake = convertToDecimal(delegateData.value3)
    oldDelegate.delegatedAmount = convertToDecimal(delegateData.value3)

    oldDelegate.save()
    oldTranscoder.save()

    // keep track of how much stake moved during this round.
    round.movedStake = round.movedStake.plus(
      convertToDecimal(delegatorData.value0).minus(
        convertToDecimal(event.params.additionalAmount),
      ),
    )

    // keep track of how much new stake was introduced this round
    round.newStake = round.newStake.plus(
      convertToDecimal(event.params.additionalAmount),
    )

    round.save()
  }

  transcoder.totalStake = convertToDecimal(delegateData.value3)
  delegate.delegatedAmount = convertToDecimal(delegateData.value3)

  delegator.delegate = event.params.newDelegate.toHex()
  delegator.lastClaimRound = protocol.currentRound
  delegator.bondedAmount = convertToDecimal(event.params.bondedAmount)
  delegator.fees = convertToDecimal(delegatorData.value1)
  delegator.startRound = delegatorData.value4

  delegator.principal = delegator.principal.plus(
    convertToDecimal(event.params.additionalAmount),
  )

  delegate.save()
  delegator.save()
  transcoder.save()
  protocol.save()

  // Store transaction info
  let bond = new Bond(makeEventId(event.transaction.hash, event.logIndex))
  bond.hash = event.transaction.hash.toHex()
  bond.blockNumber = event.block.number
  bond.gasUsed = event.transaction.gasUsed
  bond.gasPrice = event.transaction.gasPrice
  bond.timestamp = event.block.timestamp
  bond.from = event.transaction.from.toHex()
  bond.to = event.transaction.to.toHex()
  bond.round = protocol.currentRound
  bond.newDelegate = event.params.newDelegate.toHex()
  bond.oldDelegate = event.params.oldDelegate.toHex()
  bond.delegator = event.params.delegator.toHex()
  bond.bondedAmount = convertToDecimal(event.params.bondedAmount)
  bond.additionalAmount = convertToDecimal(event.params.additionalAmount)
  bond.save()
}

// Handler for Unbond events
export function unbond(event: UnbondEvent): void {
  let bondingManager = BondingManager.bind(event.address)
  let uniqueUnbondingLockId = makeUnbondingLockId(
    event.params.delegator,
    event.params.unbondingLockId,
  )
  let withdrawRound = event.params.withdrawRound
  let amount = convertToDecimal(event.params.amount)
  let delegator = Delegator.load(event.params.delegator.toHex())
  let delegateData = bondingManager.getDelegator(event.params.delegate)
  let protocol = Protocol.load('0') || new Protocol('0')
  let transcoder =
    Transcoder.load(event.params.delegate.toHex()) ||
    new Transcoder(event.params.delegate.toHex())
  let delegate =
    Delegator.load(event.params.delegate.toHex()) ||
    new Delegator(event.params.delegate.toHex())
  let unbondingLock =
    UnbondingLock.load(uniqueUnbondingLockId) ||
    new UnbondingLock(uniqueUnbondingLockId)

  delegate.delegatedAmount = convertToDecimal(delegateData.value3)
  transcoder.totalStake = convertToDecimal(delegateData.value3)

  let delegatorData = bondingManager.getDelegator(event.params.delegator)
  delegator.lastClaimRound = protocol.currentRound
  delegator.bondedAmount = convertToDecimal(delegatorData.value0)
  delegator.fees = convertToDecimal(delegatorData.value1)
  delegator.startRound = delegatorData.value4

  delegator.unbonded = delegator.unbonded.plus(
    convertToDecimal(event.params.amount),
  )

  // Delegator no longer delegated to anyone if it does not have a bonded amount
  // so remove it from delegate
  if (delegatorData.value0.isZero()) {
    // If unbonding from self and no longer has a bonded amount
    // update transcoder status and delegator
    if (event.params.delegator.toHex() == event.params.delegate.toHex()) {
      transcoder.status = 'NotRegistered'
      transcoder.delegator = null
    }

    // Update delegator's delegate
    delegator.delegate = null
  }

  unbondingLock.unbondingLockId = event.params.unbondingLockId.toI32()
  unbondingLock.delegator = event.params.delegator.toHex()
  unbondingLock.delegate = event.params.delegate.toHex()
  unbondingLock.withdrawRound = withdrawRound
  unbondingLock.amount = amount

  // Apply store updates
  delegate.save()
  transcoder.save()
  unbondingLock.save()
  delegator.save()
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
  unbond.amount = amount
  unbond.withdrawRound = unbondingLock.withdrawRound
  unbond.unbondingLockId = event.params.unbondingLockId.toI32()
  unbond.delegate = event.params.delegate.toHex()
  unbond.delegator = delegator.id
  unbond.save()
}

// Handler for Rebond events
export function rebond(event: RebondEvent): void {
  let bondingManager = BondingManager.bind(event.address)
  let uniqueUnbondingLockId = makeUnbondingLockId(
    event.params.delegator,
    event.params.unbondingLockId,
  )
  let transcoder = Transcoder.load(event.params.delegate.toHex())
  let delegate = Delegator.load(event.params.delegate.toHex())
  let delegator = Delegator.load(event.params.delegator.toHex())
  let delegateData = bondingManager.getDelegator(event.params.delegate)
  let protocol = Protocol.load('0') || new Protocol('0')

  // If rebonding from unbonded and is self-bonding then update transcoder status
  if (
    !delegator.delegate &&
    event.params.delegate.toHex() == event.params.delegator.toHex()
  ) {
    transcoder.status = 'Registered'
    transcoder.delegator = event.params.delegator.toHex()
  }

  // update delegator
  let delegatorData = bondingManager.getDelegator(event.params.delegator)
  delegator.delegate = event.params.delegate.toHex()
  delegator.startRound = delegatorData.value4
  delegator.lastClaimRound = protocol.currentRound
  delegator.bondedAmount = convertToDecimal(delegatorData.value0)
  delegator.fees = convertToDecimal(delegatorData.value1)
  delegator.unbonded = delegator.unbonded.minus(
    convertToDecimal(event.params.amount),
  )

  // update delegate
  delegate.delegatedAmount = convertToDecimal(delegateData.value3)
  transcoder.totalStake = convertToDecimal(delegateData.value3)

  // Apply store updates
  delegate.save()
  transcoder.save()
  delegator.save()
  protocol.save()
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
  rebond.round = protocol.currentRound
  rebond.delegator = delegator.id
  rebond.delegate = delegate.id
  rebond.amount = convertToDecimal(event.params.amount)
  rebond.unbondingLockId = event.params.unbondingLockId.toI32()
  rebond.save()
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStakeEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')

  let uniqueUnbondingLockId = makeUnbondingLockId(
    event.params.delegator,
    event.params.unbondingLockId,
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
  withdrawStake.round = protocol.currentRound
  withdrawStake.amount = convertToDecimal(event.params.amount)
  withdrawStake.unbondingLockId = event.params.unbondingLockId.toI32()
  withdrawStake.delegator = event.params.delegator.toHex()
  withdrawStake.save()
}
