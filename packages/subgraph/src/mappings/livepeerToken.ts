import { Address } from '@graphprotocol/graph-ts'
import { LivepeerToken, Approval } from '../types/LivepeerToken/LivepeerToken'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'
import { Delegator, ApprovalTransaction } from '../types/schema'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
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
  let approvalTransaction = new ApprovalTransaction(
    event.transaction.hash.toHex()
  )
  approvalTransaction.blockNumber = event.block.number
  approvalTransaction.gasUsed = event.transaction.gasUsed
  approvalTransaction.gasPrice = event.transaction.gasPrice
  approvalTransaction.timestamp = event.block.timestamp
  approvalTransaction.from = event.transaction.from.toHex()
  approvalTransaction.to = event.transaction.to.toHex()
  approvalTransaction.round = currentRound.toString()
  approvalTransaction.amount = allowance
  approvalTransaction.delegator = delegator.id
  approvalTransaction.save()
}
