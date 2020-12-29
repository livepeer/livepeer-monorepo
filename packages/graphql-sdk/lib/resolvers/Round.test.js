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

var resolvers = _interopRequireWildcard(require('./Round'))

;(0, _ava.default)(
  'Round resolves fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var obj, args, ctx, entries, _i, _entries, _entries$_i, key, val, result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj = {
                  id: '100',
                  initialized: false,
                  lastInitializedRound: '99',
                  length: '50',
                  startBlock: '12345',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvUm91bmQudGVzdC5qcyJdLCJuYW1lcyI6WyJ0Iiwib2JqIiwiaWQiLCJpbml0aWFsaXplZCIsImxhc3RJbml0aWFsaXplZFJvdW5kIiwibGVuZ3RoIiwic3RhcnRCbG9jayIsImFyZ3MiLCJjdHgiLCJlbnRyaWVzIiwiT2JqZWN0Iiwia2V5IiwidmFsIiwicmVzb2x2ZXJzIiwicmVzdWx0IiwiZGVlcEVxdWFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQSxrQkFBSyx1QkFBTDtBQUFBLHFGQUE4QixpQkFBTUEsQ0FBTjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ3RCQyxZQUFBQSxHQURzQixHQUNoQjtBQUNWQyxjQUFBQSxFQUFFLEVBQUUsS0FETTtBQUVWQyxjQUFBQSxXQUFXLEVBQUUsS0FGSDtBQUdWQyxjQUFBQSxvQkFBb0IsRUFBRSxJQUhaO0FBSVZDLGNBQUFBLE1BQU0sRUFBRSxJQUpFO0FBS1ZDLGNBQUFBLFVBQVUsRUFBRTtBQUxGLGFBRGdCO0FBUXRCQyxZQUFBQSxJQVJzQixHQVFmLElBUmU7QUFTdEJDLFlBQUFBLEdBVHNCLEdBU2hCLEVBVGdCO0FBVXRCQyxZQUFBQSxPQVZzQixHQVVaQyxNQUFNLENBQUNELE9BQVAsQ0FBZVIsR0FBZixDQVZZO0FBQUEsK0JBV0hRLE9BWEc7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSx5RUFXaEJFLEdBWGdCLG1CQVdYQyxHQVhXO0FBQUE7QUFBQSxtQkFZTEMsU0FBUyxDQUFDRixHQUFELENBQVQsQ0FBZVYsR0FBZixFQUFvQk0sSUFBcEIsRUFBMEJDLEdBQTFCLENBWks7O0FBQUE7QUFZcEJNLFlBQUFBLE1BWm9CO0FBYTFCZCxZQUFBQSxDQUFDLENBQUNlLFNBQUYsQ0FBWUgsR0FBWixFQUFpQkUsTUFBakI7O0FBYjBCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQTlCOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJ1xuaW1wb3J0ICogYXMgcmVzb2x2ZXJzIGZyb20gJy4vUm91bmQnXG5cbnRlc3QoJ1JvdW5kIHJlc29sdmVzIGZpZWxkcycsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBvYmogPSB7XG4gICAgaWQ6ICcxMDAnLFxuICAgIGluaXRpYWxpemVkOiBmYWxzZSxcbiAgICBsYXN0SW5pdGlhbGl6ZWRSb3VuZDogJzk5JyxcbiAgICBsZW5ndGg6ICc1MCcsXG4gICAgc3RhcnRCbG9jazogJzEyMzQ1JyxcbiAgfVxuICBjb25zdCBhcmdzID0gbnVsbFxuICBjb25zdCBjdHggPSB7fVxuICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMob2JqKVxuICBmb3IgKGNvbnN0IFtrZXksIHZhbF0gb2YgZW50cmllcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc29sdmVyc1trZXldKG9iaiwgYXJncywgY3R4KVxuICAgIHQuZGVlcEVxdWFsKHZhbCwgcmVzdWx0KVxuICB9XG59KVxuIl19
