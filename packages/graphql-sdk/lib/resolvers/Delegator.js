'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.id = id
exports.ensName = ensName
exports.allowance = allowance
exports.bondedAmount = bondedAmount
exports.fees = fees
exports.delegateAddress = delegateAddress
exports.delegatedAmount = delegatedAmount
exports.lastClaimRound = lastClaimRound
exports.pendingFees = pendingFees
exports.pendingStake = pendingStake
exports.startRound = startRound
exports.status = status
exports.withdrawAmount = withdrawAmount
exports.withdrawRound = withdrawRound
exports.nextUnbondingLockId = nextUnbondingLockId

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

/** Typedefs */

/** Resolvers */

/**
 * Gets the id for a Delegator
 * @param {Object} obj
 * @param {string} obj.id - The id of the delegator
 * @return {string}
 */
function id(obj) {
  return obj.id
}
/**
 * Gets the ENS name for a Delegator
 * @param {Object} obj
 * @param {string} obj.id - The id of the delegator
 */

function ensName(_x, _x2, _x3) {
  return _ensName.apply(this, arguments)
}
/**
 * Gets the allowance for a Delegator
 * @param {Object} obj
 * @param {DelegatorStatus} obj.allowance - The allowance of the delegator
 * @return {DelegatorStatus}
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

function allowance(obj) {
  return obj.allowance
}
/**
 * Gets the bondedAmount for a Delegator
 * @param {Object} obj
 * @param {string} obj.bondedAmount - The bondedAmount of the delegator
 * @return {string}
 */

function bondedAmount(obj) {
  return obj.bondedAmount
}
/**
 * Gets the fees for a Delegator
 * @param {Object} obj
 * @param {string} obj.fees - The fees of the delegator
 * @return {string}
 */

function fees(obj) {
  return obj.fees
}
/**
 * Gets the delegateAddress for a Delegator
 * @param {Object} obj
 * @param {string} obj.delegateAddress - The delegateAddress of the delegator
 * @return {string}
 */

function delegateAddress(obj) {
  return obj.delegateAddress
}
/**
 * Gets the delegatedAmount for a Delegator
 * @param {Object} obj
 * @param {string} obj.delegatedAmount - The delegatedAmount of the delegator
 * @return {string}
 */

function delegatedAmount(obj) {
  return obj.delegatedAmount
}
/**
 * Gets the lastClaimRound for a Delegator
 * @param {Object} obj
 * @param {string} obj.lastClaimRound - The lastClaimRound of the delegator
 * @return {string}
 */

function lastClaimRound(obj) {
  return obj.lastClaimRound
}
/**
 * Gets the total pending fees for a Delegator
 * @param {Object} obj
 * @param {string} obj.pendingFees - The pendingFees of the delegator
 * @return {string}
 */

function pendingFees(obj) {
  return obj.pendingFees
}
/**
 * Gets the total pending stake for a Delegator
 * @param {Object} obj
 * @param {string} obj.pendingStake - The pendingStake of the delegator
 * @return {string}
 */

function pendingStake(obj) {
  return obj.pendingStake
}
/**
 * Gets the startRound for a Delegator
 * @param {Object} obj
 * @param {string} obj.startRound - The startRound of the delegator
 * @return {string}
 */

function startRound(obj) {
  return obj.startRound
}
/**
 * Gets the status for a Delegator
 * @param {Object} obj
 * @param {DelegatorStatus} obj.status - The status of the delegator
 * @return {DelegatorStatus}
 */

function status(obj) {
  return obj.status
}
/**
 * Gets the amount of tokens to withdraw of the delegator
 * @param {Object} obj
 * @param {string} obj.withdrawAmount - The amount of tokens to withdraw of the delegator
 */

function withdrawAmount(obj) {
  return obj.withdrawAmount
}
/**
 * Gets the withdrawRound for a Delegator
 * @param {Object} obj
 * @param {string} obj.withdrawRound - The withdrawRound of the delegator
 * @return {string}
 */

function withdrawRound(obj) {
  return obj.withdrawRound
}
/**
 * Gets the nextUnbondingLockId for a Delegator
 * @param {Object} obj
 * @param {string} obj.nextUnbondingLockId - The nextUnbondingLockId of the delegator
 * @return {string}
 */

