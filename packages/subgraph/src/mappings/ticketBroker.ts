import {
  WinningTicketRedeemed,
  ReserveFunded,
  DepositFunded,
  ReserveClaimed,
  Withdrawal,
} from '../types/TicketBroker/TicketBroker'
import {
  WinningTicket,
  WinningTicketRedeemedEvent,
  Protocol,
  Transcoder,
  Broadcaster,
  Round,
} from '../types/schema'
import { BigInt, dataSource } from '@graphprotocol/graph-ts'
import { getRoundsManagerInstance } from './util'

export function winningTicketRedeemed(event: WinningTicketRedeemed): void {
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let round = Round.load(currentRound.toString())
  let winningTicket = new WinningTicket(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  winningTicket.sender = event.params.sender.toHex()
  winningTicket.recipient = event.params.recipient.toHex()
  winningTicket.faceValue = event.params.faceValue
  winningTicket.winProb = event.params.winProb
  winningTicket.senderNonce = event.params.senderNonce
  winningTicket.recipientRand = event.params.recipientRand
  winningTicket.auxData = event.params.auxData
  winningTicket.txHash = event.transaction.hash.toHex()
  winningTicket.save()

  let winningTicketRedeemedEvent = new WinningTicketRedeemedEvent(
    event.transaction.hash.toHex() + 'WinningTicketRedeemedEvent',
  )
  winningTicketRedeemedEvent.hash = event.transaction.hash.toHex()
  winningTicketRedeemedEvent.blockNumber = event.block.number
  winningTicketRedeemedEvent.gasUsed = event.transaction.gasUsed
  winningTicketRedeemedEvent.gasPrice = event.transaction.gasPrice
  winningTicketRedeemedEvent.timestamp = event.block.timestamp
  winningTicketRedeemedEvent.from = event.transaction.from.toHex()
  winningTicketRedeemedEvent.to = event.transaction.to.toHex()
  winningTicketRedeemedEvent.round = currentRound.toString()
  winningTicketRedeemedEvent.sender = event.params.sender.toHex()
  winningTicketRedeemedEvent.recipient = event.params.recipient.toHex()
  winningTicketRedeemedEvent.faceValue = event.params.faceValue
  winningTicketRedeemedEvent.winProb = event.params.winProb
  winningTicketRedeemedEvent.senderNonce = event.params.senderNonce
  winningTicketRedeemedEvent.recipientRand = event.params.recipientRand
  winningTicketRedeemedEvent.auxData = event.params.auxData
  winningTicketRedeemedEvent.save()

  // Update broadcaster's deposit & reserve
  let broadcaster = Broadcaster.load(event.params.sender.toHex())
  if (event.params.faceValue.gt(broadcaster.deposit as BigInt)) {
    broadcaster.deposit = BigInt.fromI32(0)
  } else {
    broadcaster.deposit = broadcaster.deposit.minus(event.params.faceValue)
  }

  // Update accrued fees for this transcoder
  let transcoder = Transcoder.load(event.params.recipient.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(event.params.recipient.toHex())
  }
  transcoder.totalGeneratedFees = transcoder.totalGeneratedFees.plus(
    event.params.faceValue,
  )
  transcoder.save()

  // Update total protocol fees and total winning tickets
  let protocol = Protocol.load('0')
  if (protocol == null) {
    protocol = new Protocol('0')
  }
  protocol.totalGeneratedFees = protocol.totalGeneratedFees.plus(
    event.params.faceValue,
  )
  protocol.totalWinningTickets = protocol.totalWinningTickets.plus(
    BigInt.fromI32(1),
  )
  protocol.save()

  // keep track of how many fees were generated this round
  round.totalGeneratedFees = round.totalGeneratedFees.plus(
    event.params.faceValue,
  )

  round.save()
}

export function depositFunded(event: DepositFunded): void {
  let broadcaster = Broadcaster.load(event.params.sender.toHex())
  if (broadcaster == null) {
    broadcaster = new Broadcaster(event.params.sender.toHex())
  }
  broadcaster.deposit = broadcaster.deposit.plus(event.params.amount)
  broadcaster.save()
}

export function reserveFunded(event: ReserveFunded): void {
  let broadcaster = Broadcaster.load(event.params.reserveHolder.toHex())
  if (broadcaster == null) {
    broadcaster = new Broadcaster(event.params.reserveHolder.toHex())
  }
  broadcaster.reserve = broadcaster.reserve.plus(event.params.amount)
  broadcaster.save()
}

export function reserveClaimed(event: ReserveClaimed): void {
  let broadcaster = Broadcaster.load(event.params.reserveHolder.toHex())
  broadcaster.reserve = broadcaster.reserve.minus(event.params.amount)
  broadcaster.save()
}

export function withdrawal(event: Withdrawal): void {
  let broadcaster = Broadcaster.load(event.params.sender.toHex())
  broadcaster.deposit = BigInt.fromI32(0)
  broadcaster.reserve = BigInt.fromI32(0)
  broadcaster.save()
}
