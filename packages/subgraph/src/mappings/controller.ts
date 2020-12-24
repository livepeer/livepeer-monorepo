import {
  Transaction,
  Protocol,
  PauseEvent,
  UnpauseEvent,
} from '../types/schema'
import { createOrLoadRound, makeEventId } from '../../utils/helpers'
import { Pause, Unpause } from '../types/Controller/Controller'

export function pause(event: Pause): void {
  let round = createOrLoadRound(event.block.number)
  let protocol = Protocol.load('0')
  protocol.paused = true
  protocol.save()

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

  let pause = new PauseEvent(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  pause.transaction = event.transaction.hash.toHex()
  pause.timestamp = event.block.timestamp.toI32()
  pause.round = round.id
  pause.save()
}

export function unpause(event: Unpause): void {
  let round = createOrLoadRound(event.block.number)
  let protocol = Protocol.load('0')
  protocol.paused = false
  protocol.save()

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

  let unpause = new UnpauseEvent(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  unpause.transaction = event.transaction.hash.toHex()
  unpause.timestamp = event.block.timestamp.toI32()
  unpause.round = round.id
  unpause.save()
}
