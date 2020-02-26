import { dataSource } from '@graphprotocol/graph-ts'
import { Approval as ApprovalEvent } from '../types/LivepeerToken/LivepeerToken'
import { Delegator, Approval } from '../types/schema'
import { getRoundsManagerInstance, makeEventId } from './util'

// Handler for NewRound events
export function approval(event: ApprovalEvent): void {
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
  let approval = new Approval(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  approval.hash = event.transaction.hash.toHex()
  approval.blockNumber = event.block.number
  approval.gasUsed = event.transaction.gasUsed
  approval.gasPrice = event.transaction.gasPrice
  approval.timestamp = event.block.timestamp
  approval.from = event.transaction.from.toHex()
  approval.to = event.transaction.to.toHex()
  approval.spender = spender.toHex()
  approval.round = currentRound.toString()
  approval.amount = amount
  approval.delegator = delegator.id
  approval.save()
}
