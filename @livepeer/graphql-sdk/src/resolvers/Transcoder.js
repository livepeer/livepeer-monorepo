/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type TranscoderObj = {
  id: string,
}

/** Resolvers */

// /**
//  * Resolves types for the Transcoder interface
//  * @param {Object} obj
//  * @param {string} obj.type - The type of the Transcoder
//  */
// export function __resolveType(obj: TranscoderObj): Boolean {
//   return obj.type || 'TranscoderType'
// }

/**
 * Gets the id for a Transcoder
 * @param {Object} obj
 * @param {string} obj.id - The id of the transcoder
 * @return {string}
 */
export function id(obj: TranscoderObj): string {
  return obj.id
}

/**
 * Gets the status for a Transcoder
 * @param {Object} obj
 * @param {TranscoderStatus} obj.status - The status of the transcoder
 * @return {TranscoderStatus}
 */
export function status(obj: TranscoderObj): TranscoderStatus {
  return obj.status
}

/**
 * Gets the active for a Transcoder
 * @param {Object} obj
 * @param {string} obj.active - The active of the transcoder
 * @return {string}
 */
export function active(obj: TranscoderObj): string {
  return obj.active
}

/**
 * Gets the lastRewardRound for a Transcoder
 * @param {Object} obj
 * @param {string} obj.lastRewardRound - The lastRewardRound of the transcoder
 * @return {string}
 */
export function lastRewardRound(obj: TranscoderObj): string {
  return obj.lastRewardRound
}

/**
 * Gets the blockRewardCut for a Transcoder
 * @param {Object} obj
 * @param {string} obj.blockRewardCut - The blockRewardCut of the transcoder
 * @return {string}
 */
export function blockRewardCut(obj: TranscoderObj): string {
  return obj.blockRewardCut
}

/**
 * Gets the feeShare for a Transcoder
 * @param {Object} obj
 * @param {string} obj.feeShare - The feeShare of the transcoder
 * @return {string}
 */
export function feeShare(obj: TranscoderObj): string {
  return obj.feeShare
}

/**
 * Gets the pricePerSegment for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pricePerSegment - The pricePerSegment of the transcoder
 * @return {string}
 */
export function pricePerSegment(obj: TranscoderObj): string {
  return obj.pricePerSegment
}

/**
 * Gets the pendingBlockRewardCut for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pendingBlockRewardCut - The pendingBlockRewardCut of the transcoder
 * @return {string}
 */
export function pendingBlockRewardCut(obj: TranscoderObj): string {
  return obj.pendingBlockRewardCut
}

/**
 * Gets the pendingFeeShare for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pendingFeeShare - The pendingFeeShare of the transcoder
 * @return {string}
 */
export function pendingFeeShare(obj: TranscoderObj): string {
  return obj.pendingFeeShare
}

/**
 * Gets the pendingPricePerSegment for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pendingPricePerSegment - The pendingPricePerSegment of the transcoder
 * @return {string}
 */
export function pendingPricePerSegment(obj: TranscoderObj): string {
  return obj.pendingPricePerSegment
}
