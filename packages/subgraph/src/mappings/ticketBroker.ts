import {
  WinningTicketRedeemed as WinningTicketRedeemedEvent,
  ReserveFunded as ReserveFundedEvent,
  DepositFunded as DepositFundedEvent,
  ReserveClaimed as ReserveClaimedEvent,
  Withdrawal as WithdrawalEvent,
} from '../types/TicketBroker/TicketBroker'
import {
  WinningTicketRedeemed,
  Protocol,
  Transcoder,
  Broadcaster,
  Round,
  ReserveFunded,
  ReserveClaimed,
  DepositFunded,
  Withdrawal,
} from '../types/schema'
import { BigInt, dataSource } from '@graphprotocol/graph-ts'
import { getRoundsManagerInstance, makeEventId } from './util'

export function winningTicketRedeemed(event: WinningTicketRedeemedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let round = Round.load(protocol.currentRound)
  let winningTicketRedeemed = new WinningTicketRedeemed(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  winningTicketRedeemed.hash = event.transaction.hash.toHex()
  winningTicketRedeemed.blockNumber = event.block.number
  winningTicketRedeemed.gasUsed = event.transaction.gasUsed
  winningTicketRedeemed.gasPrice = event.transaction.gasPrice
  winningTicketRedeemed.timestamp = event.block.timestamp
  winningTicketRedeemed.from = event.transaction.from.toHex()
  winningTicketRedeemed.to = event.transaction.to.toHex()
  winningTicketRedeemed.round = protocol.currentRound
  winningTicketRedeemed.sender = event.params.sender.toHex()
  winningTicketRedeemed.recipient = event.params.recipient.toHex()
  winningTicketRedeemed.faceValue = event.params.faceValue
  winningTicketRedeemed.winProb = event.params.winProb
  winningTicketRedeemed.senderNonce = event.params.senderNonce
  winningTicketRedeemed.recipientRand = event.params.recipientRand
  winningTicketRedeemed.auxData = event.params.auxData
  winningTicketRedeemed.save()

  // Update broadcaster's deposit & reserve
  let broadcaster = Broadcaster.load(event.params.sender.toHex())
  if (event.params.faceValue.gt(broadcaster.deposit as BigInt)) {
    broadcaster.deposit = BigInt.fromI32(0)
  } else {
    broadcaster.deposit = broadcaster.deposit.minus(event.params.faceValue)
  }

  // Update accrued fees for this transcoder
  let transcoder =
    Transcoder.load(event.params.recipient.toHex()) ||
    new Transcoder(event.params.recipient.toHex())
  transcoder.totalGeneratedFees = transcoder.totalGeneratedFees.plus(
    event.params.faceValue,
  )
  transcoder.save()

  // Update total protocol fees and total winning tickets
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

export function depositFunded(event: DepositFundedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let broadcaster =
    Broadcaster.load(event.params.sender.toHex()) ||
    new Broadcaster(event.params.sender.toHex())
  broadcaster.deposit = broadcaster.deposit.plus(event.params.amount)
  broadcaster.save()

  let depositFunded = new DepositFunded(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  depositFunded.hash = event.transaction.hash.toHex()
  depositFunded.blockNumber = event.block.number
  depositFunded.gasUsed = event.transaction.gasUsed
  depositFunded.gasPrice = event.transaction.gasPrice
  depositFunded.timestamp = event.block.timestamp
  depositFunded.from = event.transaction.from.toHex()
  depositFunded.to = event.transaction.to.toHex()
  depositFunded.round = protocol.currentRound
  depositFunded.sender = event.params.sender.toHex()
  depositFunded.amount = event.params.amount
  depositFunded.save()
}

export function reserveFunded(event: ReserveFundedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let broadcaster =
    Broadcaster.load(event.params.reserveHolder.toHex()) ||
    new Broadcaster(event.params.reserveHolder.toHex())

  broadcaster.reserve = broadcaster.reserve.plus(event.params.amount)
  broadcaster.save()

  let reserveFunded = new ReserveFunded(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  reserveFunded.hash = event.transaction.hash.toHex()
  reserveFunded.blockNumber = event.block.number
  reserveFunded.gasUsed = event.transaction.gasUsed
  reserveFunded.gasPrice = event.transaction.gasPrice
  reserveFunded.timestamp = event.block.timestamp
  reserveFunded.from = event.transaction.from.toHex()
  reserveFunded.to = event.transaction.to.toHex()
  reserveFunded.round = protocol.currentRound
  reserveFunded.reserveHolder = event.params.reserveHolder.toHex()
  reserveFunded.amount = event.params.amount
  reserveFunded.save()
}

export function reserveClaimed(event: ReserveClaimedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let broadcaster = Broadcaster.load(event.params.reserveHolder.toHex())
  broadcaster.reserve = broadcaster.reserve.minus(event.params.amount)
  broadcaster.save()

  let reserveClaimed = new ReserveClaimed(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  reserveClaimed.hash = event.transaction.hash.toHex()
  reserveClaimed.blockNumber = event.block.number
  reserveClaimed.gasUsed = event.transaction.gasUsed
  reserveClaimed.gasPrice = event.transaction.gasPrice
  reserveClaimed.timestamp = event.block.timestamp
  reserveClaimed.from = event.transaction.from.toHex()
  reserveClaimed.to = event.transaction.to.toHex()
  reserveClaimed.round = protocol.currentRound
  reserveClaimed.reserveHolder = event.params.reserveHolder.toHex()
  reserveClaimed.claimant = event.params.claimant.toHex()
  reserveClaimed.amount = event.params.amount
  reserveClaimed.save()
}

export function withdrawal(event: WithdrawalEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let broadcaster = Broadcaster.load(event.params.sender.toHex())
  broadcaster.deposit = BigInt.fromI32(0)
  broadcaster.reserve = BigInt.fromI32(0)
  broadcaster.save()

  let withdrawal = new Withdrawal(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  withdrawal.hash = event.transaction.hash.toHex()
  withdrawal.blockNumber = event.block.number
  withdrawal.gasUsed = event.transaction.gasUsed
  withdrawal.gasPrice = event.transaction.gasPrice
  withdrawal.timestamp = event.block.timestamp
  withdrawal.from = event.transaction.from.toHex()
  withdrawal.to = event.transaction.to.toHex()
  withdrawal.round = protocol.currentRound
  withdrawal.sender = event.params.sender.toHex()
  withdrawal.deposit = event.params.deposit
  withdrawal.reserve = event.params.reserve
  withdrawal.save()
}