function nextUnbondingLockId(obj) {
  return obj.nextUnbondingLockId
} // /**
//  * Gets the delegate for a Delegator
//  * @param {Object} obj
//  * @param {string} obj.delegate - The delegate of the delegator
//  * @return {Account}
//  */
// export function delegate(obj: DelegatorObj): Account {
//   return obj.delegate
// }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvRGVsZWdhdG9yLmpzIl0sIm5hbWVzIjpbImlkIiwib2JqIiwiZW5zTmFtZSIsImFyZ3MiLCJjdHgiLCJsaXZlcGVlciIsInJwYyIsImdldEVOU05hbWUiLCJhbGxvd2FuY2UiLCJib25kZWRBbW91bnQiLCJmZWVzIiwiZGVsZWdhdGVBZGRyZXNzIiwiZGVsZWdhdGVkQW1vdW50IiwibGFzdENsYWltUm91bmQiLCJwZW5kaW5nRmVlcyIsInBlbmRpbmdTdGFrZSIsInN0YXJ0Um91bmQiLCJzdGF0dXMiLCJ3aXRoZHJhd0Ftb3VudCIsIndpdGhkcmF3Um91bmQiLCJuZXh0VW5ib25kaW5nTG9ja0lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFXQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQSxFQUFULENBQVlDLEdBQVosRUFBdUM7QUFDNUMsU0FBT0EsR0FBRyxDQUFDRCxFQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7U0FDc0JFLE87OztBQUt0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7cUZBVk8saUJBQXVCRCxHQUF2QixFQUEwQ0UsSUFBMUMsRUFBZ0RDLEdBQWhEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHSixZQUFBQSxFQURILEdBQ1VDLEdBRFYsQ0FDR0QsRUFESDtBQUFBO0FBQUEsbUJBRVFJLEdBQUcsQ0FBQ0MsUUFBSixDQUFhQyxHQUFiLENBQWlCQyxVQUFqQixDQUE0QlAsRUFBNUIsQ0FGUjs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7QUFXQSxTQUFTUSxTQUFULENBQW1CUCxHQUFuQixFQUF1RDtBQUM1RCxTQUFPQSxHQUFHLENBQUNPLFNBQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsWUFBVCxDQUFzQlIsR0FBdEIsRUFBaUQ7QUFDdEQsU0FBT0EsR0FBRyxDQUFDUSxZQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLElBQVQsQ0FBY1QsR0FBZCxFQUF5QztBQUM5QyxTQUFPQSxHQUFHLENBQUNTLElBQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsZUFBVCxDQUF5QlYsR0FBekIsRUFBb0Q7QUFDekQsU0FBT0EsR0FBRyxDQUFDVSxlQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLGVBQVQsQ0FBeUJYLEdBQXpCLEVBQW9EO0FBQ3pELFNBQU9BLEdBQUcsQ0FBQ1csZUFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxjQUFULENBQXdCWixHQUF4QixFQUFtRDtBQUN4RCxTQUFPQSxHQUFHLENBQUNZLGNBQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsV0FBVCxDQUFxQmIsR0FBckIsRUFBZ0Q7QUFDckQsU0FBT0EsR0FBRyxDQUFDYSxXQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLFlBQVQsQ0FBc0JkLEdBQXRCLEVBQWlEO0FBQ3RELFNBQU9BLEdBQUcsQ0FBQ2MsWUFBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxVQUFULENBQW9CZixHQUFwQixFQUErQztBQUNwRCxTQUFPQSxHQUFHLENBQUNlLFVBQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0MsTUFBVCxDQUFnQmhCLEdBQWhCLEVBQW9EO0FBQ3pELFNBQU9BLEdBQUcsQ0FBQ2dCLE1BQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLGNBQVQsQ0FBd0JqQixHQUF4QixFQUFtRDtBQUN4RCxTQUFPQSxHQUFHLENBQUNpQixjQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLGFBQVQsQ0FBdUJsQixHQUF2QixFQUFrRDtBQUN2RCxTQUFPQSxHQUFHLENBQUNrQixhQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLG1CQUFULENBQTZCbkIsR0FBN0IsRUFBd0Q7QUFDN0QsU0FBT0EsR0FBRyxDQUFDbUIsbUJBQVg7QUFDRCxDLENBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFR5cGVkZWZzICovXG5cbnR5cGUgR1FMQ29udGV4dCA9IHtcbiAgbGl2ZXBlZXI6IE9iamVjdCxcbiAgYWNjb3VudD86IHN0cmluZyxcbn1cblxudHlwZSBEZWxlZ2F0b3JPYmogPSB7XG4gIGlkOiBzdHJpbmcsXG59XG5cbi8qKiBSZXNvbHZlcnMgKi9cblxuLyoqXG4gKiBHZXRzIHRoZSBpZCBmb3IgYSBEZWxlZ2F0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouaWQgLSBUaGUgaWQgb2YgdGhlIGRlbGVnYXRvclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaWQob2JqOiBEZWxlZ2F0b3JPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLmlkXG59XG5cbi8qKlxuICogR2V0cyB0aGUgRU5TIG5hbWUgZm9yIGEgRGVsZWdhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmlkIC0gVGhlIGlkIG9mIHRoZSBkZWxlZ2F0b3JcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGVuc05hbWUob2JqOiBEZWxlZ2F0b3JPYmosIGFyZ3MsIGN0eCk6IHN0cmluZyB7XG4gIGNvbnN0IHsgaWQgfSA9IG9ialxuICByZXR1cm4gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRFTlNOYW1lKGlkKVxufVxuXG4vKipcbiAqIEdldHMgdGhlIGFsbG93YW5jZSBmb3IgYSBEZWxlZ2F0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7RGVsZWdhdG9yU3RhdHVzfSBvYmouYWxsb3dhbmNlIC0gVGhlIGFsbG93YW5jZSBvZiB0aGUgZGVsZWdhdG9yXG4gKiBAcmV0dXJuIHtEZWxlZ2F0b3JTdGF0dXN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd2FuY2Uob2JqOiBEZWxlZ2F0b3JPYmopOiBEZWxlZ2F0b3JTdGF0dXMge1xuICByZXR1cm4gb2JqLmFsbG93YW5jZVxufVxuXG4vKipcbiAqIEdldHMgdGhlIGJvbmRlZEFtb3VudCBmb3IgYSBEZWxlZ2F0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouYm9uZGVkQW1vdW50IC0gVGhlIGJvbmRlZEFtb3VudCBvZiB0aGUgZGVsZWdhdG9yXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBib25kZWRBbW91bnQob2JqOiBEZWxlZ2F0b3JPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLmJvbmRlZEFtb3VudFxufVxuXG4vKipcbiAqIEdldHMgdGhlIGZlZXMgZm9yIGEgRGVsZWdhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmZlZXMgLSBUaGUgZmVlcyBvZiB0aGUgZGVsZWdhdG9yXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmZWVzKG9iajogRGVsZWdhdG9yT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5mZWVzXG59XG5cbi8qKlxuICogR2V0cyB0aGUgZGVsZWdhdGVBZGRyZXNzIGZvciBhIERlbGVnYXRvclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5kZWxlZ2F0ZUFkZHJlc3MgLSBUaGUgZGVsZWdhdGVBZGRyZXNzIG9mIHRoZSBkZWxlZ2F0b3JcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGVnYXRlQWRkcmVzcyhvYmo6IERlbGVnYXRvck9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmouZGVsZWdhdGVBZGRyZXNzXG59XG5cbi8qKlxuICogR2V0cyB0aGUgZGVsZWdhdGVkQW1vdW50IGZvciBhIERlbGVnYXRvclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5kZWxlZ2F0ZWRBbW91bnQgLSBUaGUgZGVsZWdhdGVkQW1vdW50IG9mIHRoZSBkZWxlZ2F0b3JcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGVnYXRlZEFtb3VudChvYmo6IERlbGVnYXRvck9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmouZGVsZWdhdGVkQW1vdW50XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGFzdENsYWltUm91bmQgZm9yIGEgRGVsZWdhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmxhc3RDbGFpbVJvdW5kIC0gVGhlIGxhc3RDbGFpbVJvdW5kIG9mIHRoZSBkZWxlZ2F0b3JcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxhc3RDbGFpbVJvdW5kKG9iajogRGVsZWdhdG9yT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5sYXN0Q2xhaW1Sb3VuZFxufVxuXG4vKipcbiAqIEdldHMgdGhlIHRvdGFsIHBlbmRpbmcgZmVlcyBmb3IgYSBEZWxlZ2F0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoucGVuZGluZ0ZlZXMgLSBUaGUgcGVuZGluZ0ZlZXMgb2YgdGhlIGRlbGVnYXRvclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGVuZGluZ0ZlZXMob2JqOiBEZWxlZ2F0b3JPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLnBlbmRpbmdGZWVzXG59XG5cbi8qKlxuICogR2V0cyB0aGUgdG90YWwgcGVuZGluZyBzdGFrZSBmb3IgYSBEZWxlZ2F0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoucGVuZGluZ1N0YWtlIC0gVGhlIHBlbmRpbmdTdGFrZSBvZiB0aGUgZGVsZWdhdG9yXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwZW5kaW5nU3Rha2Uob2JqOiBEZWxlZ2F0b3JPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLnBlbmRpbmdTdGFrZVxufVxuXG4vKipcbiAqIEdldHMgdGhlIHN0YXJ0Um91bmQgZm9yIGEgRGVsZWdhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLnN0YXJ0Um91bmQgLSBUaGUgc3RhcnRSb3VuZCBvZiB0aGUgZGVsZWdhdG9yXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFydFJvdW5kKG9iajogRGVsZWdhdG9yT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5zdGFydFJvdW5kXG59XG5cbi8qKlxuICogR2V0cyB0aGUgc3RhdHVzIGZvciBhIERlbGVnYXRvclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtEZWxlZ2F0b3JTdGF0dXN9IG9iai5zdGF0dXMgLSBUaGUgc3RhdHVzIG9mIHRoZSBkZWxlZ2F0b3JcbiAqIEByZXR1cm4ge0RlbGVnYXRvclN0YXR1c31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXR1cyhvYmo6IERlbGVnYXRvck9iaik6IERlbGVnYXRvclN0YXR1cyB7XG4gIHJldHVybiBvYmouc3RhdHVzXG59XG5cbi8qKlxuICogR2V0cyB0aGUgYW1vdW50IG9mIHRva2VucyB0byB3aXRoZHJhdyBvZiB0aGUgZGVsZWdhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLndpdGhkcmF3QW1vdW50IC0gVGhlIGFtb3VudCBvZiB0b2tlbnMgdG8gd2l0aGRyYXcgb2YgdGhlIGRlbGVnYXRvclxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aGRyYXdBbW91bnQob2JqOiBEZWxlZ2F0b3JPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLndpdGhkcmF3QW1vdW50XG59XG5cbi8qKlxuICogR2V0cyB0aGUgd2l0aGRyYXdSb3VuZCBmb3IgYSBEZWxlZ2F0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoud2l0aGRyYXdSb3VuZCAtIFRoZSB3aXRoZHJhd1JvdW5kIG9mIHRoZSBkZWxlZ2F0b3JcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhkcmF3Um91bmQob2JqOiBEZWxlZ2F0b3JPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLndpdGhkcmF3Um91bmRcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuZXh0VW5ib25kaW5nTG9ja0lkIGZvciBhIERlbGVnYXRvclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5uZXh0VW5ib25kaW5nTG9ja0lkIC0gVGhlIG5leHRVbmJvbmRpbmdMb2NrSWQgb2YgdGhlIGRlbGVnYXRvclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gbmV4dFVuYm9uZGluZ0xvY2tJZChvYmo6IERlbGVnYXRvck9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmoubmV4dFVuYm9uZGluZ0xvY2tJZFxufVxuXG4vLyAvKipcbi8vICAqIEdldHMgdGhlIGRlbGVnYXRlIGZvciBhIERlbGVnYXRvclxuLy8gICogQHBhcmFtIHtPYmplY3R9IG9ialxuLy8gICogQHBhcmFtIHtzdHJpbmd9IG9iai5kZWxlZ2F0ZSAtIFRoZSBkZWxlZ2F0ZSBvZiB0aGUgZGVsZWdhdG9yXG4vLyAgKiBAcmV0dXJuIHtBY2NvdW50fVxuLy8gICovXG4vLyBleHBvcnQgZnVuY3Rpb24gZGVsZWdhdGUob2JqOiBEZWxlZ2F0b3JPYmopOiBBY2NvdW50IHtcbi8vICAgcmV0dXJuIG9iai5kZWxlZ2F0ZVxuLy8gfVxuIl19
