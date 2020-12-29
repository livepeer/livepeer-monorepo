'use strict'

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard')

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/slicedToArray'),
)

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
)

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

var _ava = _interopRequireDefault(require('ava'))

var _sdk = require('@livepeer/sdk')

var resolvers = _interopRequireWildcard(require('./JobProfile'))

;(0, _ava.default)(
  'JobProfile resolves fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var _VIDEO_PROFILES$P144p,
          hash,
          obj,
          args,
          ctx,
          entries,
          _i,
          _entries,
          _entries$_i,
          key,
          val,
          result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ;(_VIDEO_PROFILES$P144p = _sdk.VIDEO_PROFILES.P144p30fps16x9),
                  (hash = _VIDEO_PROFILES$P144p.hash),
                  (obj = (0,
                  _objectWithoutProperties2.default)(_VIDEO_PROFILES$P144p, [
                    'hash',
                  ]))
                obj.id = hash
                obj.name = 'P144p30fps16x9'
                args = null
                ctx = {}
                entries = Object.entries(obj)
                ;(_i = 0), (_entries = entries)

              case 7:
                if (!(_i < _entries.length)) {
                  _context.next = 16
                  break
                }

                ;(_entries$_i = (0, _slicedToArray2.default)(_entries[_i], 2)),
                  (key = _entries$_i[0]),
                  (val = _entries$_i[1])
                _context.next = 11
                return resolvers[key](obj, args, ctx)

              case 11:
                result = _context.sent
                t.deepEqual(val, result)

              case 13:
                _i++
                _context.next = 7
                break

              case 16:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvSm9iUHJvZmlsZS50ZXN0LmpzIl0sIm5hbWVzIjpbInQiLCJWSURFT19QUk9GSUxFUyIsIlAxNDRwMzBmcHMxNng5IiwiaGFzaCIsIm9iaiIsImlkIiwibmFtZSIsImFyZ3MiLCJjdHgiLCJlbnRyaWVzIiwiT2JqZWN0Iiwia2V5IiwidmFsIiwicmVzb2x2ZXJzIiwicmVzdWx0IiwiZGVlcEVxdWFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBLGtCQUFLLDRCQUFMO0FBQUEscUZBQW1DLGlCQUFNQSxDQUFOO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxvQ0FDUkMsb0JBQWVDLGNBRFAsRUFDekJDLElBRHlCLHlCQUN6QkEsSUFEeUIsRUFDaEJDLEdBRGdCO0FBRWpDQSxZQUFBQSxHQUFHLENBQUNDLEVBQUosR0FBU0YsSUFBVDtBQUNBQyxZQUFBQSxHQUFHLENBQUNFLElBQUosR0FBVyxnQkFBWDtBQUNNQyxZQUFBQSxJQUoyQixHQUlwQixJQUpvQjtBQUszQkMsWUFBQUEsR0FMMkIsR0FLckIsRUFMcUI7QUFNM0JDLFlBQUFBLE9BTjJCLEdBTWpCQyxNQUFNLENBQUNELE9BQVAsQ0FBZUwsR0FBZixDQU5pQjtBQUFBLCtCQU9SSyxPQVBROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEseUVBT3JCRSxHQVBxQixtQkFPaEJDLEdBUGdCO0FBQUE7QUFBQSxtQkFRVkMsU0FBUyxDQUFDRixHQUFELENBQVQsQ0FBZVAsR0FBZixFQUFvQkcsSUFBcEIsRUFBMEJDLEdBQTFCLENBUlU7O0FBQUE7QUFRekJNLFlBQUFBLE1BUnlCO0FBUy9CZCxZQUFBQSxDQUFDLENBQUNlLFNBQUYsQ0FBWUgsR0FBWixFQUFpQkUsTUFBakI7O0FBVCtCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQW5DOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJ1xuaW1wb3J0IHsgVklERU9fUFJPRklMRVMgfSBmcm9tICdAbGl2ZXBlZXIvc2RrJ1xuaW1wb3J0ICogYXMgcmVzb2x2ZXJzIGZyb20gJy4vSm9iUHJvZmlsZSdcblxudGVzdCgnSm9iUHJvZmlsZSByZXNvbHZlcyBmaWVsZHMnLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgeyBoYXNoLCAuLi5vYmogfSA9IFZJREVPX1BST0ZJTEVTLlAxNDRwMzBmcHMxNng5XG4gIG9iai5pZCA9IGhhc2hcbiAgb2JqLm5hbWUgPSAnUDE0NHAzMGZwczE2eDknXG4gIGNvbnN0IGFyZ3MgPSBudWxsXG4gIGNvbnN0IGN0eCA9IHt9XG4gIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvYmopXG4gIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzW2tleV0ob2JqLCBhcmdzLCBjdHgpXG4gICAgdC5kZWVwRXF1YWwodmFsLCByZXN1bHQpXG4gIH1cbn0pXG4iXX0=
