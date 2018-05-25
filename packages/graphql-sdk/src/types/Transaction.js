const Transaction = `
scalar JSON

"An Ethereum transaction receipt"
type Transaction {

  "The transaction hash"
  id: String!

  blockNumber: String!

  timeStamp: String!

  nonce: String!

  blockHash: String!

  transactionIndex: String!

  from: String!

  to: String!

  value: String!

  gas: String!

  gasPrice: String!

  isError: String!

  status: String!

  input: String!

  contractAddress: String!

  cumulativeGasUsed: String!

  gasUsed: String!

  confirmations: String!

  contract: String!

  method: String!

  params: JSON!

}`

export default () => [Transaction]
