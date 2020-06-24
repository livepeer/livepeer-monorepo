const Mutation = `
scalar JSON
scalar JSONObject

"Contains all protocol transaction queries"
type Mutation {
  
  "Approve an amount for an ERC20 token transfer"
  approve(type: String!, amount: String!): JSON
  
  "Submits a bond transaction for a previously approved amount"
  bond(amount: String!, to: String!, oldDelegateNewPosPrev: String!, oldDelegateNewPosNext: String!, currDelegateNewPosPrev: String!, currDelegateNewPosNext: String!): JSON
  
  "Claims earnings from your last claim round through specified round"
  batchClaimEarnings(lastClaimRound: String!, endRound: String!): JSON
  
  "Submits a bond transaction for a previously approved amount"
  unbond(amount: String!, newPosPrev: String!, newPosNext: String!): JSON
  
  "Withdraws unbonded stake into account wallet"
  withdrawStake(unbondingLockId: Int!): JSON

  "Withdraws pending fees into account wallet"
  withdrawFees: JSON
  
  "Rebond tokens for an unbonding lock to a delegator's current delegate while a delegator is in the Bonded or Pending states"
  rebond(unbondingLockId: Int!, newPosPrev: String!, newPosNext: String!): JSON
  
  "Rebond tokens for an unbonding lock to a delegate while a delegator is in the Unbonded state "
  rebondFromUnbonded(delegate: String!, unbondingLockId: Int!, newPosPrev: String!, newPosNext: String!): JSON
  
  "Submits a round initialization transaction"
  initializeRound: JSON

  "Creates a poll"
  createPoll(proposal: String!): JSON

  "Votes on a poll"
  vote(pollAddress: String!, choiceId: Int!): JSON

  "Update an account 3box space"
  updateProfile(name: String, website: String, description: String, image: String, proof: JSON, defaultProfile: String): ThreeBoxSpace

  "Unlink an external account from a user's 3box"
  removeAddressLink(address: String): Boolean
}`

export default Mutation
