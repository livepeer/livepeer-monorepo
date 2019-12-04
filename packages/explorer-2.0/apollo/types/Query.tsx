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

type ThreeBoxSpace {
  id: ID!
  name: String
  url: String
  description: String
  image: String
  defaultProfile: String
}

type ThreeBox {
  id: ID!
  did: String
  addressLinks: [JSON]
}

type Query {
  account(id: ID!): Account
  protocol: Protocol
  getTxReceiptStatus(txHash: String!): TransactionStatus
  threeBox(id: ID!): ThreeBox
  threeBoxSpace(id: ID!): ThreeBoxSpace
}
`

export default Query
