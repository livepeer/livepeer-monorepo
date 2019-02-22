const Mutation = `

"Contains all protocol transaction queries"
type Mutation {

  "Approve an amount for an ERC20 token transfer"
  approve(type: String!, amount: String!): Boolean

  "Submits a bond transaction for a previously approved amount"
  bond(to: String!, amount: String!): JSON

  "Claims earnings from your last claim round through specified round"
  claimEarnings(endRound: String!): Boolean

  "Sends a transaction based on an input object"
  sendTransaction(options: JSON!): Boolean

  "Submits a bond transaction for a previously approved amount"
  unbond(amount: String!): JSON

  "Rebond tokens for an unbonding lock to a delegator's current delegate while a delegator is in the Bonded or Pending states"
  rebond(unbondingLockId: Int!): JSON

  "Rebond tokens for an unbonding lock to a delegate while a delegator is in the Unbonded state "
  rebondFromUnbonded(delegate: String!, unbondingLockId: Int!): JSON

  "Submits a round initialization transaction"
  initializeRound: JSON

}`

export default () => [Mutation]
