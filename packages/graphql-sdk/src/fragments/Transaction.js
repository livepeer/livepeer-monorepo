export default `
fragment TransactionFragment on Transaction {
  id
  blockNumber
  timeStamp
  nonce
  blockHash
  transactionIndex
  from
  to
  value
  gas
  gasPrice
  isError
  status
  input
  contractAddress
  cumulativeGasUsed
  gasUsed
  confirmations
  contract
  method
  params
}`
