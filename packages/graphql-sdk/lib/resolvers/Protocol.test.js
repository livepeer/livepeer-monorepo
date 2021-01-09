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

var resolvers = _interopRequireWildcard(require('./Protocol'))

;(0, _ava.default)(
  'Protocol resolved fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var obj, args, ctx, entries, _i, _entries, _entries$_i, key, val, result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj = {
                  id: 'protocol',
                  paused: true,
                  totalTokenSupply: '0',
                  totalBondedToken: '0',
                  targetBondingRate: '0',
                  transcoderPoolMaxSize: '0',
                  maxEarningsClaimsRounds: '0',
                }
                args = {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvUHJvdG9jb2wudGVzdC5qcyJdLCJuYW1lcyI6WyJ0Iiwib2JqIiwiaWQiLCJwYXVzZWQiLCJ0b3RhbFRva2VuU3VwcGx5IiwidG90YWxCb25kZWRUb2tlbiIsInRhcmdldEJvbmRpbmdSYXRlIiwidHJhbnNjb2RlclBvb2xNYXhTaXplIiwibWF4RWFybmluZ3NDbGFpbXNSb3VuZHMiLCJhcmdzIiwiY3R4IiwiZW50cmllcyIsIk9iamVjdCIsImtleSIsInZhbCIsInJlc29sdmVycyIsInJlc3VsdCIsImRlZXBFcXVhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUEsa0JBQUssMEJBQUw7QUFBQSxxRkFBaUMsaUJBQU1BLENBQU47QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUN6QkMsWUFBQUEsR0FEeUIsR0FDbkI7QUFDVkMsY0FBQUEsRUFBRSxFQUFFLFVBRE07QUFFVkMsY0FBQUEsTUFBTSxFQUFFLElBRkU7QUFHVkMsY0FBQUEsZ0JBQWdCLEVBQUUsR0FIUjtBQUlWQyxjQUFBQSxnQkFBZ0IsRUFBRSxHQUpSO0FBS1ZDLGNBQUFBLGlCQUFpQixFQUFFLEdBTFQ7QUFNVkMsY0FBQUEscUJBQXFCLEVBQUUsR0FOYjtBQU9WQyxjQUFBQSx1QkFBdUIsRUFBRTtBQVBmLGFBRG1CO0FBVXpCQyxZQUFBQSxJQVZ5QixHQVVsQixFQVZrQjtBQVd6QkMsWUFBQUEsR0FYeUIsR0FXbkIsRUFYbUI7QUFZekJDLFlBQUFBLE9BWnlCLEdBWWZDLE1BQU0sQ0FBQ0QsT0FBUCxDQUFlVixHQUFmLENBWmU7QUFBQSwrQkFhTlUsT0FiTTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLHlFQWFuQkUsR0FibUIsbUJBYWRDLEdBYmM7QUFBQTtBQUFBLG1CQWNSQyxTQUFTLENBQUNGLEdBQUQsQ0FBVCxDQUFlWixHQUFmLEVBQW9CUSxJQUFwQixFQUEwQkMsR0FBMUIsQ0FkUTs7QUFBQTtBQWN2Qk0sWUFBQUEsTUFkdUI7QUFlN0JoQixZQUFBQSxDQUFDLENBQUNpQixTQUFGLENBQVlILEdBQVosRUFBaUJFLE1BQWpCOztBQWY2QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFqQzs7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ2F2YSdcbmltcG9ydCAqIGFzIHJlc29sdmVycyBmcm9tICcuL1Byb3RvY29sJ1xuXG50ZXN0KCdQcm90b2NvbCByZXNvbHZlZCBmaWVsZHMnLCBhc3luYyB0ID0+IHtcbiAgY29uc3Qgb2JqID0ge1xuICAgIGlkOiAncHJvdG9jb2wnLFxuICAgIHBhdXNlZDogdHJ1ZSxcbiAgICB0b3RhbFRva2VuU3VwcGx5OiAnMCcsXG4gICAgdG90YWxCb25kZWRUb2tlbjogJzAnLFxuICAgIHRhcmdldEJvbmRpbmdSYXRlOiAnMCcsXG4gICAgdHJhbnNjb2RlclBvb2xNYXhTaXplOiAnMCcsXG4gICAgbWF4RWFybmluZ3NDbGFpbXNSb3VuZHM6ICcwJyxcbiAgfVxuICBjb25zdCBhcmdzID0ge31cbiAgY29uc3QgY3R4ID0ge31cbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iailcbiAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNvbHZlcnNba2V5XShvYmosIGFyZ3MsIGN0eClcbiAgICB0LmRlZXBFcXVhbCh2YWwsIHJlc3VsdClcbiAgfVxufSlcbiJdfQ==
