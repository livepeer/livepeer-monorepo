import { dataSource } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  TranscoderUpdate as TranscoderUpdateEvent,
  TranscoderActivated as TranscoderActivatedEvent,
  TranscoderDeactivated as TranscoderDeactivatedEvent,
  EarningsClaimed as EarningsClaimedEvent,
} from '../types/BondingManager_LIP12/BondingManager'

import {
  Transcoder,
  Delegator,
  TranscoderUpdated,
  ClaimEarnings,
  TranscoderActivated,
  TranscoderDeactivated,
} from '../types/schema'

import { MAXIMUM_VALUE_UINT256, getRoundsManagerInstance } from './util'

export function transcoderUpdated(event: TranscoderUpdateEvent): void {
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
  let transcoderUpdated = new TranscoderUpdated(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  transcoderUpdated.hash = event.transaction.hash.toHex()
  transcoderUpdated.blockNumber = event.block.number
  transcoderUpdated.gasUsed = event.transaction.gasUsed
  transcoderUpdated.gasPrice = event.transaction.gasPrice
  transcoderUpdated.timestamp = event.block.timestamp
  transcoderUpdated.from = event.transaction.from.toHex()
  transcoderUpdated.to = event.transaction.to.toHex()
  transcoderUpdated.round = currentRound.toString()
  transcoderUpdated.rewardCut = rewardCut
  transcoderUpdated.feeShare = feeShare
  transcoderUpdated.delegate = transcoderAddress.toHex()
  transcoderUpdated.save()
}

export function transcoderActivated(event: TranscoderActivatedEvent): void {
  let transcoderAddress = event.params.transcoder
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex())
  }

  transcoder.active = true
  transcoder.lastActiveStakeUpdateRound = event.params.activationRound
  transcoder.activationRound = event.params.activationRound
  transcoder.deactivationRound = MAXIMUM_VALUE_UINT256
  transcoder.save()

  // Store transaction info
  let transcoderActivated = new TranscoderActivated(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  transcoderActivated.hash = event.transaction.hash.toHex()
  transcoderActivated.blockNumber = event.block.number
  transcoderActivated.gasUsed = event.transaction.gasUsed
  transcoderActivated.gasPrice = event.transaction.gasPrice
  transcoderActivated.timestamp = event.block.timestamp
  transcoderActivated.from = event.transaction.from.toHex()
  transcoderActivated.to = event.transaction.to.toHex()
  transcoderActivated.round = currentRound.toString()
  transcoderActivated.activationRound = event.params.activationRound
  transcoderActivated.delegate = transcoderAddress.toHex()
  transcoderActivated.save()
}

export function transcoderDeactivated(event: TranscoderDeactivatedEvent): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()

  transcoder.active = false
  transcoder.deactivationRound = event.params.deactivationRound
  transcoder.save()

  // Store transaction info
  let transcoderDeactivated = new TranscoderDeactivated(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  transcoderDeactivated.hash = event.transaction.hash.toHex()
  transcoderDeactivated.blockNumber = event.block.number
  transcoderDeactivated.gasUsed = event.transaction.gasUsed
  transcoderDeactivated.gasPrice = event.transaction.gasPrice
  transcoderDeactivated.timestamp = event.block.timestamp
  transcoderDeactivated.from = event.transaction.from.toHex()
  transcoderDeactivated.to = event.transaction.to.toHex()
  transcoderDeactivated.round = currentRound.toString()
  transcoderDeactivated.deactivationRound = event.params.deactivationRound
  transcoderDeactivated.delegate = transcoderAddress.toHex()
  transcoderDeactivated.save()
}

export function earningsClaimed(event: EarningsClaimedEvent): void {
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

  let claimEarnings = new ClaimEarnings(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  claimEarnings.hash = event.transaction.hash.toHex()
  claimEarnings.blockNumber = event.block.number
  claimEarnings.gasUsed = event.transaction.gasUsed
  claimEarnings.gasPrice = event.transaction.gasPrice
  claimEarnings.timestamp = event.block.timestamp
  claimEarnings.from = event.transaction.from.toHex()
  claimEarnings.to = event.transaction.to.toHex()
  claimEarnings.round = currentRound.toString()
  claimEarnings.delegate = delegateAddress.toHex()
  claimEarnings.delegator = delegatorAddress.toHex()
  claimEarnings.startRound = startRound.toString()
  claimEarnings.endRound = endRound.toString()
  claimEarnings.rewardTokens = rewards
  claimEarnings.fees = fees
  claimEarnings.save()
}
