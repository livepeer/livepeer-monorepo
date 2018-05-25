/** Typedefs */

type GQLContext = {
  livepeer: Object,
}

type TransactionObj = {
  id: string,
  blockNumber: string,
  timeStamp: string,
  hash: string,
  nonce: string,
  blockHash: string,
  transactionIndex: string,
  from: string,
  to: string,
  value: string,
  gas: string,
  gasPrice: string,
  isError: string,
  status: string,
  input: string,
  contractAddress: string,
  cumulativeGasUsed: string,
  gasUsed: string,
  confirmations: string,
  contract: string,
  method: string,
  params: {},
}

/** Resolvers */

/**
 * Gets the id for a Transaction
 * @param {Object} obj
 * @param {string} obj.id - The id of the transaction
 * @return {string}
 */
export function id(obj: TransactionObj): string {
  return obj.id
}

/**
 * Gets the blockNumber for a Transaction
 * @param {Object} obj
 * @param {string} obj.blockNumber - The blockNumber of the transaction
 * @return {string}
 */
export function blockNumber(obj: TransactionObj): string {
  return obj.blockNumber
}

/**
 * Gets the timeStamp for a Transaction
 * @param {Object} obj
 * @param {string} obj.timeStamp - The timeStamp of the transaction
 * @return {string}
 */
export function timeStamp(obj: TransactionObj): string {
  return obj.timeStamp
}

/**
 * Gets the nonce for a Transaction
 * @param {Object} obj
 * @param {string} obj.nonce - The nonce of the transaction
 * @return {string}
 */
export function nonce(obj: TransactionObj): string {
  return obj.nonce
}

/**
 * Gets the blockHash for a Transaction
 * @param {Object} obj
 * @param {string} obj.blockHash - The blockHash of the transaction
 * @return {string}
 */
export function blockHash(obj: TransactionObj): string {
  return obj.blockHash
}

/**
 * Gets the transactionIndex for a Transaction
 * @param {Object} obj
 * @param {string} obj.transactionIndex - The transactionIndex of the transaction
 * @return {string}
 */
export function transactionIndex(obj: TransactionObj): string {
  return obj.transactionIndex
}

/**
 * Gets the from for a Transaction
 * @param {Object} obj
 * @param {string} obj.from - The from of the transaction
 * @return {string}
 */
export function from(obj: TransactionObj): string {
  return obj.from
}

/**
 * Gets the to for a Transaction
 * @param {Object} obj
 * @param {string} obj.to - The to of the transaction
 * @return {string}
 */
export function to(obj: TransactionObj): string {
  return obj.to
}

/**
 * Gets the value for a Transaction
 * @param {Object} obj
 * @param {string} obj.value - The value of the transaction
 * @return {string}
 */
export function value(obj: TransactionObj): string {
  return obj.value
}

/**
 * Gets the gas for a Transaction
 * @param {Object} obj
 * @param {string} obj.gas - The gas of the transaction
 * @return {string}
 */
export function gas(obj: TransactionObj): string {
  return obj.gas
}

/**
 * Gets the gasPrice for a Transaction
 * @param {Object} obj
 * @param {string} obj.gasPrice - The gasPrice of the transaction
 * @return {string}
 */
export function gasPrice(obj: TransactionObj): string {
  return obj.gasPrice
}

/**
 * Gets the isError for a Transaction
 * @param {Object} obj
 * @param {string} obj.isError - The isError of the transaction
 * @return {string}
 */
export function isError(obj: TransactionObj): string {
  return obj.isError
}

/**
 * Gets the status for a Transaction
 * @param {Object} obj
 * @param {string} obj.status - The status of the transaction
 * @return {string}
 */
export function status(obj: TransactionObj): string {
  return obj.status
}

/**
 * Gets the input for a Transaction
 * @param {Object} obj
 * @param {string} obj.input - The input of the transaction
 * @return {string}
 */
export function input(obj: TransactionObj): string {
  return obj.input
}

/**
 * Gets the contractAddress for a Transaction
 * @param {Object} obj
 * @param {string} obj.contractAddress - The contractAddress of the transaction
 * @return {string}
 */
export function contractAddress(obj: TransactionObj): string {
  return obj.contractAddress
}

/**
 * Gets the cumulativeGasUsed for a Transaction
 * @param {Object} obj
 * @param {string} obj.cumulativeGasUsed - The cumulativeGasUsed of the transaction
 * @return {string}
 */
export function cumulativeGasUsed(obj: TransactionObj): string {
  return obj.cumulativeGasUsed
}

/**
 * Gets the gasUsed for a Transaction
 * @param {Object} obj
 * @param {string} obj.gasUsed - The gasUsed of the transaction
 * @return {string}
 */
export function gasUsed(obj: TransactionObj): string {
  return obj.gasUsed
}

/**
 * Gets the confirmations for a Transaction
 * @param {Object} obj
 * @param {string} obj.confirmations - The confirmations of the transaction
 * @return {string}
 */
export function confirmations(obj: TransactionObj): string {
  return obj.confirmations
}

/**
 * Gets the contract for a Transaction
 * @param {Object} obj
 * @param {string} obj.contract - The contract of the transaction
 * @return {string}
 */
export function contract(obj: TransactionObj): string {
  return obj.contract
}

/**
 * Gets the method for a Transaction
 * @param {Object} obj
 * @param {string} obj.method - The method of the transaction
 * @return {string}
 */
export function method(obj: TransactionObj): string {
  return obj.method
}

/**
 * Gets the params for a Transaction
 * @param {Object} obj
 * @param {string} obj.params - The params of the transaction
 * @return {[string|boolean]}
 */
export function params(obj: TransactionObj): Array<string | boolean> {
  return obj.params
}
