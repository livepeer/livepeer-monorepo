import {
  TranscoderUpdate as TranscoderUpdateEvent,
  TranscoderActivated as TranscoderActivatedEvent,
  TranscoderDeactivated as TranscoderDeactivatedEvent,
  EarningsClaimed as EarningsClaimedEvent,
} from '../types/BondingManager_streamflow/BondingManager'

import {
  Transcoder,
  Delegator,
  TranscoderUpdated,
  EarningsClaimed,
  TranscoderActivated,
  TranscoderDeactivated,
  Protocol,
} from '../types/schema'

import {
  MAXIMUM_VALUE_UINT256,
  makeEventId,
  convertToDecimal,
} from '../../utils/helpers'

export function transcoderUpdated(event: TranscoderUpdateEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let transcoder =
    Transcoder.load(event.params.transcoder.toHex()) ||
    new Transcoder(event.params.transcoder.toHex())

  transcoder.rewardCut = event.params.rewardCut
  transcoder.feeShare = event.params.feeShare

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
  transcoderUpdated.rewardCut = event.params.rewardCut
  transcoderUpdated.feeShare = event.params.feeShare
  transcoderUpdated.delegate = event.params.transcoder.toHex()
  transcoderUpdated.save()
}

export function transcoderActivated(event: TranscoderActivatedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')

  let transcoder =
    Transcoder.load(event.params.transcoder.toHex()) ||
    new Transcoder(event.params.transcoder.toHex())

  transcoder.active = true
  transcoder.lastActiveStakeUpdateRound = event.params.activationRound
  transcoder.activationRound = event.params.activationRound
  transcoder.deactivationRound = MAXIMUM_VALUE_UINT256
  transcoder.save()

  // Store transaction info
  let transcoderActivated = new TranscoderActivated(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  transcoderActivated.hash = event.transaction.hash.toHex()
  transcoderActivated.blockNumber = event.block.number
  transcoderActivated.gasUsed = event.transaction.gasUsed
  transcoderActivated.gasPrice = event.transaction.gasPrice
  transcoderActivated.timestamp = event.block.timestamp
  transcoderActivated.from = event.transaction.from.toHex()
  transcoderActivated.to = event.transaction.to.toHex()
  transcoderActivated.round = protocol.currentRound
  transcoderActivated.activationRound = event.params.activationRound
  transcoderActivated.delegate = event.params.transcoder.toHex()
  transcoderActivated.save()
}

export function transcoderDeactivated(event: TranscoderDeactivatedEvent): void {
  let transcoder = Transcoder.load(event.params.transcoder.toHex())
  let protocol = Protocol.load('0') || new Protocol('0')

  transcoder.active = false
  transcoder.deactivationRound = event.params.deactivationRound
  transcoder.save()

  // Store transaction info
  let transcoderDeactivated = new TranscoderDeactivated(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  transcoderDeactivated.hash = event.transaction.hash.toHex()
  transcoderDeactivated.blockNumber = event.block.number
  transcoderDeactivated.gasUsed = event.transaction.gasUsed
  transcoderDeactivated.gasPrice = event.transaction.gasPrice
  transcoderDeactivated.timestamp = event.block.timestamp
  transcoderDeactivated.from = event.transaction.from.toHex()
  transcoderDeactivated.to = event.transaction.to.toHex()
  transcoderDeactivated.round = protocol.currentRound
  transcoderDeactivated.deactivationRound = event.params.deactivationRound
  transcoderDeactivated.delegate = event.params.transcoder.toHex()
  transcoderDeactivated.save()
}

export function earningsClaimed(event: EarningsClaimedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let delegator =
    Delegator.load(event.params.delegator.toHex()) ||
    new Delegator(event.params.delegator.toHex())

  delegator.lastClaimRound = event.params.endRound.toString()

  delegator.bondedAmount = delegator.bondedAmount.plus(
    convertToDecimal(event.params.rewards),
  )

  delegator.fees = delegator.fees.plus(convertToDecimal(event.params.fees))

  delegator.save()

  let earningsClaimed = new EarningsClaimed(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  earningsClaimed.hash = event.transaction.hash.toHex()
  earningsClaimed.blockNumber = event.block.number
  earningsClaimed.gasUsed = event.transaction.gasUsed
  earningsClaimed.gasPrice = event.transaction.gasPrice
  earningsClaimed.timestamp = event.block.timestamp
  earningsClaimed.from = event.transaction.from.toHex()
  earningsClaimed.to = event.transaction.to.toHex()
  earningsClaimed.round = protocol.currentRound
  earningsClaimed.delegate = event.params.delegate.toHex()
  earningsClaimed.delegator = event.params.delegator.toHex()
  earningsClaimed.startRound = event.params.startRound.toString()
  earningsClaimed.endRound = event.params.startRound.toString()
  earningsClaimed.rewardTokens = convertToDecimal(event.params.rewards)
  earningsClaimed.fees = convertToDecimal(event.params.fees)
  earningsClaimed.save()
}
