'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.id = id
exports.initialized = initialized
exports.lastInitializedRound = lastInitializedRound
exports.length = length
exports.startBlock = startBlock

/** Typedefs */

/** Resolvers */

/**
 * Gets the id for a Round
 * @param {Object} obj
 * @param {string} obj.id - The round number
 * @return {string}
 */
function id(obj) {
  return obj.id
}
/**
 * Gets the initialized status for a Round
 * @param {Object} obj
 * @param {string} obj.initialized - Whether the round was initialized
 * @return {boolean}
 */

function initialized(obj) {
  return obj.initialized
}
/**
 * Gets the lastInitializedRound prior to this one
 * @param {Object} obj
 * @param {string} obj.lastInitializedRound - The round's last initialized round
 * @return {string}
 */

function lastInitializedRound(obj) {
  return obj.lastInitializedRound
}
/**
 * Gets the length for a Round
 * @param {Object} obj
 * @param {string} obj.length - The round block length
 * @return {string}
 */

function length(obj) {
  return obj.length
}
/**
 * Gets the startBlock for a Round
 * @param {Object} obj
 * @param {string} obj.startBlock - The round start block
 * @return {string}
 */

function startBlock(obj) {
  return obj.startBlock
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvUm91bmQuanMiXSwibmFtZXMiOlsiaWQiLCJvYmoiLCJpbml0aWFsaXplZCIsImxhc3RJbml0aWFsaXplZFJvdW5kIiwibGVuZ3RoIiwic3RhcnRCbG9jayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7QUFTQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQSxFQUFULENBQVlDLEdBQVosRUFBbUM7QUFDeEMsU0FBT0EsR0FBRyxDQUFDRCxFQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNFLFdBQVQsQ0FBcUJELEdBQXJCLEVBQTRDO0FBQ2pELFNBQU9BLEdBQUcsQ0FBQ0MsV0FBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxvQkFBVCxDQUE4QkYsR0FBOUIsRUFBcUQ7QUFDMUQsU0FBT0EsR0FBRyxDQUFDRSxvQkFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxNQUFULENBQWdCSCxHQUFoQixFQUF1QztBQUM1QyxTQUFPQSxHQUFHLENBQUNHLE1BQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsVUFBVCxDQUFvQkosR0FBcEIsRUFBMkM7QUFDaEQsU0FBT0EsR0FBRyxDQUFDSSxVQUFYO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVHlwZWRlZnMgKi9cblxudHlwZSBHUUxDb250ZXh0ID0ge1xuICBsaXZlcGVlcjogT2JqZWN0LFxuICBhY2NvdW50Pzogc3RyaW5nLFxufVxuXG50eXBlIFJvdW5kT2JqID0ge31cblxuLyoqIFJlc29sdmVycyAqL1xuXG4vKipcbiAqIEdldHMgdGhlIGlkIGZvciBhIFJvdW5kXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmlkIC0gVGhlIHJvdW5kIG51bWJlclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaWQob2JqOiBSb3VuZE9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmouaWRcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbml0aWFsaXplZCBzdGF0dXMgZm9yIGEgUm91bmRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouaW5pdGlhbGl6ZWQgLSBXaGV0aGVyIHRoZSByb3VuZCB3YXMgaW5pdGlhbGl6ZWRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplZChvYmo6IFJvdW5kT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5pbml0aWFsaXplZFxufVxuXG4vKipcbiAqIEdldHMgdGhlIGxhc3RJbml0aWFsaXplZFJvdW5kIHByaW9yIHRvIHRoaXMgb25lXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmxhc3RJbml0aWFsaXplZFJvdW5kIC0gVGhlIHJvdW5kJ3MgbGFzdCBpbml0aWFsaXplZCByb3VuZFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGFzdEluaXRpYWxpemVkUm91bmQob2JqOiBSb3VuZE9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmoubGFzdEluaXRpYWxpemVkUm91bmRcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBsZW5ndGggZm9yIGEgUm91bmRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoubGVuZ3RoIC0gVGhlIHJvdW5kIGJsb2NrIGxlbmd0aFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVuZ3RoKG9iajogUm91bmRPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLmxlbmd0aFxufVxuXG4vKipcbiAqIEdldHMgdGhlIHN0YXJ0QmxvY2sgZm9yIGEgUm91bmRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouc3RhcnRCbG9jayAtIFRoZSByb3VuZCBzdGFydCBibG9ja1xuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRCbG9jayhvYmo6IFJvdW5kT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5zdGFydEJsb2NrXG59XG4iXX0=
