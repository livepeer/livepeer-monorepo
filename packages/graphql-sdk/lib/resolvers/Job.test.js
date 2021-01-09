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

var resolvers = _interopRequireWildcard(require('./Job'))

;(0, _ava.default)(
  'Job resolves fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var obj, args, ctx, entries, _i, _entries, _entries$_i, key, val, result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj = {
                  id: '0',
                  broadcaster: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
                  profiles: [_sdk.VIDEO_PROFILES.P144p30fps16x9],
                  streamId: 'bar',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvSm9iLnRlc3QuanMiXSwibmFtZXMiOlsidCIsIm9iaiIsImlkIiwiYnJvYWRjYXN0ZXIiLCJFTVBUWV9BRERSRVNTIiwicmVwbGFjZSIsInByb2ZpbGVzIiwiVklERU9fUFJPRklMRVMiLCJQMTQ0cDMwZnBzMTZ4OSIsInN0cmVhbUlkIiwiYXJncyIsImN0eCIsImVudHJpZXMiLCJPYmplY3QiLCJrZXkiLCJ2YWwiLCJyZXNvbHZlcnMiLCJyZXN1bHQiLCJkZWVwRXF1YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBLGtCQUFLLHFCQUFMO0FBQUEscUZBQTRCLGlCQUFNQSxDQUFOO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDcEJDLFlBQUFBLEdBRG9CLEdBQ2Q7QUFDVkMsY0FBQUEsRUFBRSxFQUFFLEdBRE07QUFFVkMsY0FBQUEsV0FBVyxFQUFFQyxtQkFBY0MsT0FBZCxDQUFzQixLQUF0QixFQUE2QixJQUE3QixDQUZIO0FBR1ZDLGNBQUFBLFFBQVEsRUFBRSxDQUFDQyxvQkFBZUMsY0FBaEIsQ0FIQTtBQUlWQyxjQUFBQSxRQUFRLEVBQUU7QUFKQSxhQURjO0FBT3BCQyxZQUFBQSxJQVBvQixHQU9iLElBUGE7QUFRcEJDLFlBQUFBLEdBUm9CLEdBUWQsRUFSYztBQVNwQkMsWUFBQUEsT0FUb0IsR0FTVkMsTUFBTSxDQUFDRCxPQUFQLENBQWVYLEdBQWYsQ0FUVTtBQUFBLCtCQVVEVyxPQVZDOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEseUVBVWRFLEdBVmMsbUJBVVRDLEdBVlM7QUFBQTtBQUFBLG1CQVdIQyxTQUFTLENBQUNGLEdBQUQsQ0FBVCxDQUFlYixHQUFmLEVBQW9CUyxJQUFwQixFQUEwQkMsR0FBMUIsQ0FYRzs7QUFBQTtBQVdsQk0sWUFBQUEsTUFYa0I7QUFZeEJqQixZQUFBQSxDQUFDLENBQUNrQixTQUFGLENBQVlILEdBQVosRUFBaUJFLE1BQWpCOztBQVp3QjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUE1Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ2F2YSdcbmltcG9ydCB7IEVNUFRZX0FERFJFU1MsIFZJREVPX1BST0ZJTEVTIH0gZnJvbSAnQGxpdmVwZWVyL3NkaydcbmltcG9ydCAqIGFzIHJlc29sdmVycyBmcm9tICcuL0pvYidcblxudGVzdCgnSm9iIHJlc29sdmVzIGZpZWxkcycsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBvYmogPSB7XG4gICAgaWQ6ICcwJyxcbiAgICBicm9hZGNhc3RlcjogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMTEnKSxcbiAgICBwcm9maWxlczogW1ZJREVPX1BST0ZJTEVTLlAxNDRwMzBmcHMxNng5XSxcbiAgICBzdHJlYW1JZDogJ2JhcicsXG4gIH1cbiAgY29uc3QgYXJncyA9IG51bGxcbiAgY29uc3QgY3R4ID0ge31cbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iailcbiAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNvbHZlcnNba2V5XShvYmosIGFyZ3MsIGN0eClcbiAgICB0LmRlZXBFcXVhbCh2YWwsIHJlc3VsdClcbiAgfVxufSlcbiJdfQ==
