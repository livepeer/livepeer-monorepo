/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type ProtocolObj = {}

/** Resolvers */

/**
 * Gets the id for a Round
 * @param {Object} obj
 * @param {string} obj.id - The round number
 * @return {string}
 */
export function id(obj: ProtocolObj): string {
  return 'protocol'
}

/**
 * Gets paused status for the protocol
 * @param {Object} obj
 * @param {string} obj.paused - Whether the protocol is paused
 * @return {boolean}
 */
export function paused(obj: ProtocolObj): string {
  return obj.paused
}

/**
 * Gets total token supply for the protocol
 * @param {Object} obj
 * @param {string} obj.totalTokenSupply - totalTokenSupply for the protocol
 * @return {string}
 */
export function totalTokenSupply(obj: ProtocolObj): string {
  return obj.totalTokenSupply
}

/**
 * Gets total bonded token for the protocol
 * @param {Object} obj
 * @param {string} obj.totalBondedToken - totalBondedToken for the protocol
 * @return {string}
 */
export function totalBondedToken(obj: ProtocolObj): string {
  return obj.totalBondedToken
}

/**
 * Gets target bonding rate for the protocol
 * @param {Object} obj
 * @param {string} obj.targetBondingRate - targetBondingRate for the protocol
 * @return {string}
 */
export function targetBondingRate(obj: ProtocolObj): string {
  return obj.targetBondingRate
}

/**
 * Gets transcoder pool max size for the protocol
 * @param {Object} obj
 * @param {string} obj.transcoderPoolMaxSize - transcoderPoolMaxSize for the protocol
 * @return {string}
 */
export function transcoderPoolMaxSize(obj: ProtocolObj): string {
  return obj.transcoderPoolMaxSize
}
