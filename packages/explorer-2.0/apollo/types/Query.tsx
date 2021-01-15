const Query = `
type Account {
  id: ID!
  tokenBalance: String
  ethBalance: String
  allowance: String
  pollCreatorAllowance: String
}

type TransactionStatus {
  status: String
}

type ThreeBoxSpace {
  id: ID!
  did: String
  name: String
  website: String
  description: String
  image: String
  addressLinks: [JSON]
  defaultProfile: String
}

type Query {
  account(id: ID!): Account
  getTxReceiptStatus(txHash: String): TransactionStatus
  txPrediction(gasPrice: String!): JSON
  transaction(txHash: String): JSON
  threeBoxSpace(id: ID!): ThreeBoxSpace
  block: JSON
  getChartData: JSON
}
`;

export default Query;
