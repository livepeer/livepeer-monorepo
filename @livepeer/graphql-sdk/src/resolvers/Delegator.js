/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type DelegatorObj = {
  id: string,
}

/** Resolvers */

// /**
//  * Resolves types for the Delegator interface
//  * @param {Object} obj
//  * @param {string} obj.type - The type of the Delegator
//  */
// export function __resolveType(obj: DelegatorObj): Boolean {
//   return obj.type || 'DelegatorType'
// }

/**
 * Gets the id for a Delegator
 * @param {Object} obj
 * @param {string} obj.id - The id of the delegator
 * @return {string}
 */
export function id(obj: DelegatorObj): string {
  return obj.id
}

/**
 * Gets the status for a Delegator
 * @param {Object} obj
 * @param {DelegatorStatus} obj.status - The status of the delegator
 * @return {DelegatorStatus}
 */
export function status(obj: DelegatorObj): DelegatorStatus {
  return obj.status
}

/**
 * Gets the bondedAmount for a Delegator
 * @param {Object} obj
 * @param {string} obj.bondedAmount - The bondedAmount of the delegator
 * @return {string}
 */
export function bondedAmount(obj: DelegatorObj): string {
  return obj.bondedAmount
}

/**
 * Gets the fees for a Delegator
 * @param {Object} obj
 * @param {string} obj.fees - The fees of the delegator
 * @return {string}
 */
export function fees(obj: DelegatorObj): string {
  return obj.fees
}

/**
 * Gets the delegateAddress for a Delegator
 * @param {Object} obj
 * @param {string} obj.delegateAddress - The delegateAddress of the delegator
 * @return {string}
 */
export function delegateAddress(obj: DelegatorObj): string {
  return obj.delegateAddress
}

/**
 * Gets the delegatedAmount for a Delegator
 * @param {Object} obj
 * @param {string} obj.delegatedAmount - The delegatedAmount of the delegator
 * @return {string}
 */
export function delegatedAmount(obj: DelegatorObj): string {
  return obj.delegatedAmount
}

/**
 * Gets the lastClaimRound for a Delegator
 * @param {Object} obj
 * @param {string} obj.lastClaimRound - The lastClaimRound of the delegator
 * @return {string}
 */
export function lastClaimRound(obj: DelegatorObj): string {
  return obj.lastClaimRound
}

/**
 * Gets the startRound for a Delegator
 * @param {Object} obj
 * @param {string} obj.startRound - The startRound of the delegator
 * @return {string}
 */
export function startRound(obj: DelegatorObj): string {
  return obj.startRound
}

/**
 * Gets the withdrawRound for a Delegator
 * @param {Object} obj
 * @param {string} obj.withdrawRound - The withdrawRound of the delegator
 * @return {string}
 */
export function withdrawRound(obj: DelegatorObj): string {
  return obj.withdrawRound
}

// /**
//  * Gets the delegate for a Delegator
//  * @param {Object} obj
//  * @param {string} obj.delegate - The delegate of the delegator
//  * @return {Account}
//  */
// export function delegate(obj: DelegatorObj): Account {
//   return obj.delegate
// }
