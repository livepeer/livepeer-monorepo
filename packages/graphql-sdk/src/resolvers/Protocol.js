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
