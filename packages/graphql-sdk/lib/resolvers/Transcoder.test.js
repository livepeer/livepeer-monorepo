'use strict'

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard')

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray'),
)

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

var _ava = _interopRequireDefault(require('ava'))

var _sdk = require('@livepeer/sdk')

var resolvers = _interopRequireWildcard(require('./Transcoder'))

;(0, _ava.default)(
  'Transcoder resolves fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var obj, args, ctx, entries, _i, _entries, _entries$_i, key, val, result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
                  active: false,
                  status: _sdk.TRANSCODER_STATUS.NotRegistered,
                  lastRewardRound: '0',
                  rewardCut: '0',
                  feeShare: '0',
                  pricePerSegment: '0',
                  pendingRewardCut: '0',
                  pendingFeeShare: '0',
                  pendingPricePerSegment: '0',
                  totalStake: '0',
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvVHJhbnNjb2Rlci50ZXN0LmpzIl0sIm5hbWVzIjpbInQiLCJvYmoiLCJpZCIsIkVNUFRZX0FERFJFU1MiLCJyZXBsYWNlIiwiYWN0aXZlIiwic3RhdHVzIiwiVFJBTlNDT0RFUl9TVEFUVVMiLCJOb3RSZWdpc3RlcmVkIiwibGFzdFJld2FyZFJvdW5kIiwicmV3YXJkQ3V0IiwiZmVlU2hhcmUiLCJwcmljZVBlclNlZ21lbnQiLCJwZW5kaW5nUmV3YXJkQ3V0IiwicGVuZGluZ0ZlZVNoYXJlIiwicGVuZGluZ1ByaWNlUGVyU2VnbWVudCIsInRvdGFsU3Rha2UiLCJhcmdzIiwiY3R4IiwiZW50cmllcyIsIk9iamVjdCIsImtleSIsInZhbCIsInJlc29sdmVycyIsInJlc3VsdCIsImRlZXBFcXVhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUEsa0JBQUssNEJBQUw7QUFBQSxxRkFBbUMsaUJBQU1BLENBQU47QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUMzQkMsWUFBQUEsR0FEMkIsR0FDckI7QUFDVkMsY0FBQUEsRUFBRSxFQUFFQyxtQkFBY0MsT0FBZCxDQUFzQixLQUF0QixFQUE2QixJQUE3QixDQURNO0FBRVZDLGNBQUFBLE1BQU0sRUFBRSxLQUZFO0FBR1ZDLGNBQUFBLE1BQU0sRUFBRUMsdUJBQWtCQyxhQUhoQjtBQUlWQyxjQUFBQSxlQUFlLEVBQUUsR0FKUDtBQUtWQyxjQUFBQSxTQUFTLEVBQUUsR0FMRDtBQU1WQyxjQUFBQSxRQUFRLEVBQUUsR0FOQTtBQU9WQyxjQUFBQSxlQUFlLEVBQUUsR0FQUDtBQVFWQyxjQUFBQSxnQkFBZ0IsRUFBRSxHQVJSO0FBU1ZDLGNBQUFBLGVBQWUsRUFBRSxHQVRQO0FBVVZDLGNBQUFBLHNCQUFzQixFQUFFLEdBVmQ7QUFXVkMsY0FBQUEsVUFBVSxFQUFFO0FBWEYsYUFEcUI7QUFjM0JDLFlBQUFBLElBZDJCLEdBY3BCLElBZG9CO0FBZTNCQyxZQUFBQSxHQWYyQixHQWVyQixFQWZxQjtBQWdCM0JDLFlBQUFBLE9BaEIyQixHQWdCakJDLE1BQU0sQ0FBQ0QsT0FBUCxDQUFlbEIsR0FBZixDQWhCaUI7QUFBQSwrQkFpQlJrQixPQWpCUTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLHlFQWlCckJFLEdBakJxQixtQkFpQmhCQyxHQWpCZ0I7QUFBQTtBQUFBLG1CQWtCVkMsU0FBUyxDQUFDRixHQUFELENBQVQsQ0FBZXBCLEdBQWYsRUFBb0JnQixJQUFwQixFQUEwQkMsR0FBMUIsQ0FsQlU7O0FBQUE7QUFrQnpCTSxZQUFBQSxNQWxCeUI7QUFtQi9CeEIsWUFBQUEsQ0FBQyxDQUFDeUIsU0FBRixDQUFZSCxHQUFaLEVBQWlCRSxNQUFqQjs7QUFuQitCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQW5DOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJ1xuaW1wb3J0IHsgRU1QVFlfQUREUkVTUywgVFJBTlNDT0RFUl9TVEFUVVMgfSBmcm9tICdAbGl2ZXBlZXIvc2RrJ1xuaW1wb3J0ICogYXMgcmVzb2x2ZXJzIGZyb20gJy4vVHJhbnNjb2RlcidcblxudGVzdCgnVHJhbnNjb2RlciByZXNvbHZlcyBmaWVsZHMnLCBhc3luYyB0ID0+IHtcbiAgY29uc3Qgb2JqID0ge1xuICAgIGlkOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcxMScpLFxuICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgc3RhdHVzOiBUUkFOU0NPREVSX1NUQVRVUy5Ob3RSZWdpc3RlcmVkLFxuICAgIGxhc3RSZXdhcmRSb3VuZDogJzAnLFxuICAgIHJld2FyZEN1dDogJzAnLFxuICAgIGZlZVNoYXJlOiAnMCcsXG4gICAgcHJpY2VQZXJTZWdtZW50OiAnMCcsXG4gICAgcGVuZGluZ1Jld2FyZEN1dDogJzAnLFxuICAgIHBlbmRpbmdGZWVTaGFyZTogJzAnLFxuICAgIHBlbmRpbmdQcmljZVBlclNlZ21lbnQ6ICcwJyxcbiAgICB0b3RhbFN0YWtlOiAnMCcsXG4gIH1cbiAgY29uc3QgYXJncyA9IG51bGxcbiAgY29uc3QgY3R4ID0ge31cbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iailcbiAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNvbHZlcnNba2V5XShvYmosIGFyZ3MsIGN0eClcbiAgICB0LmRlZXBFcXVhbCh2YWwsIHJlc3VsdClcbiAgfVxufSlcbiJdfQ==
