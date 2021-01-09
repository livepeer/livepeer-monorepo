'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.id = id
exports.ensName = ensName
exports.deposit = deposit
exports.withdrawBlock = withdrawBlock
exports.jobs = jobs

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

var _Query = require('./Query')

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    keys.push.apply(keys, symbols)
  }
  return keys
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        ;(0, _defineProperty2.default)(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        )
      })
    }
  }
  return target
}

/** Resolvers */

/**
 * Gets the id for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @return {string}
 */
function id(obj) {
  return obj.id
}
/**
 * Gets the ENS name for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 */

function ensName(_x, _x2, _x3) {
  return _ensName.apply(this, arguments)
}
/**
 * Gets the deposit for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.deposit - The deposit of the broadcaster
 * @return {string}
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

function deposit(obj) {
  return obj.deposit
}
/**
 * Gets the withdrawBlock for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.withdrawBlock - The withdrawBlock of the broadcaster
 * @return {string}
 */

function withdrawBlock(obj) {
  return obj.withdrawBlock
}
/**
 * Gets Jobs for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @param {Object} args
 * @param {number} [args.skip=0] - The number of Jobs to skip
 * @param {number} [args.limit=100] - The max number onf Jobs to return
 * @param {Object} ctx
 * @return {Array<Job>}
 */

