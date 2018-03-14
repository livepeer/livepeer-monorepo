const Mutation = `

"Contains all protocol transaction queries"
type Mutation {

  "Approve an amount for an ERC20 token transfer"
  approve(type: String!, amount: String!): Boolean

  "Submits a bond transaction for a previously approved amount"
  bond(to: String!, amount: String!): Boolean

  "Claims earnings from your last claim round through specified round"
  claimEarnings(endRound: String!): Boolean

  "Submits a bond transaction for a previously approved amount"
  unbond: Boolean

}`

export default () => [Mutation]
