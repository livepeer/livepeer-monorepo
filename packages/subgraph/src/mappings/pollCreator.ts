import { DataSourceContext, Address, dataSource } from '@graphprotocol/graph-ts'
import { PollCreated as PollCreatedEvent } from '../types/PollCreator/PollCreator'
import { Protocol, Poll, PollCreated } from '../types/schema'
import { makeEventId, getBondingManagerAddress } from '../../utils/helpers'
import {
  Poll as PollTemplate,
  BondingManager as BondingManagerTemplate,
} from '../types/templates'

export function pollCreated(event: PollCreatedEvent): void {
  let poll = new Poll(event.params.poll.toHex())
  poll.tally = event.params.poll.toHex()
  poll.proposal = event.params.proposal
  poll.endBlock = event.params.endBlock
  poll.quorum = event.params.quorum
  poll.threshold = event.params.threshold
  poll.save()

  // Instantiate data source template
  PollTemplate.create(event.params.poll)

  // Save event data
  let protocol = Protocol.load('0') || new Protocol('0')
  let pollCreated = new PollCreated(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  pollCreated.hash = event.transaction.hash.toHex()
  pollCreated.blockNumber = event.block.number
  pollCreated.gasUsed = event.transaction.gasUsed
  pollCreated.gasPrice = event.transaction.gasPrice
  pollCreated.timestamp = event.block.timestamp
  pollCreated.from = event.transaction.from.toHex()
  pollCreated.to = event.transaction.to.toHex()
  pollCreated.round = protocol.currentRound
  pollCreated.poll = event.params.poll.toHex()
  pollCreated.proposal = event.params.proposal
  pollCreated.endBlock = event.params.endBlock
  pollCreated.quorum = event.params.quorum
  pollCreated.threshold = event.params.threshold
  pollCreated.save()

  // Watch for events specified in BondingManagerTemplate and trigger handlers
  // with this context
  let context = new DataSourceContext()
  context.setString('poll', event.params.poll.toHex())
  let bondingManagerAddress = getBondingManagerAddress(dataSource.network())
  BondingManagerTemplate.createWithContext(
    Address.fromString(bondingManagerAddress),
    context,
  )
}
