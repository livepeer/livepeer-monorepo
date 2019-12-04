const Mutation = `
scalar JSON
scalar JSONObject

"Contains all protocol transaction queries"
type Mutation {
  
  "Approve an amount for an ERC20 token transfer"
  approve(type: String!, amount: String!): JSON
  
  "Submits a bond transaction for a previously approved amount"
  bond(to: String!, amount: String!): JSON
  
  "Claims earnings from your last claim round through specified round"
  batchClaimEarnings(lastClaimRound: String!, endRound: String!): JSON
  
  "Submits a bond transaction for a previously approved amount"
  unbond(amount: String!): JSON
  
  "Withdraws unbonded stake into account wallet"
  withdrawStake(unbondingLockId: Int!): JSON
  
  "Rebond tokens for an unbonding lock to a delegator's current delegate while a delegator is in the Bonded or Pending states"
  rebond(unbondingLockId: Int!): JSON
  
  "Rebond tokens for an unbonding lock to a delegate while a delegator is in the Unbonded state "
  rebondFromUnbonded(delegate: String!, unbondingLockId: Int!): JSON
  
  "Submits a round initialization transaction"
  initializeRound: JSON

  "Update an account 3box space"
  updateProfile(name: String, url: String, description: String, image: String, proof: JSON, defaultProfile: String): ThreeBoxSpace

  "Unlink an external account from a user's 3box"
  removeAddressLink(address: String): Boolean
}`

export default Mutation
