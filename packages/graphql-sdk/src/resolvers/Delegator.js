/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type DelegatorObj = {
  id: string,
}

/** Resolvers */

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
 * Gets the ENS name for a Delegator
 * @param {Object} obj
 * @param {string} obj.id - The id of the delegator
 */
export async function ensName(obj: DelegatorObj, args, ctx): string {
  const { id } = obj
  return await ctx.livepeer.rpc.getENSName(id)
}

/**
 * Gets the allowance for a Delegator
 * @param {Object} obj
 * @param {DelegatorStatus} obj.allowance - The allowance of the delegator
 * @return {DelegatorStatus}
 */
export function allowance(obj: DelegatorObj): DelegatorStatus {
  return obj.allowance
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
 * Gets the total pending fees for a Delegator
 * @param {Object} obj
 * @param {string} obj.pendingFees - The pendingFees of the delegator
 * @return {string}
 */
export function pendingFees(obj: DelegatorObj): string {
  return obj.pendingFees
}

/**
 * Gets the total pending stake for a Delegator
 * @param {Object} obj
 * @param {string} obj.pendingStake - The pendingStake of the delegator
 * @return {string}
 */
export function pendingStake(obj: DelegatorObj): string {
  return obj.pendingStake
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
 * Gets the status for a Delegator
 * @param {Object} obj
 * @param {DelegatorStatus} obj.status - The status of the delegator
 * @return {DelegatorStatus}
 */
export function status(obj: DelegatorObj): DelegatorStatus {
  return obj.status
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

/**
 * Gets the nextUnbondingLockId for a Delegator
 * @param {Object} obj
 * @param {string} obj.nextUnbondingLockId - The nextUnbondingLockId of the delegator
 * @return {string}
 */
export function nextUnbondingLockId(obj: DelegatorObj): string {
  return obj.nextUnbondingLockId
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
