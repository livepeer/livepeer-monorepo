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
  paused: Boolean
}

type TransactionStatus {
  status: String
}

type Query {
  account(id: ID!): Account
  protocol: Protocol
  getTxReceiptStatus(txHash: String!): TransactionStatus
}
`

export default Query
