/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type RoundObj = {}

/** Resolvers */

/**
 * Gets the id for a Round
 * @param {Object} obj
 * @param {string} obj.id - The round number
 * @return {string}
 */
export function id(obj: RoundObj): string {
  return obj.id
}

/**
 * Gets the initialized status for a Round
 * @param {Object} obj
 * @param {string} obj.initialized - Whether the round was initialized
 * @return {boolean}
 */
export function initialized(obj: RoundObj): string {
  return obj.initialized
}

/**
 * Gets the lastInitializedRound prior to this one
 * @param {Object} obj
 * @param {string} obj.lastInitializedRound - The round's last initialized round
 * @return {string}
 */
export function lastInitializedRound(obj: RoundObj): string {
  return obj.lastInitializedRound
}

/**
 * Gets the length for a Round
 * @param {Object} obj
 * @param {string} obj.length - The round block length
 * @return {string}
 */
export function length(obj: RoundObj): string {
  return obj.length
}

/**
 * Gets the startBlock for a Round
 * @param {Object} obj
 * @param {string} obj.startBlock - The round start block
 * @return {string}
 */
export function startBlock(obj: RoundObj): string {
  return obj.startBlock
}
