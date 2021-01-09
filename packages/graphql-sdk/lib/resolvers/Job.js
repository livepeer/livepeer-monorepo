'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.id = id
exports.broadcaster = broadcaster
exports.broadcasterENSName = broadcasterENSName
exports.profiles = profiles
exports.streamId = streamId

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

/** Typedefs */

/** Resolvers */

/**
 * Gets the id for a Job
 * @param {Object} obj
 * @param {string} obj.id - The id of the Job
 * @return {string}
 */
function id(obj) {
  return obj.id
}
/**
 * Gets the broadcaster for a Job
 * @param {Object} obj
 * @param {string} obj.broadcaster - The broadcaster of the broadcaster
 * @return {string}
 */

function broadcaster(obj) {
  return obj.broadcaster
}
/**
 * Gets the ENS name for a Job's broadcaster
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 */

function broadcasterENSName(_x, _x2, _x3) {
  return _broadcasterENSName.apply(this, arguments)
}
/**
 * Gets the profiles for a Job
 * @param {Object} obj
 * @param {string} obj.profiles - The profiles of the profiles
 * @return {string}
 */

function _broadcasterENSName() {
  _broadcasterENSName = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee(obj, args, ctx) {
      var broadcaster
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              broadcaster = obj.broadcaster
              _context.next = 3
              return ctx.livepeer.rpc.getENSName(broadcaster)

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
  return _broadcasterENSName.apply(this, arguments)
}

function profiles(obj) {
  return obj.profiles
}
/**
 * Gets the streamId for a Job
 * @param {Object} obj
 * @param {string} obj.streamId - The streamId of the streamId
 * @return {string}
 */

function streamId(obj) {
  return obj.streamId
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvSm9iLmpzIl0sIm5hbWVzIjpbImlkIiwib2JqIiwiYnJvYWRjYXN0ZXIiLCJicm9hZGNhc3RlckVOU05hbWUiLCJhcmdzIiwiY3R4IiwibGl2ZXBlZXIiLCJycGMiLCJnZXRFTlNOYW1lIiwicHJvZmlsZXMiLCJzdHJlYW1JZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFXQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQSxFQUFULENBQVlDLEdBQVosRUFBaUM7QUFDdEMsU0FBT0EsR0FBRyxDQUFDRCxFQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNFLFdBQVQsQ0FBcUJELEdBQXJCLEVBQTBDO0FBQy9DLFNBQU9BLEdBQUcsQ0FBQ0MsV0FBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O1NBQ3NCQyxrQjs7O0FBU3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztnR0FkTyxpQkFDTEYsR0FESyxFQUVMRyxJQUZLLEVBR0xDLEdBSEs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0dILFlBQUFBLFdBTEgsR0FLbUJELEdBTG5CLENBS0dDLFdBTEg7QUFBQTtBQUFBLG1CQU1RRyxHQUFHLENBQUNDLFFBQUosQ0FBYUMsR0FBYixDQUFpQkMsVUFBakIsQ0FBNEJOLFdBQTVCLENBTlI7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O0FBZUEsU0FBU08sUUFBVCxDQUFrQlIsR0FBbEIsRUFBdUM7QUFDNUMsU0FBT0EsR0FBRyxDQUFDUSxRQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNDLFFBQVQsQ0FBa0JULEdBQWxCLEVBQXVDO0FBQzVDLFNBQU9BLEdBQUcsQ0FBQ1MsUUFBWDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIFR5cGVkZWZzICovXG5cbnR5cGUgR1FMQ29udGV4dCA9IHtcbiAgbGl2ZXBlZXI6IE9iamVjdCxcbiAgYWNjb3VudD86IHN0cmluZyxcbn1cblxudHlwZSBKb2JPYmogPSB7XG4gIGlkOiBzdHJpbmcsXG59XG5cbi8qKiBSZXNvbHZlcnMgKi9cblxuLyoqXG4gKiBHZXRzIHRoZSBpZCBmb3IgYSBKb2JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouaWQgLSBUaGUgaWQgb2YgdGhlIEpvYlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaWQob2JqOiBKb2JPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLmlkXG59XG5cbi8qKlxuICogR2V0cyB0aGUgYnJvYWRjYXN0ZXIgZm9yIGEgSm9iXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmJyb2FkY2FzdGVyIC0gVGhlIGJyb2FkY2FzdGVyIG9mIHRoZSBicm9hZGNhc3RlclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnJvYWRjYXN0ZXIob2JqOiBKb2JPYmopOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLmJyb2FkY2FzdGVyXG59XG5cbi8qKlxuICogR2V0cyB0aGUgRU5TIG5hbWUgZm9yIGEgSm9iJ3MgYnJvYWRjYXN0ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouaWQgLSBUaGUgaWQgb2YgdGhlIGJyb2FkY2FzdGVyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBicm9hZGNhc3RlckVOU05hbWUoXG4gIG9iajogQnJvYWRjYXN0ZXJPYmosXG4gIGFyZ3MsXG4gIGN0eCxcbik6IHN0cmluZyB7XG4gIGNvbnN0IHsgYnJvYWRjYXN0ZXIgfSA9IG9ialxuICByZXR1cm4gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRFTlNOYW1lKGJyb2FkY2FzdGVyKVxufVxuXG4vKipcbiAqIEdldHMgdGhlIHByb2ZpbGVzIGZvciBhIEpvYlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5wcm9maWxlcyAtIFRoZSBwcm9maWxlcyBvZiB0aGUgcHJvZmlsZXNcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2ZpbGVzKG9iajogSm9iT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5wcm9maWxlc1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHN0cmVhbUlkIGZvciBhIEpvYlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5zdHJlYW1JZCAtIFRoZSBzdHJlYW1JZCBvZiB0aGUgc3RyZWFtSWRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmVhbUlkKG9iajogSm9iT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5zdHJlYW1JZFxufVxuIl19
