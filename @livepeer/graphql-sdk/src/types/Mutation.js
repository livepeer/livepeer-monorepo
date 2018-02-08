const Mutation = `

"Contains all protocol transaction queries"
type Mutation {

  "Approve an amount for an ERC20 token transfer"
  approve(type: String!, amount: String!): Boolean

  "Submits a bond transaction for a previously approved amount"
  bondToken(to: String!, amount: String!): Boolean

}`

export default () => [Mutation]
