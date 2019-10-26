const Query = `
type Account {
  id: ID!
  tokenBalance: String
  ethBalance: String
  allowance: String
}
type Protocol {
  inflation: String
  inflationChange: String
  totalTokenSupply: String
  totalBondedToken: String
}
type Query {
  account(id: ID!): Account
  protocol: Protocol
}
`

export default Query
