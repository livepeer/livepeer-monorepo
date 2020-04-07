import { Protocol, Pause, Unpause } from '../types/schema'
import { makeEventId } from './util'
import {
  Pause as PauseEvent,
  Unpause as UnpauseEvent,
} from '../types/Controller/Controller'

export function pause(event: PauseEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  protocol.paused = true
  protocol.save()

  let pause = new Pause(makeEventId(event.transaction.hash, event.logIndex))
  pause.hash = event.transaction.hash.toHex()
  pause.blockNumber = event.block.number
  pause.gasUsed = event.transaction.gasUsed
  pause.gasPrice = event.transaction.gasPrice
  pause.timestamp = event.block.timestamp
  pause.from = event.transaction.from.toHex()
  pause.to = event.transaction.to.toHex()
  pause.round = protocol.currentRound
  pause.save()
}

export function unpause(event: UnpauseEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  protocol.paused = false
  protocol.save()

  let unpause = new Unpause(makeEventId(event.transaction.hash, event.logIndex))
  unpause.hash = event.transaction.hash.toHex()
  unpause.blockNumber = event.block.number
  unpause.gasUsed = event.transaction.gasUsed
  unpause.gasPrice = event.transaction.gasPrice
  unpause.timestamp = event.block.timestamp
  unpause.from = event.transaction.from.toHex()
  unpause.to = event.transaction.to.toHex()
  unpause.round = protocol.currentRound
  unpause.save()
}
