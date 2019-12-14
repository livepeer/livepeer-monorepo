import { Address } from '@graphprotocol/graph-ts'
import { LivepeerToken, Approval } from '../types/LivepeerToken/LivepeerToken'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'
import { Delegator, ApprovalEvent } from '../types/schema'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('572d1591bD41f50130FD0212058eAe34F1B17290')
)

// Handler for NewRound events
export function approval(event: Approval): void {
  let livepeerToken = LivepeerToken.bind(event.address)
  let owner = event.params.owner
  let spender = event.params.spender
  let currentRound = roundsManager.currentRound()

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(owner.toHex())
  if (delegator == null) {
    delegator = new Delegator(owner.toHex())
  }

  let allowance = livepeerToken.allowance(owner, spender)
  delegator.allowance = allowance
  delegator.save()

  // Store transaction info
  let approvalEvent = new ApprovalEvent(
    event.transaction.hash.toHex() + '-Approval'
  )
  approvalEvent.hash = event.transaction.hash.toHex()
  approvalEvent.blockNumber = event.block.number
  approvalEvent.gasUsed = event.transaction.gasUsed
  approvalEvent.gasPrice = event.transaction.gasPrice
  approvalEvent.timestamp = event.block.timestamp
  approvalEvent.from = event.transaction.from.toHex()
  approvalEvent.to = event.transaction.to.toHex()
  approvalEvent.round = currentRound.toString()
  approvalEvent.amount = allowance
  approvalEvent.delegator = delegator.id
  approvalEvent.save()
}
