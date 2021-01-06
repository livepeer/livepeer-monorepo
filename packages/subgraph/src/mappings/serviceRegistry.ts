// Import event types from the registrar contract ABIs
import { ServiceURIUpdate } from '../types/ServiceRegistry/ServiceRegistry'

// Import entity types generated from the GraphQL schema
import { Transaction, ServiceURIUpdateEvent } from '../types/schema'
import {
  createOrLoadRound,
  createOrLoadTranscoder,
  makeEventId,
} from '../../utils/helpers'

export function serviceURIUpdate(event: ServiceURIUpdate): void {
  let round = createOrLoadRound(event.block.number)
  let transcoder = createOrLoadTranscoder(event.params.addr.toHex())
  transcoder.serviceURI = event.params.serviceURI
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

  let serviceURIUpdate = new ServiceURIUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  serviceURIUpdate.transaction = event.transaction.hash.toHex()
  serviceURIUpdate.timestamp = event.block.timestamp.toI32()
  serviceURIUpdate.round = round.id
  serviceURIUpdate.addr = event.params.addr.toHex()
  serviceURIUpdate.serviceURI = event.params.serviceURI
  serviceURIUpdate.save()
}
