'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.id = id
exports.ensName = ensName
exports.ethBalance = ethBalance
exports.tokenBalance = tokenBalance
exports.broadcaster = broadcaster
exports.delegator = delegator
exports.transcoder = transcoder
exports.unbondlocks = unbondlocks
exports.unbondlock = unbondlock

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

var _Query = require('./Query')

/** Resolvers */

/**
 * Gets the id for an Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @return {string}
 */
function id(_x, _x2, _x3) {
  return _id.apply(this, arguments)
}
/**
 * Gets the ENS name for an Account
 * @param {string} obj.ensName - The ENS name
 */

function _id() {
  _id = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee(obj, args, ctx) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              return _context.abrupt('return', obj.id)

            case 1:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    }),
  )
  return _id.apply(this, arguments)
}

function ensName(_x4, _x5, _x6) {
  return _ensName.apply(this, arguments)
}
/**
 * Gets the ETH balance for an Account
 * @param {Object} obj
 * @param {string} obj.ethBalance - The ethBalance of the broadcaster
 * @return {string}
 */

function _ensName() {
  _ensName = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee2(obj, args, ctx) {
      var id, ensName
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              ;(id = obj.id), (ensName = obj.ensName)
              _context2.t0 = ensName

              if (_context2.t0) {
                _context2.next = 6
                break
              }

              _context2.next = 5
              return ctx.livepeer.rpc.getENSName(id)

            case 5:
              _context2.t0 = _context2.sent

            case 6:
              return _context2.abrupt('return', _context2.t0)

            case 7:
            case 'end':
              return _context2.stop()
          }
        }
      }, _callee2)
    }),
  )
  return _ensName.apply(this, arguments)
}

function ethBalance(_x7, _x8, _x9) {
  return _ethBalance.apply(this, arguments)
}
/**
 * Gets the LPT balance for an Account
 * @param {Object} obj
 * @param {string} obj.tokenBalance - The tokenBalance of the broadcaster
 * @return {string}
 */

function _ethBalance() {
  _ethBalance = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee3(obj, args, ctx) {
      var id
      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch ((_context3.prev = _context3.next)) {
            case 0:
              id = obj.id
              _context3.next = 3
              return ctx.livepeer.rpc.getEthBalance(id)

            case 3:
              return _context3.abrupt('return', _context3.sent)

            case 4:
            case 'end':
              return _context3.stop()
          }
        }
      }, _callee3)
    }),
  )
  return _ethBalance.apply(this, arguments)
}

function tokenBalance(_x10, _x11, _x12) {
  return _tokenBalance.apply(this, arguments)
}
/**
 * Gets Broadcaster for a Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @param {Object} args
 * @param {Object} ctx
 * @return {Broadcaster}
 */

function _tokenBalance() {
  _tokenBalance = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee4(obj, args, ctx) {
      var id
      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch ((_context4.prev = _context4.next)) {
            case 0:
              id = obj.id
              _context4.next = 3
              return ctx.livepeer.rpc.getTokenBalance(id)

            case 3:
              return _context4.abrupt('return', _context4.sent)

            case 4:
            case 'end':
              return _context4.stop()
          }
        }
      }, _callee4)
    }),
  )
  return _tokenBalance.apply(this, arguments)
}

function broadcaster(obj, args, ctx) {
  return (0, _Query.broadcaster)(
    {},
    {
      id: obj.id,
    },
    ctx,
  )
}
/**
 * Gets Delegator for a Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the delegator
 * @param {Object} args
 * @param {Object} ctx
 * @return {Delegator}
 */

function delegator(obj, args, ctx) {
  return (0, _Query.delegator)(
    {},
    {
      id: obj.id,
    },
    ctx,
  )
}
/**
 * Gets Transcoder for a Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the transcoder
 * @param {Object} args
 * @param {Object} ctx
 * @return {Transcoder}
 */

function transcoder(obj, args, ctx) {
  return (0, _Query.transcoder)(
    {},
    {
      id: obj.id,
    },
    ctx,
  )
}
/**
 * Gets unbonding locks by ETH address
 * @param {QueryObj} obj
 * @param {QueryUnbondingLockArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Array<UnbondingLock>}
 */

function unbondlocks(_x13, _x14, _x15) {
  return _unbondlocks.apply(this, arguments)
}
/**
 * Gets unbonding lock by ETH address and Id
 * @param {QueryObj} obj
 * @param {QueryUnbondingLockArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {UnbondingLock}
 */

function _unbondlocks() {
  _unbondlocks = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee5(obj, args, ctx) {
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch ((_context5.prev = _context5.next)) {
            case 0:
              return _context5.abrupt(
                'return',
                (0, _Query.unbondlocks)(
                  {},
                  {
                    id: obj.id,
                  },
                  ctx,
                ),
              )

            case 1:
            case 'end':
              return _context5.stop()
          }
        }
      }, _callee5)
    }),
  )
  return _unbondlocks.apply(this, arguments)
}