function jobs(obj, args, ctx) {
  var id = obj.id

  var nextArgs = _objectSpread(
    _objectSpread({}, args),
    {},
    {
      broadcaster: id,
    },
  )

  return (0, _Query.jobs)({}, nextArgs, ctx)
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQnJvYWRjYXN0ZXIuanMiXSwibmFtZXMiOlsiaWQiLCJvYmoiLCJlbnNOYW1lIiwiYXJncyIsImN0eCIsImxpdmVwZWVyIiwicnBjIiwiZ2V0RU5TTmFtZSIsImRlcG9zaXQiLCJ3aXRoZHJhd0Jsb2NrIiwiam9icyIsIm5leHRBcmdzIiwiYnJvYWRjYXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBa0JBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVNBLEVBQVQsQ0FBWUMsR0FBWixFQUF5QztBQUM5QyxTQUFPQSxHQUFHLENBQUNELEVBQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNzQkUsTzs7O0FBS3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztxRkFWTyxpQkFBdUJELEdBQXZCLEVBQTRDRSxJQUE1QyxFQUFrREMsR0FBbEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0dKLFlBQUFBLEVBREgsR0FDVUMsR0FEVixDQUNHRCxFQURIO0FBQUE7QUFBQSxtQkFFUUksR0FBRyxDQUFDQyxRQUFKLENBQWFDLEdBQWIsQ0FBaUJDLFVBQWpCLENBQTRCUCxFQUE1QixDQUZSOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztBQVdBLFNBQVNRLE9BQVQsQ0FBaUJQLEdBQWpCLEVBQThDO0FBQ25ELFNBQU9BLEdBQUcsQ0FBQ08sT0FBWDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxhQUFULENBQXVCUixHQUF2QixFQUFvRDtBQUN6RCxTQUFPQSxHQUFHLENBQUNRLGFBQVg7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTQyxJQUFULENBQ0xULEdBREssRUFFTEUsSUFGSyxFQUdMQyxHQUhLLEVBSU87QUFBQSxNQUNKSixFQURJLEdBQ0dDLEdBREgsQ0FDSkQsRUFESTs7QUFFWixNQUFNVyxRQUFRLG1DQUNUUixJQURTO0FBRVpTLElBQUFBLFdBQVcsRUFBRVo7QUFGRCxJQUFkOztBQUlBLFNBQU8saUJBQVksRUFBWixFQUFnQlcsUUFBaEIsRUFBMEJQLEdBQTFCLENBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvYnMgYXMgcmVzb2x2ZUpvYnMgfSBmcm9tICcuL1F1ZXJ5J1xuXG4vKiogVHlwZWRlZnMgKi9cblxudHlwZSBHUUxDb250ZXh0ID0ge1xuICBsaXZlcGVlcjogT2JqZWN0LFxuICBhY2NvdW50Pzogc3RyaW5nLFxufVxuXG50eXBlIEJyb2FkY2FzdGVyT2JqID0ge1xuICBpZDogc3RyaW5nLFxufVxuXG50eXBlIEJyb2FkY2FzdGVySm9ic0FyZ3MgPSB7XG4gIHNraXA/OiBudW1iZXIsXG4gIGxpbWl0PzogbnVtYmVyLFxufVxuXG4vKiogUmVzb2x2ZXJzICovXG5cbi8qKlxuICogR2V0cyB0aGUgaWQgZm9yIGEgQnJvYWRjYXN0ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouaWQgLSBUaGUgaWQgb2YgdGhlIGJyb2FkY2FzdGVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZChvYmo6IEJyb2FkY2FzdGVyT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai5pZFxufVxuXG4vKipcbiAqIEdldHMgdGhlIEVOUyBuYW1lIGZvciBhIEJyb2FkY2FzdGVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmlkIC0gVGhlIGlkIG9mIHRoZSBicm9hZGNhc3RlclxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5zTmFtZShvYmo6IEJyb2FkY2FzdGVyT2JqLCBhcmdzLCBjdHgpOiBzdHJpbmcge1xuICBjb25zdCB7IGlkIH0gPSBvYmpcbiAgcmV0dXJuIGF3YWl0IGN0eC5saXZlcGVlci5ycGMuZ2V0RU5TTmFtZShpZClcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkZXBvc2l0IGZvciBhIEJyb2FkY2FzdGVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmRlcG9zaXQgLSBUaGUgZGVwb3NpdCBvZiB0aGUgYnJvYWRjYXN0ZXJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlcG9zaXQob2JqOiBCcm9hZGNhc3Rlck9iaik6IHN0cmluZyB7XG4gIHJldHVybiBvYmouZGVwb3NpdFxufVxuXG4vKipcbiAqIEdldHMgdGhlIHdpdGhkcmF3QmxvY2sgZm9yIGEgQnJvYWRjYXN0ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoud2l0aGRyYXdCbG9jayAtIFRoZSB3aXRoZHJhd0Jsb2NrIG9mIHRoZSBicm9hZGNhc3RlclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aGRyYXdCbG9jayhvYmo6IEJyb2FkY2FzdGVyT2JqKTogc3RyaW5nIHtcbiAgcmV0dXJuIG9iai53aXRoZHJhd0Jsb2NrXG59XG5cbi8qKlxuICogR2V0cyBKb2JzIGZvciBhIEJyb2FkY2FzdGVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmlkIC0gVGhlIGlkIG9mIHRoZSBicm9hZGNhc3RlclxuICogQHBhcmFtIHtPYmplY3R9IGFyZ3NcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5za2lwPTBdIC0gVGhlIG51bWJlciBvZiBKb2JzIHRvIHNraXBcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5saW1pdD0xMDBdIC0gVGhlIG1heCBudW1iZXIgb25mIEpvYnMgdG8gcmV0dXJuXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gKiBAcmV0dXJuIHtBcnJheTxKb2I+fVxuICovXG5leHBvcnQgZnVuY3Rpb24gam9icyhcbiAgb2JqOiBCcm9hZGNhc3Rlck9iaixcbiAgYXJnczogQnJvYWRjYXN0ZXJKb2JzQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogQXJyYXk8Sm9iPiB7XG4gIGNvbnN0IHsgaWQgfSA9IG9ialxuICBjb25zdCBuZXh0QXJncyA9IHtcbiAgICAuLi5hcmdzLFxuICAgIGJyb2FkY2FzdGVyOiBpZCxcbiAgfVxuICByZXR1cm4gcmVzb2x2ZUpvYnMoe30sIG5leHRBcmdzLCBjdHgpXG59XG4iXX0=
