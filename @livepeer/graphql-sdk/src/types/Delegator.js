import DelegatorStatus from './DelegatorStatus'

const Delegator = `
type Delegator {
  id: String!
  status: DelegatorStatus!
  bondedAmount: String!
  fees: String!
  delegateAddress: String!
  delegatedAmount: String!
  lastClaimRound: String!
  startRound: String!
  withdrawRound: String!
}
`

export default () => [Delegator, DelegatorStatus]
