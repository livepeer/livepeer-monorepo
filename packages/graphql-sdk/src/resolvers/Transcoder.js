/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type TranscoderObj = {
  id: string,
}

/** Resolvers */

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
 * Gets the rewardCut for a Transcoder
 * @param {Object} obj
 * @param {string} obj.rewardCut - The rewardCut of the transcoder
 * @return {string}
 */
export function rewardCut(obj: TranscoderObj): string {
  return obj.rewardCut
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
 * Gets the pendingRewardCut for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pendingRewardCut - The pendingRewardCut of the transcoder
 * @return {string}
 */
export function pendingRewardCut(obj: TranscoderObj): string {
  return obj.pendingRewardCut
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

/**
 * Gets the totalStake for a Transcoder
 * @param {Object} obj
 * @param {string} obj.totalStake - The totalStake of the transcoder
 * @return {string}
 */
export function totalStake(obj: TranscoderObj): string {
  return obj.totalStake
}
