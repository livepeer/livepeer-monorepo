import {
  TranscoderUpdate,
  TranscoderActivated,
  TranscoderDeactivated,
  EarningsClaimed,
} from '../types/BondingManager_streamflow/BondingManager'

import {
  Transaction,
  Transcoder,
  TranscoderUpdateEvent,
  EarningsClaimedEvent,
  TranscoderActivatedEvent,
  TranscoderDeactivatedEvent,
  Protocol,
} from '../types/schema'

import {
  MAXIMUM_VALUE_UINT256,
  makeEventId,
  convertToDecimal,
  createOrLoadTranscoder,
  createOrLoadDelegator,
  createOrLoadRound,
} from '../../utils/helpers'

export function transcoderUpdate(event: TranscoderUpdate): void {
  let round = createOrLoadRound(event.block.number)
  let transcoder = createOrLoadTranscoder(event.params.transcoder.toHex())
  transcoder.rewardCut = event.params.rewardCut
  transcoder.feeShare = event.params.feeShare
  transcoder.save()

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex())
  tx.blockNumber = event.block.number
  tx.gasUsed = event.transaction.gasUsed
  tx.gasPrice = event.transaction.gasPrice
  tx.timestamp = event.block.timestamp.toI32()
  tx.from = event.transaction.from.toHex()
  tx.to = event.transaction.to.toHex()
  tx.save()

  let transcoderUpdate = new TranscoderUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  transcoderUpdate.transaction = event.transaction.hash.toHex()
  transcoderUpdate.timestamp = event.block.timestamp.toI32()
  transcoderUpdate.round = round.id
  transcoderUpdate.rewardCut = event.params.rewardCut
  transcoderUpdate.feeShare = event.params.feeShare
  transcoderUpdate.delegate = event.params.transcoder.toHex()
  transcoderUpdate.save()
}

export function transcoderActivated(event: TranscoderActivated): void {
  let round = createOrLoadRound(event.block.number)
  let transcoder = createOrLoadTranscoder(event.params.transcoder.toHex())
  transcoder.active = true
  transcoder.lastActiveStakeUpdateRound = event.params.activationRound
  transcoder.activationRound = event.params.activationRound
  transcoder.deactivationRound = MAXIMUM_VALUE_UINT256
  transcoder.save()

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex())
  tx.blockNumber = event.block.number
  tx.gasUsed = event.transaction.gasUsed
  tx.gasPrice = event.transaction.gasPrice
  tx.timestamp = event.block.timestamp.toI32()
  tx.from = event.transaction.from.toHex()
  tx.to = event.transaction.to.toHex()
  tx.save()

  let transcoderActivated = new TranscoderActivatedEvent(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  transcoderActivated.transaction = event.transaction.hash.toHex()
  transcoderActivated.timestamp = event.block.timestamp.toI32()
  transcoderActivated.round = round.id
  transcoderActivated.activationRound = event.params.activationRound
  transcoderActivated.delegate = event.params.transcoder.toHex()
  transcoderActivated.save()
}

export function transcoderDeactivated(event: TranscoderDeactivated): void {
  let transcoder = Transcoder.load(event.params.transcoder.toHex())
  let round = createOrLoadRound(event.block.number)

  transcoder.active = false
  transcoder.deactivationRound = event.params.deactivationRound
  transcoder.save()

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex())
  tx.blockNumber = event.block.number
  tx.gasUsed = event.transaction.gasUsed
  tx.gasPrice = event.transaction.gasPrice
  tx.timestamp = event.block.timestamp.toI32()
  tx.from = event.transaction.from.toHex()
  tx.to = event.transaction.to.toHex()
  tx.save()

  let transcoderDeactivated = new TranscoderDeactivatedEvent(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  transcoderDeactivated.transaction = event.transaction.hash.toHex()
  transcoderDeactivated.timestamp = event.block.timestamp.toI32()
  transcoderDeactivated.round = round.id
  transcoderDeactivated.deactivationRound = event.params.deactivationRound
  transcoderDeactivated.delegate = event.params.transcoder.toHex()
  transcoderDeactivated.save()
}

export function earningsClaimed(event: EarningsClaimed): void {
  let round = createOrLoadRound(event.block.number)
  let delegator = createOrLoadDelegator(event.params.delegator.toHex())
  delegator.lastClaimRound = event.params.endRound.toString()
  delegator.bondedAmount = delegator.bondedAmount.plus(
    convertToDecimal(event.params.rewards),
  )
  delegator.fees = delegator.fees.plus(convertToDecimal(event.params.fees))
  delegator.save()

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex())
  tx.blockNumber = event.block.number
  tx.gasUsed = event.transaction.gasUsed
  tx.gasPrice = event.transaction.gasPrice
  tx.timestamp = event.block.timestamp.toI32()
  tx.from = event.transaction.from.toHex()
  tx.to = event.transaction.to.toHex()
  tx.save()

  let earningsClaimed = new EarningsClaimedEvent(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  earningsClaimed.transaction = event.transaction.hash.toHex()
  earningsClaimed.timestamp = event.block.timestamp.toI32()
  earningsClaimed.round = round.id
  earningsClaimed.delegate = event.params.delegate.toHex()
  earningsClaimed.delegator = event.params.delegator.toHex()
  earningsClaimed.startRound = event.params.startRound.toString()
  earningsClaimed.endRound = event.params.startRound.toString()
  earningsClaimed.rewardTokens = convertToDecimal(event.params.rewards)
  earningsClaimed.fees = convertToDecimal(event.params.fees)
  earningsClaimed.save()
}
