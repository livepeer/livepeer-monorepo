import { dataSource } from '@graphprotocol/graph-ts'
import { Approval } from '../types/LivepeerToken/LivepeerToken'
import { Delegator, ApprovalEvent } from '../types/schema'
import { getRoundsManagerInstance } from './util'

// Handler for NewRound events
export function approval(event: Approval): void {
  let owner = event.params.owner
  let amount = event.params.value
  let spender = event.params.spender

  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(owner.toHex())
  if (delegator == null) {
    delegator = new Delegator(owner.toHex())
  }

  delegator.allowance = amount
  delegator.save()

  // Store transaction info
  let approvalEvent = new ApprovalEvent(
    event.transaction.hash.toHex() + '-Approval',
  )
  approvalEvent.hash = event.transaction.hash.toHex()
  approvalEvent.blockNumber = event.block.number
  approvalEvent.gasUsed = event.transaction.gasUsed
  approvalEvent.gasPrice = event.transaction.gasPrice
  approvalEvent.timestamp = event.block.timestamp
  approvalEvent.from = event.transaction.from.toHex()
  approvalEvent.to = event.transaction.to.toHex()
  approvalEvent.spender = spender.toHex()
  approvalEvent.round = currentRound.toString()
  approvalEvent.amount = amount
  approvalEvent.delegator = delegator.id
  approvalEvent.save()
}
