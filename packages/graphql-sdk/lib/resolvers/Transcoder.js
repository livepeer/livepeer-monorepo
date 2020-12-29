'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.id = id
exports.ensName = ensName
exports.status = status
exports.active = active
exports.lastRewardRound = lastRewardRound
exports.rewardCut = rewardCut
exports.feeShare = feeShare
exports.pricePerSegment = pricePerSegment
exports.pendingRewardCut = pendingRewardCut
exports.pendingFeeShare = pendingFeeShare
exports.pendingPricePerSegment = pendingPricePerSegment
exports.totalStake = totalStake

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

/** Typedefs */

/** Resolvers */

/**
 * Gets the id for a Transcoder
 * @param {Object} obj
 * @param {string} obj.id - The id of the transcoder
 * @return {string}
 */
function id(obj) {
  return obj.id
}
/**
 * Gets the ENS name for a Transcoder
 * @param {Object} obj
 * @param {string} obj.id - The id of the transcoder
 */

function ensName(_x, _x2, _x3) {
  return _ensName.apply(this, arguments)
}
/**
 * Gets the status for a Transcoder
 * @param {Object} obj
 * @param {TranscoderStatus} obj.status - The status of the transcoder
 * @return {TranscoderStatus}
 */

function _ensName() {
  _ensName = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee(obj, args, ctx) {
      var id
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              id = obj.id
              _context.next = 3
              return ctx.livepeer.rpc.getENSName(id)

            case 3:
              return _context.abrupt('return', _context.sent)

            case 4:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    }),
  )
  return _ensName.apply(this, arguments)
}

function status(obj) {
  return obj.status
}
/**
 * Gets the active for a Transcoder
 * @param {Object} obj
 * @param {string} obj.active - The active of the transcoder
 * @return {string}
 */

function active(obj) {
  return obj.active
}
/**
 * Gets the lastRewardRound for a Transcoder
 * @param {Object} obj
 * @param {string} obj.lastRewardRound - The lastRewardRound of the transcoder
 * @return {string}
 */

function lastRewardRound(obj) {
  return obj.lastRewardRound
}
/**
 * Gets the rewardCut for a Transcoder
 * @param {Object} obj
 * @param {string} obj.rewardCut - The rewardCut of the transcoder
 * @return {string}
 */

function rewardCut(obj) {
  return obj.rewardCut
}
/**
 * Gets the feeShare for a Transcoder
 * @param {Object} obj
 * @param {string} obj.feeShare - The feeShare of the transcoder
 * @return {string}
 */

function feeShare(obj) {
  return obj.feeShare
}
/**
 * Gets the pricePerSegment for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pricePerSegment - The pricePerSegment of the transcoder
 * @return {string}
 */

function pricePerSegment(obj) {
  return obj.pricePerSegment
}
/**
 * Gets the pendingRewardCut for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pendingRewardCut - The pendingRewardCut of the transcoder
 * @return {string}
 */

function pendingRewardCut(obj) {
  return obj.pendingRewardCut
}
/**
 * Gets the pendingFeeShare for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pendingFeeShare - The pendingFeeShare of the transcoder
 * @return {string}
 */

function pendingFeeShare(obj) {
  return obj.pendingFeeShare
}
/**
 * Gets the pendingPricePerSegment for a Transcoder
 * @param {Object} obj
 * @param {string} obj.pendingPricePerSegment - The pendingPricePerSegment of the transcoder
 * @return {string}
 */

function pendingPricePerSegment(obj) {
  return obj.pendingPricePerSegment
}
/**
 * Gets the totalStake for a Transcoder
 * @param {Object} obj
 * @param {string} obj.totalStake - The totalStake of the transcoder
 * @return {string}
 */

