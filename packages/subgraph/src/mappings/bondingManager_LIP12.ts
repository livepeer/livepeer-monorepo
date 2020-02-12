import { dataSource } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  TranscoderUpdate,
  TranscoderActivated,
  TranscoderDeactivated,
  EarningsClaimed,
} from '../types/BondingManager_LIP12/BondingManager'

import {
  Transcoder,
  Delegator,
  TranscoderUpdatedEvent,
  ClaimEarningsEvent,
  TranscoderActivatedEvent,
  TranscoderDeactivatedEvent,
} from '../types/schema'

import { MAXIMUM_VALUE_UINT256, getRoundsManagerInstance } from './util'

export function transcoderUpdated(event: TranscoderUpdate): void {
  let transcoderAddress = event.params.transcoder
  let rewardCut = event.params.rewardCut
  let feeShare = event.params.feeShare
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let transcoder = Transcoder.load(transcoderAddress.toHex())

  // Create transcoder if it does not yet exist
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex())
  }

  transcoder.rewardCut = rewardCut
  transcoder.feeShare = feeShare

  // Apply store updates
  transcoder.save()

  // Store transaction info
  let transcoderUpdatedEvent = new TranscoderUpdatedEvent(
    event.transaction.hash.toHex() + '-TranscoderUpdate',
  )
  transcoderUpdatedEvent.hash = event.transaction.hash.toHex()
  transcoderUpdatedEvent.blockNumber = event.block.number
  transcoderUpdatedEvent.gasUsed = event.transaction.gasUsed
  transcoderUpdatedEvent.gasPrice = event.transaction.gasPrice
  transcoderUpdatedEvent.timestamp = event.block.timestamp
  transcoderUpdatedEvent.from = event.transaction.from.toHex()
  transcoderUpdatedEvent.to = event.transaction.to.toHex()
  transcoderUpdatedEvent.round = currentRound.toString()
  transcoderUpdatedEvent.rewardCut = rewardCut
  transcoderUpdatedEvent.feeShare = feeShare
  transcoderUpdatedEvent.delegate = transcoderAddress.toHex()
  transcoderUpdatedEvent.save()
}

export function transcoderActivated(event: TranscoderActivated): void {
  let transcoderAddress = event.params.transcoder
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex())
  }

  transcoder.lastActiveStakeUpdateRound = event.params.activationRound
  transcoder.activationRound = event.params.activationRound
  transcoder.deactivationRound = MAXIMUM_VALUE_UINT256
  transcoder.save()

  // Store transaction info
  let transcoderActivatedEvent = new TranscoderActivatedEvent(
    event.transaction.hash.toHex() + '-TranscoderActivated',
  )
  transcoderActivatedEvent.hash = event.transaction.hash.toHex()
  transcoderActivatedEvent.blockNumber = event.block.number
  transcoderActivatedEvent.gasUsed = event.transaction.gasUsed
  transcoderActivatedEvent.gasPrice = event.transaction.gasPrice
  transcoderActivatedEvent.timestamp = event.block.timestamp
  transcoderActivatedEvent.from = event.transaction.from.toHex()
  transcoderActivatedEvent.to = event.transaction.to.toHex()
  transcoderActivatedEvent.round = currentRound.toString()
  transcoderActivatedEvent.activationRound = event.params.activationRound
  transcoderActivatedEvent.delegate = transcoderAddress.toHex()
  transcoderActivatedEvent.save()
}

export function transcoderDeactivated(event: TranscoderDeactivated): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()

  transcoder.deactivationRound = event.params.deactivationRound
  transcoder.save()

  // Store transaction info
  let transcoderDeactivatedEvent = new TranscoderDeactivatedEvent(
    event.transaction.hash.toHex() + '-TranscoderDeactivated',
  )
  transcoderDeactivatedEvent.hash = event.transaction.hash.toHex()
  transcoderDeactivatedEvent.blockNumber = event.block.number
  transcoderDeactivatedEvent.gasUsed = event.transaction.gasUsed
  transcoderDeactivatedEvent.gasPrice = event.transaction.gasPrice
  transcoderDeactivatedEvent.timestamp = event.block.timestamp
  transcoderDeactivatedEvent.from = event.transaction.from.toHex()
  transcoderDeactivatedEvent.to = event.transaction.to.toHex()
  transcoderDeactivatedEvent.round = currentRound.toString()
  transcoderDeactivatedEvent.deactivationRound = event.params.deactivationRound
  transcoderDeactivatedEvent.delegate = transcoderAddress.toHex()
  transcoderDeactivatedEvent.save()
}

export function earningsClaimed(event: EarningsClaimed): void {
  let delegateAddress = event.params.delegate
  let delegatorAddress = event.params.delegator
  let rewards = event.params.rewards
  let fees = event.params.fees
  let startRound = event.params.startRound
  let endRound = event.params.startRound
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let delegator = Delegator.load(delegatorAddress.toHex())

  delegator.lastClaimRound = event.params.endRound.toString()
  delegator.bondedAmount = delegator.bondedAmount.plus(rewards)
  delegator.fees = delegator.fees.plus(fees)
  delegator.save()

  let claimEarningsEvent = new ClaimEarningsEvent(
    event.transaction.hash.toHex() + '-ClaimEarnings',
  )
  claimEarningsEvent.hash = event.transaction.hash.toHex()
  claimEarningsEvent.blockNumber = event.block.number
  claimEarningsEvent.gasUsed = event.transaction.gasUsed
  claimEarningsEvent.gasPrice = event.transaction.gasPrice
  claimEarningsEvent.timestamp = event.block.timestamp
  claimEarningsEvent.from = event.transaction.from.toHex()
  claimEarningsEvent.to = event.transaction.to.toHex()
  claimEarningsEvent.round = currentRound.toString()
  claimEarningsEvent.delegate = delegateAddress.toHex()
  claimEarningsEvent.delegator = delegatorAddress.toHex()
  claimEarningsEvent.startRound = startRound.toString()
  claimEarningsEvent.endRound = endRound.toString()
  claimEarningsEvent.rewardTokens = rewards
  claimEarningsEvent.fees = fees
  claimEarningsEvent.save()
}