function unbondlock(_x16, _x17, _x18) {
  return _unbondlock.apply(this, arguments)
}

function _unbondlock() {
  _unbondlock = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee6(obj, args, ctx) {
      var id, lockId
      return _regenerator.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch ((_context6.prev = _context6.next)) {
            case 0:
              id = obj.id
              lockId = args.lockId
              return _context6.abrupt(
                'return',
                (0, _Query.unbondlock)(
                  {},
                  {
                    id: id,
                    lockId: lockId,
                  },
                  ctx,
                ),
              )

            case 3:
            case 'end':
              return _context6.stop()
          }
        }
      }, _callee6)
    }),
  )
  return _unbondlock.apply(this, arguments)
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQWNjb3VudC5qcyJdLCJuYW1lcyI6WyJpZCIsIm9iaiIsImFyZ3MiLCJjdHgiLCJlbnNOYW1lIiwibGl2ZXBlZXIiLCJycGMiLCJnZXRFTlNOYW1lIiwiZXRoQmFsYW5jZSIsImdldEV0aEJhbGFuY2UiLCJ0b2tlbkJhbGFuY2UiLCJnZXRUb2tlbkJhbGFuY2UiLCJicm9hZGNhc3RlciIsImRlbGVnYXRvciIsInRyYW5zY29kZXIiLCJ1bmJvbmRsb2NrcyIsInVuYm9uZGxvY2siLCJsb2NrSWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQW9CQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7U0FDc0JBLEU7OztBQUl0QjtBQUNBO0FBQ0E7QUFDQTs7OztnRkFQTyxpQkFBa0JDLEdBQWxCLEVBQW1DQyxJQUFuQyxFQUF5Q0MsR0FBekM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLDZDQUNFRixHQUFHLENBQUNELEVBRE47O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztTQVFlSSxPOzs7QUFLdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O3FGQVZPLGtCQUF1QkgsR0FBdkIsRUFBd0NDLElBQXhDLEVBQThDQyxHQUE5QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDR0gsWUFBQUEsRUFESCxHQUNtQkMsR0FEbkIsQ0FDR0QsRUFESCxFQUNPSSxPQURQLEdBQ21CSCxHQURuQixDQUNPRyxPQURQO0FBQUEsMkJBRUVBLE9BRkY7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxtQkFFb0JELEdBQUcsQ0FBQ0UsUUFBSixDQUFhQyxHQUFiLENBQWlCQyxVQUFqQixDQUE0QlAsRUFBNUIsQ0FGcEI7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7U0FXZVEsVTs7O0FBS3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozt3RkFWTyxrQkFBMEJQLEdBQTFCLEVBQTJDQyxJQUEzQyxFQUFpREMsR0FBakQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0dILFlBQUFBLEVBREgsR0FDVUMsR0FEVixDQUNHRCxFQURIO0FBQUE7QUFBQSxtQkFFUUcsR0FBRyxDQUFDRSxRQUFKLENBQWFDLEdBQWIsQ0FBaUJHLGFBQWpCLENBQStCVCxFQUEvQixDQUZSOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztTQVdlVSxZOzs7QUFLdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OzswRkFaTyxrQkFBNEJULEdBQTVCLEVBQTZDQyxJQUE3QyxFQUFtREMsR0FBbkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0dILFlBQUFBLEVBREgsR0FDVUMsR0FEVixDQUNHRCxFQURIO0FBQUE7QUFBQSxtQkFFUUcsR0FBRyxDQUFDRSxRQUFKLENBQWFDLEdBQWIsQ0FBaUJLLGVBQWpCLENBQWlDWCxFQUFqQyxDQUZSOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztBQWFBLFNBQVNZLFdBQVQsQ0FDTFgsR0FESyxFQUVMQyxJQUZLLEVBR0xDLEdBSEssRUFJUTtBQUNiLFNBQU8sd0JBQW1CLEVBQW5CLEVBQXVCO0FBQUVILElBQUFBLEVBQUUsRUFBRUMsR0FBRyxDQUFDRDtBQUFWLEdBQXZCLEVBQXVDRyxHQUF2QyxDQUFQO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTVSxTQUFULENBQ0xaLEdBREssRUFFTEMsSUFGSyxFQUdMQyxHQUhLLEVBSU07QUFDWCxTQUFPLHNCQUFpQixFQUFqQixFQUFxQjtBQUFFSCxJQUFBQSxFQUFFLEVBQUVDLEdBQUcsQ0FBQ0Q7QUFBVixHQUFyQixFQUFxQ0csR0FBckMsQ0FBUDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU1csVUFBVCxDQUNMYixHQURLLEVBRUxDLElBRkssRUFHTEMsR0FISyxFQUlPO0FBQ1osU0FBTyx1QkFBa0IsRUFBbEIsRUFBc0I7QUFBRUgsSUFBQUEsRUFBRSxFQUFFQyxHQUFHLENBQUNEO0FBQVYsR0FBdEIsRUFBc0NHLEdBQXRDLENBQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztTQUNzQlksVzs7O0FBUXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7eUZBZk8sa0JBQ0xkLEdBREssRUFFTEMsSUFGSyxFQUdMQyxHQUhLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4Q0FLRSx3QkFBbUIsRUFBbkIsRUFBdUI7QUFBRUgsY0FBQUEsRUFBRSxFQUFFQyxHQUFHLENBQUNEO0FBQVYsYUFBdkIsRUFBdUNHLEdBQXZDLENBTEY7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7OztTQWdCZWEsVTs7Ozs7d0ZBQWYsa0JBQ0xmLEdBREssRUFFTEMsSUFGSyxFQUdMQyxHQUhLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtHSCxZQUFBQSxFQUxILEdBS1VDLEdBTFYsQ0FLR0QsRUFMSDtBQU1HaUIsWUFBQUEsTUFOSCxHQU1jZixJQU5kLENBTUdlLE1BTkg7QUFBQSw4Q0FPRSx1QkFBa0IsRUFBbEIsRUFBc0I7QUFBRWpCLGNBQUFBLEVBQUUsRUFBRkEsRUFBRjtBQUFNaUIsY0FBQUEsTUFBTSxFQUFOQTtBQUFOLGFBQXRCLEVBQXNDZCxHQUF0QyxDQVBGOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBicm9hZGNhc3RlciBhcyByZXNvbHZlQnJvYWRjYXN0ZXIsXG4gIGRlbGVnYXRvciBhcyByZXNvbHZlRGVsZWdhdG9yLFxuICB0cmFuc2NvZGVyIGFzIHJlc29sdmVUcmFuc2NvZGVyLFxuICB1bmJvbmRsb2NrcyBhcyByZXNvbHZlVW5ib25kTG9ja3MsXG4gIHVuYm9uZGxvY2sgYXMgcmVzb2x2ZVVuYm9uZExvY2ssXG59IGZyb20gJy4vUXVlcnknXG5cbi8qKiBUeXBlZGVmcyAqL1xuXG50eXBlIEdRTENvbnRleHQgPSB7XG4gIGxpdmVwZWVyOiBPYmplY3QsXG4gIGFjY291bnQ/OiBzdHJpbmcsXG59XG5cbnR5cGUgQWNjb3VudE9iaiA9IHtcbiAgaWQ6IHN0cmluZyxcbiAgZW5zTmFtZT86IHN0cmluZyxcbn1cblxuLyoqIFJlc29sdmVycyAqL1xuXG4vKipcbiAqIEdldHMgdGhlIGlkIGZvciBhbiBBY2NvdW50XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmlkIC0gVGhlIGlkIG9mIHRoZSBicm9hZGNhc3RlclxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaWQob2JqOiBBY2NvdW50T2JqLCBhcmdzLCBjdHgpOiBzdHJpbmcge1xuICByZXR1cm4gb2JqLmlkXG59XG5cbi8qKlxuICogR2V0cyB0aGUgRU5TIG5hbWUgZm9yIGFuIEFjY291bnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouZW5zTmFtZSAtIFRoZSBFTlMgbmFtZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5zTmFtZShvYmo6IEFjY291bnRPYmosIGFyZ3MsIGN0eCk6IHN0cmluZyB7XG4gIGNvbnN0IHsgaWQsIGVuc05hbWUgfSA9IG9ialxuICByZXR1cm4gZW5zTmFtZSB8fCAoYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRFTlNOYW1lKGlkKSlcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBFVEggYmFsYW5jZSBmb3IgYW4gQWNjb3VudFxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IG9iai5ldGhCYWxhbmNlIC0gVGhlIGV0aEJhbGFuY2Ugb2YgdGhlIGJyb2FkY2FzdGVyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBldGhCYWxhbmNlKG9iajogQWNjb3VudE9iaiwgYXJncywgY3R4KTogc3RyaW5nIHtcbiAgY29uc3QgeyBpZCB9ID0gb2JqXG4gIHJldHVybiBhd2FpdCBjdHgubGl2ZXBlZXIucnBjLmdldEV0aEJhbGFuY2UoaWQpXG59XG5cbi8qKlxuICogR2V0cyB0aGUgTFBUIGJhbGFuY2UgZm9yIGFuIEFjY291bnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmoudG9rZW5CYWxhbmNlIC0gVGhlIHRva2VuQmFsYW5jZSBvZiB0aGUgYnJvYWRjYXN0ZXJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRva2VuQmFsYW5jZShvYmo6IEFjY291bnRPYmosIGFyZ3MsIGN0eCk6IHN0cmluZyB7XG4gIGNvbnN0IHsgaWQgfSA9IG9ialxuICByZXR1cm4gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRUb2tlbkJhbGFuY2UoaWQpXG59XG5cbi8qKlxuICogR2V0cyBCcm9hZGNhc3RlciBmb3IgYSBBY2NvdW50XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqLmlkIC0gVGhlIGlkIG9mIHRoZSBicm9hZGNhc3RlclxuICogQHBhcmFtIHtPYmplY3R9IGFyZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAqIEByZXR1cm4ge0Jyb2FkY2FzdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnJvYWRjYXN0ZXIoXG4gIG9iajogQWNjb3VudE9iaixcbiAgYXJnczogQWNjb3VudEJyb2FkY2FzdGVyQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogQnJvYWRjYXN0ZXIge1xuICByZXR1cm4gcmVzb2x2ZUJyb2FkY2FzdGVyKHt9LCB7IGlkOiBvYmouaWQgfSwgY3R4KVxufVxuXG4vKipcbiAqIEdldHMgRGVsZWdhdG9yIGZvciBhIEFjY291bnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouaWQgLSBUaGUgaWQgb2YgdGhlIGRlbGVnYXRvclxuICogQHBhcmFtIHtPYmplY3R9IGFyZ3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAqIEByZXR1cm4ge0RlbGVnYXRvcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGVnYXRvcihcbiAgb2JqOiBBY2NvdW50T2JqLFxuICBhcmdzOiBBY2NvdW50RGVsZWdhdG9yQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogRGVsZWdhdG9yIHtcbiAgcmV0dXJuIHJlc29sdmVEZWxlZ2F0b3Ioe30sIHsgaWQ6IG9iai5pZCB9LCBjdHgpXG59XG5cbi8qKlxuICogR2V0cyBUcmFuc2NvZGVyIGZvciBhIEFjY291bnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmouaWQgLSBUaGUgaWQgb2YgdGhlIHRyYW5zY29kZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBhcmdzXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gKiBAcmV0dXJuIHtUcmFuc2NvZGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNjb2RlcihcbiAgb2JqOiBBY2NvdW50T2JqLFxuICBhcmdzOiBBY2NvdW50VHJhbnNjb2RlckFyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFRyYW5zY29kZXIge1xuICByZXR1cm4gcmVzb2x2ZVRyYW5zY29kZXIoe30sIHsgaWQ6IG9iai5pZCB9LCBjdHgpXG59XG5cbi8qKlxuICogR2V0cyB1bmJvbmRpbmcgbG9ja3MgYnkgRVRIIGFkZHJlc3NcbiAqIEBwYXJhbSB7UXVlcnlPYmp9IG9ialxuICogQHBhcmFtIHtRdWVyeVVuYm9uZGluZ0xvY2tBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5pZCAtIEVUSCBhZGRyZXNzXG4gKiBAcGFyYW0ge0dRTENvbnRleHR9IGN0eFxuICogQHJldHVybiB7QXJyYXk8VW5ib25kaW5nTG9jaz59XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1bmJvbmRsb2NrcyhcbiAgb2JqOiBBY2NvdW50T2JqLFxuICBhcmdzOiBRdWVyeVVuYm9uZGluZ0xvY2tBcmdzLFxuICBjdHg6IEdRTENvbnRleHQsXG4pOiBBcnJheTxVbmJvbmRpbmdMb2NrPiB7XG4gIHJldHVybiByZXNvbHZlVW5ib25kTG9ja3Moe30sIHsgaWQ6IG9iai5pZCB9LCBjdHgpXG59XG5cbi8qKlxuICogR2V0cyB1bmJvbmRpbmcgbG9jayBieSBFVEggYWRkcmVzcyBhbmQgSWRcbiAqIEBwYXJhbSB7UXVlcnlPYmp9IG9ialxuICogQHBhcmFtIHtRdWVyeVVuYm9uZGluZ0xvY2tBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5pZCAtIEVUSCBhZGRyZXNzXG4gKiBAcGFyYW0ge0dRTENvbnRleHR9IGN0eFxuICogQHJldHVybiB7VW5ib25kaW5nTG9ja31cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVuYm9uZGxvY2soXG4gIG9iajogQWNjb3VudE9iaixcbiAgYXJnczogUXVlcnlVbmJvbmRpbmdMb2NrQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogVW5ib25kaW5nTG9jayB7XG4gIGNvbnN0IHsgaWQgfSA9IG9ialxuICBjb25zdCB7IGxvY2tJZCB9ID0gYXJnc1xuICByZXR1cm4gcmVzb2x2ZVVuYm9uZExvY2soe30sIHsgaWQsIGxvY2tJZCB9LCBjdHgpXG59XG4iXX0=
