'use strict'

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard')

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray'),
)

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

var _ava = _interopRequireDefault(require('ava'))

var _sdk = require('@livepeer/sdk')

var resolvers = _interopRequireWildcard(require('./Delegator'))

;(0, _ava.default)(
  'Delegator resolves fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var _obj

        var obj, args, ctx, entries, _i, _entries, _entries$_i, key, val, result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj =
                  ((_obj = {
                    allowance: '0',
                    id: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
                    status: _sdk.DELEGATOR_STATUS.Unbonded,
                    bondedAmount: '0',
                    fees: '0',
                    delegateAddress: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                    delegatedAmount: '0',
                    lastClaimRound: '0',
                    pendingStake: '0',
                    startRound: '0',
                  }),
                  (0, _defineProperty2.default)(_obj, 'status', 'Unbonded'),
                  (0, _defineProperty2.default)(_obj, 'withdrawAmount', '0'),
                  (0, _defineProperty2.default)(_obj, 'withdrawRound', '0'),
                  (0, _defineProperty2.default)(
                    _obj,
                    'nextUnbondingLockId',
                    '0',
                  ),
                  _obj)
                args = null
                ctx = {}
                entries = Object.entries(obj)
                ;(_i = 0), (_entries = entries)

              case 5:
                if (!(_i < _entries.length)) {
                  _context.next = 14
                  break
                }

                ;(_entries$_i = (0, _slicedToArray2.default)(_entries[_i], 2)),
                  (key = _entries$_i[0]),
                  (val = _entries$_i[1])
                _context.next = 9
                return resolvers[key](obj, args, ctx)

              case 9:
                result = _context.sent
                t.deepEqual(val, result)

              case 11:
                _i++
                _context.next = 5
                break

              case 14:
              case 'end':
                return _context.stop()
            }
          }
        }, _callee)
      }),
    )

    return function (_x) {
      return _ref.apply(this, arguments)
    }
  })(),
)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvRGVsZWdhdG9yLnRlc3QuanMiXSwibmFtZXMiOlsidCIsIm9iaiIsImFsbG93YW5jZSIsImlkIiwiRU1QVFlfQUREUkVTUyIsInJlcGxhY2UiLCJzdGF0dXMiLCJERUxFR0FUT1JfU1RBVFVTIiwiVW5ib25kZWQiLCJib25kZWRBbW91bnQiLCJmZWVzIiwiZGVsZWdhdGVBZGRyZXNzIiwiZGVsZWdhdGVkQW1vdW50IiwibGFzdENsYWltUm91bmQiLCJwZW5kaW5nU3Rha2UiLCJzdGFydFJvdW5kIiwiYXJncyIsImN0eCIsImVudHJpZXMiLCJPYmplY3QiLCJrZXkiLCJ2YWwiLCJyZXNvbHZlcnMiLCJyZXN1bHQiLCJkZWVwRXF1YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUEsa0JBQUssMkJBQUw7QUFBQSxxRkFBa0MsaUJBQU1BLENBQU47QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUMxQkMsWUFBQUEsR0FEMEI7QUFFOUJDLGNBQUFBLFNBQVMsRUFBRSxHQUZtQjtBQUc5QkMsY0FBQUEsRUFBRSxFQUFFQyxtQkFBY0MsT0FBZCxDQUFzQixLQUF0QixFQUE2QixJQUE3QixDQUgwQjtBQUk5QkMsY0FBQUEsTUFBTSxFQUFFQyxzQkFBaUJDLFFBSks7QUFLOUJDLGNBQUFBLFlBQVksRUFBRSxHQUxnQjtBQU05QkMsY0FBQUEsSUFBSSxFQUFFLEdBTndCO0FBTzlCQyxjQUFBQSxlQUFlLEVBQUVQLG1CQUFjQyxPQUFkLENBQXNCLEtBQXRCLEVBQTZCLElBQTdCLENBUGE7QUFROUJPLGNBQUFBLGVBQWUsRUFBRSxHQVJhO0FBUzlCQyxjQUFBQSxjQUFjLEVBQUUsR0FUYztBQVU5QkMsY0FBQUEsWUFBWSxFQUFFLEdBVmdCO0FBVzlCQyxjQUFBQSxVQUFVLEVBQUU7QUFYa0IsNkRBWXRCLFVBWnNCLHlEQWFkLEdBYmMsd0RBY2YsR0FkZSw4REFlVCxHQWZTO0FBaUIxQkMsWUFBQUEsSUFqQjBCLEdBaUJuQixJQWpCbUI7QUFrQjFCQyxZQUFBQSxHQWxCMEIsR0FrQnBCLEVBbEJvQjtBQW1CMUJDLFlBQUFBLE9BbkIwQixHQW1CaEJDLE1BQU0sQ0FBQ0QsT0FBUCxDQUFlakIsR0FBZixDQW5CZ0I7QUFBQSwrQkFvQlBpQixPQXBCTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLHlFQW9CcEJFLEdBcEJvQixtQkFvQmZDLEdBcEJlO0FBQUE7QUFBQSxtQkFxQlRDLFNBQVMsQ0FBQ0YsR0FBRCxDQUFULENBQWVuQixHQUFmLEVBQW9CZSxJQUFwQixFQUEwQkMsR0FBMUIsQ0FyQlM7O0FBQUE7QUFxQnhCTSxZQUFBQSxNQXJCd0I7QUFzQjlCdkIsWUFBQUEsQ0FBQyxDQUFDd0IsU0FBRixDQUFZSCxHQUFaLEVBQWlCRSxNQUFqQjs7QUF0QjhCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQWxDOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJ1xuaW1wb3J0IHsgRU1QVFlfQUREUkVTUywgREVMRUdBVE9SX1NUQVRVUyB9IGZyb20gJ0BsaXZlcGVlci9zZGsnXG5pbXBvcnQgKiBhcyByZXNvbHZlcnMgZnJvbSAnLi9EZWxlZ2F0b3InXG5cbnRlc3QoJ0RlbGVnYXRvciByZXNvbHZlcyBmaWVsZHMnLCBhc3luYyB0ID0+IHtcbiAgY29uc3Qgb2JqID0ge1xuICAgIGFsbG93YW5jZTogJzAnLFxuICAgIGlkOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcxMScpLFxuICAgIHN0YXR1czogREVMRUdBVE9SX1NUQVRVUy5VbmJvbmRlZCxcbiAgICBib25kZWRBbW91bnQ6ICcwJyxcbiAgICBmZWVzOiAnMCcsXG4gICAgZGVsZWdhdGVBZGRyZXNzOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpLFxuICAgIGRlbGVnYXRlZEFtb3VudDogJzAnLFxuICAgIGxhc3RDbGFpbVJvdW5kOiAnMCcsXG4gICAgcGVuZGluZ1N0YWtlOiAnMCcsXG4gICAgc3RhcnRSb3VuZDogJzAnLFxuICAgIHN0YXR1czogJ1VuYm9uZGVkJyxcbiAgICB3aXRoZHJhd0Ftb3VudDogJzAnLFxuICAgIHdpdGhkcmF3Um91bmQ6ICcwJyxcbiAgICBuZXh0VW5ib25kaW5nTG9ja0lkOiAnMCcsXG4gIH1cbiAgY29uc3QgYXJncyA9IG51bGxcbiAgY29uc3QgY3R4ID0ge31cbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iailcbiAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNvbHZlcnNba2V5XShvYmosIGFyZ3MsIGN0eClcbiAgICB0LmRlZXBFcXVhbCh2YWwsIHJlc3VsdClcbiAgfVxufSlcbiJdfQ==
