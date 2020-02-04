import { WinningTicketRedeemed } from '../types/TicketBroker/TicketBroker'
import { WinningTicket, Stat, Transcoder } from '../types/schema'
import { BigInt } from '@graphprotocol/graph-ts'

export function winningTicketRedeemed(event: WinningTicketRedeemed): void {
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

  // Update accrued fees for this transcoder
  let transcoder = Transcoder.load(event.params.recipient.toHex())
  if (transcoder == null) {
    transcoder = new Transcoder(event.params.recipient.toHex())
  }
  transcoder.accruedFees = transcoder.accruedFees.plus(event.params.faceValue)
  transcoder.save()

  // Update total network fees and total network total tickets
  let stat = Stat.load('0')
  if (stat == null) {
    stat = new Stat('0')
  }
  stat.totalFees = stat.totalFees.plus(event.params.faceValue)
  stat.totalTickets = stat.totalTickets.plus(BigInt.fromI32(1))
  stat.save()
}
