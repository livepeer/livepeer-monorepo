import DelegatorStatus from './DelegatorStatus'

const Delegator = `

"Users that bond tokens and delegate their bonded stake to other users, usually registered transcoders in exchange for shared rewards and fees."
type Delegator {

  "The ETH address of a delegator"
  id: String!

  "The status of a delegator"
  status: DelegatorStatus!

  "The amount of Livepeer Token a delegator has bonded"
  bondedAmount: String!

  "The amount of fees a delegator has collected"
  fees: String!

  "The ETH address of the delegate (the one whom the delegator has bonded to)"
  delegateAddress: String!

  "The amount of Livepeer Token the delegator has delegated"
  delegatedAmount: String!

  "The last round that the delegator claimed reward and fee pool shares"
  lastClaimRound: String!

  "The round the delegator becomes bonded and delegated to its delegate"
  startRound: String!

  "The round the delegator can withdraw its stake."
  withdrawRound: String!

}`

export default () => [Delegator, DelegatorStatus]
