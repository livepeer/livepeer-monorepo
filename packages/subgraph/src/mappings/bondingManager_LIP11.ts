// Import types and APIs from graph-ts
import { Address, BigInt, store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  WithdrawStake,
  Bond,
  Unbond,
  Rebond
} from '../types/BondingManager_LIP11/BondingManager'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'

import { updateDelegatorWithEarnings } from './bondingManager'

// Import entity types generated from the GraphQL schema
import { Transcoder, Delegator, UnbondingLock } from '../types/schema'

import { makeUnbondingLockId } from './util'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
)

// Handler for Bond events
export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address)
  let newTranscoderAddress = event.params.newDelegate
  let oldTranscoderAddress = event.params.oldDelegate
  let delegatorAddress = event.params.delegator
  let currentRound = roundsManager.currentRound()

  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let bondedAmount = delegatorData.value0
  let fees = delegatorData.value1

  // Get old delegate data
  let oldDelegateData = bondingManager.getDelegator(oldTranscoderAddress)

  // Get new delegate data
  let newDelegateData = bondingManager.getDelegator(newTranscoderAddress)

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
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

  updateDelegatorWithEarnings(delegator, currentRound, bondedAmount, fees)

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
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress)
  let currentRound = roundsManager.currentRound()

  let delegate = Delegator.load(delegateAddress.toHex())
  if (delegate == null) {
    delegate = new Delegator(delegateAddress.toHex())
  }
  // get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let bondedAmount = delegatorData.value0
  let fees = delegatorData.value1

  updateDelegatorWithEarnings(delegator, currentRound, bondedAmount, fees)

  let transcoder = Transcoder.load(delegateAddress.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(delegateAddress.toHex())
  }

  let unbondingLock = UnbondingLock.load(uniqueUnbondingLockId)
  if (unbondingLock == null) {
    unbondingLock = new UnbondingLock(uniqueUnbondingLockId)
  }

  // Get delegate data
  let delegateData = bondingManager.getDelegator(delegateAddress)

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3

  // Update transcoder's total stake
  transcoder.totalStake = totalStake

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
  let delegator = Delegator.load(delegatorAddress.toHex()) as Delegator
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress)
  let currentRound = roundsManager.currentRound()

  // Get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress)
  let bondedAmount = delegatorData.value0
  let fees = delegatorData.value1

  updateDelegatorWithEarnings(delegator, currentRound, bondedAmount, fees)

  // Get delegate data
  let delegateData = bondingManager.getDelegator(delegateAddress)

  // Update delegator's delegate
  delegator.delegate = delegateAddress.toHex()

  // Update delegator's start round
  delegator.startRound = delegatorData.value4.toString()

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
