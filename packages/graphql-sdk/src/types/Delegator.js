import DelegatorStatus from './DelegatorStatus'

const Delegator = `

"Users that bond tokens and delegate their bonded stake to other users, usually registered transcoders in exchange for shared rewards and fees."
type Delegator {

  "The ETH address of a delegator"
  id: String!

  "The delegator's token allowance"
  allowance: String!
  
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

  "The total amount of ETH the delegator has earned through the current round"
  pendingFees: String!

  "The total amount of tokens the delegator has earned through the current round"
  pendingStake: String!

  "The round the delegator becomes bonded and delegated to its delegate"
  startRound: String!
  
  "The status of a delegator"
  status: DelegatorStatus!

  "The round the delegator can withdraw its stake."
  withdrawRound: String!

}`

export default () => [Delegator, DelegatorStatus]