function totalStake(obj) {
  return obj.totalStake
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvVHJhbnNjb2Rlci5qcyJdLCJuYW1lcyI6WyJpZCIsIm9iaiIsImVuc05hbWUiLCJhcmdzIiwiY3R4IiwibGl2ZXBlZXIiLCJycGMiLCJnZXRFTlNOYW1lIiwic3RhdHVzIiwiYWN0aXZlIiwibGFzdFJld2FyZFJvdW5kIiwicmV3YXJkQ3V0IiwiZmVlU2hhcmUiLCJwcmljZVBlclNlZ21lbnQiLCJwZW5kaW5nUmV3YXJkQ3V0IiwicGVuZGluZ0ZlZVNoYXJlIiwicGVuZGluZ1ByaWNlUGVyU2VnbWVudCIsInRvdGFsU3Rha2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQVdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVNBLEVBQVQsQ0FBWUMsR0FBWixFQUF3QztBQUM3QyxTQUFPQSxHQUFHLENBQUNELEVBQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNzQkUsTzs7O0FBS3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztxRkFWTyxpQkFBdUJELEdBQXZCLEVBQTJDRSxJQUEzQyxFQUFpREMsR0FBakQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0dKLFlBQUFBLEVBREgsR0FDVUMsR0FEVixDQUNHRCxFQURIO0FBQUE7QUFBQSxtQkFFUUksR0FBRyxDQUFDQyxRQUFKLENBQWFDLEdBQWIsQ0FBaUJDLFVBQWpCLENBQTRCUCxFQUE1QixDQUZSOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztBQVdBLFNBQVNRLE1BQVQsQ0FBZ0JQLEdBQWhCLEVBQXNEO0FBQzNELFNBQU9BLEdBQUcsQ0FBQ08sTUFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxNQUFULENBQWdCUixHQUFoQixFQUE0QztBQUNqRCxTQUFPQSxHQUFHLENBQUNRLE1BQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsZUFBVCxDQUF5QlQsR0FBekIsRUFBcUQ7QUFDMUQsU0FBT0EsR0FBRyxDQUFDUyxlQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLFNBQVQsQ0FBbUJWLEdBQW5CLEVBQStDO0FBQ3BELFNBQU9BLEdBQUcsQ0FBQ1UsU0FBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxRQUFULENBQWtCWCxHQUFsQixFQUE4QztBQUNuRCxTQUFPQSxHQUFHLENBQUNXLFFBQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsZUFBVCxDQUF5QlosR0FBekIsRUFBcUQ7QUFDMUQsU0FBT0EsR0FBRyxDQUFDWSxlQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLGdCQUFULENBQTBCYixHQUExQixFQUFzRDtBQUMzRCxTQUFPQSxHQUFHLENBQUNhLGdCQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLGVBQVQsQ0FBeUJkLEdBQXpCLEVBQXFEO0FBQzFELFNBQU9BLEdBQUcsQ0FBQ2MsZUFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxzQkFBVCxDQUFnQ2YsR0FBaEMsRUFBNEQ7QUFDakUsU0FBT0EsR0FBRyxDQUFDZSxzQkFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxVQUFULENBQW9CaEIsR0FBcEIsRUFBZ0Q7QUFDckQsU0FBT0EsR0FBRyxDQUFDZ0IsVUFBWDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFR5cGVkZWZzICovXG5cbnR5cGUgR1FMQ29udGV4dCA9IHtcbiAgbGl2ZXBlZXI6IE9iamVjdCxcbiAgYWNjb3VudD86IHN0cmluZyxcbn1cblxudHlwZSBUcmFuc2NvZGVyT2JqID0ge1xuICBpZDogc3RyaW5nLFxufVxuXG4vKiogUmVzb2x2ZXJzICovXG5cbi8qKlxuICogR2V0cyB0aGUgaWQgZm9yIGEgVHJhbnNjb2RlclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5pZCAtIFRoZSBpZCBvZiB0aGUgdHJhbnNjb2RlclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaWQob2JqOiBUcmFuc2NvZGVyT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5pZFxufVxuXG4vKipcbiAqIEdldHMgdGhlIEVOUyBuYW1lIGZvciBhIFRyYW5zY29kZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouaWQgLSBUaGUgaWQgb2YgdGhlIHRyYW5zY29kZXJcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc05hbWUob2JqOiBUcmFuc2NvZGVyT2JqLCBhcmdzLCBjdHgpOiBzdHJpbmcge1xuICBjb25zdCB7IGlkIH0gPSBvYmpcbiAgcmV0dXJuIGF3YWl0IGN0eC5saXZlcGVlci5ycGMuZ2V0RU5TTmFtZShpZClcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzdGF0dXMgZm9yIGEgVHJhbnNjb2RlclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtUcmFuc2NvZGVyU3RhdHVzfSBvYmouc3RhdHVzIC0gVGhlIHN0YXR1cyBvZiB0aGUgdHJhbnNjb2RlclxuICogQHJldHVybiB7VHJhbnNjb2RlclN0YXR1c31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXR1cyhvYmo6IFRyYW5zY29kZXJPYmopOiBUcmFuc2NvZGVyU3RhdHVzIHtcbiAgcmV0dXJuIG9iai5zdGF0dXNcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBhY3RpdmUgZm9yIGEgVHJhbnNjb2RlclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5hY3RpdmUgLSBUaGUgYWN0aXZlIG9mIHRoZSB0cmFuc2NvZGVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmUob2JqOiBUcmFuc2NvZGVyT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5hY3RpdmVcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBsYXN0UmV3YXJkUm91bmQgZm9yIGEgVHJhbnNjb2RlclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5sYXN0UmV3YXJkUm91bmQgLSBUaGUgbGFzdFJld2FyZFJvdW5kIG9mIHRoZSB0cmFuc2NvZGVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXN0UmV3YXJkUm91bmQob2JqOiBUcmFuc2NvZGVyT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5sYXN0UmV3YXJkUm91bmRcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSByZXdhcmRDdXQgZm9yIGEgVHJhbnNjb2RlclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5yZXdhcmRDdXQgLSBUaGUgcmV3YXJkQ3V0IG9mIHRoZSB0cmFuc2NvZGVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXdhcmRDdXQob2JqOiBUcmFuc2NvZGVyT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5yZXdhcmRDdXRcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBmZWVTaGFyZSBmb3IgYSBUcmFuc2NvZGVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmZlZVNoYXJlIC0gVGhlIGZlZVNoYXJlIG9mIHRoZSB0cmFuc2NvZGVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmZWVTaGFyZShvYmo6IFRyYW5zY29kZXJPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLmZlZVNoYXJlXG59XG5cbi8qKlxuICogR2V0cyB0aGUgcHJpY2VQZXJTZWdtZW50IGZvciBhIFRyYW5zY29kZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoucHJpY2VQZXJTZWdtZW50IC0gVGhlIHByaWNlUGVyU2VnbWVudCBvZiB0aGUgdHJhbnNjb2RlclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJpY2VQZXJTZWdtZW50KG9iajogVHJhbnNjb2Rlck9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmoucHJpY2VQZXJTZWdtZW50XG59XG5cbi8qKlxuICogR2V0cyB0aGUgcGVuZGluZ1Jld2FyZEN1dCBmb3IgYSBUcmFuc2NvZGVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLnBlbmRpbmdSZXdhcmRDdXQgLSBUaGUgcGVuZGluZ1Jld2FyZEN1dCBvZiB0aGUgdHJhbnNjb2RlclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGVuZGluZ1Jld2FyZEN1dChvYmo6IFRyYW5zY29kZXJPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLnBlbmRpbmdSZXdhcmRDdXRcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBwZW5kaW5nRmVlU2hhcmUgZm9yIGEgVHJhbnNjb2RlclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5wZW5kaW5nRmVlU2hhcmUgLSBUaGUgcGVuZGluZ0ZlZVNoYXJlIG9mIHRoZSB0cmFuc2NvZGVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwZW5kaW5nRmVlU2hhcmUob2JqOiBUcmFuc2NvZGVyT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5wZW5kaW5nRmVlU2hhcmVcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBwZW5kaW5nUHJpY2VQZXJTZWdtZW50IGZvciBhIFRyYW5zY29kZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoucGVuZGluZ1ByaWNlUGVyU2VnbWVudCAtIFRoZSBwZW5kaW5nUHJpY2VQZXJTZWdtZW50IG9mIHRoZSB0cmFuc2NvZGVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwZW5kaW5nUHJpY2VQZXJTZWdtZW50KG9iajogVHJhbnNjb2Rlck9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmoucGVuZGluZ1ByaWNlUGVyU2VnbWVudFxufVxuXG4vKipcbiAqIEdldHMgdGhlIHRvdGFsU3Rha2UgZm9yIGEgVHJhbnNjb2RlclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai50b3RhbFN0YWtlIC0gVGhlIHRvdGFsU3Rha2Ugb2YgdGhlIHRyYW5zY29kZXJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvdGFsU3Rha2Uob2JqOiBUcmFuc2NvZGVyT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai50b3RhbFN0YWtlXG59XG4iXX0=
