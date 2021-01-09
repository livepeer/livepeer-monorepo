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

var resolvers = _interopRequireWildcard(require('./Account'))

;(0, _ava.default)(
  'Account resolves fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var obj, args, ctx, entries, _i, _entries, _entries$_i, key, val, result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj = {
                  id: '0xf00',
                  ensName: 'foo.test',
                  ethBalance: '0',
                  tokenBalance: '0',
                  broadcaster: {
                    id: '0xf00',
                  },
                  delegator: {
                    id: '0xf00',
                  },
                  transcoder: {
                    id: '0xf00',
                  },
                }
                args = null
                ctx = {
                  livepeer: {
                    rpc: {
                      getEthBalance: function getEthBalance() {
                        return '0'
                      },
                      getTokenBalance: function getTokenBalance() {
                        return '0'
                      },
                      getBroadcaster: function getBroadcaster() {
                        return {
                          id: obj.id,
                        }
                      },
                      getDelegator: function getDelegator() {
                        return {
                          id: obj.id,
                        }
                      },
                      getTranscoder: function getTranscoder() {
                        return {
                          id: obj.id,
                        }
                      },
                    },
                  },
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQWNjb3VudC50ZXN0LmpzIl0sIm5hbWVzIjpbInQiLCJvYmoiLCJpZCIsImVuc05hbWUiLCJldGhCYWxhbmNlIiwidG9rZW5CYWxhbmNlIiwiYnJvYWRjYXN0ZXIiLCJkZWxlZ2F0b3IiLCJ0cmFuc2NvZGVyIiwiYXJncyIsImN0eCIsImxpdmVwZWVyIiwicnBjIiwiZ2V0RXRoQmFsYW5jZSIsImdldFRva2VuQmFsYW5jZSIsImdldEJyb2FkY2FzdGVyIiwiZ2V0RGVsZWdhdG9yIiwiZ2V0VHJhbnNjb2RlciIsImVudHJpZXMiLCJPYmplY3QiLCJrZXkiLCJ2YWwiLCJyZXNvbHZlcnMiLCJyZXN1bHQiLCJkZWVwRXF1YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUVBLGtCQUFLLHlCQUFMO0FBQUEscUZBQWdDLGlCQUFNQSxDQUFOO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDeEJDLFlBQUFBLEdBRHdCLEdBQ2xCO0FBQ1ZDLGNBQUFBLEVBQUUsRUFBRSxPQURNO0FBRVZDLGNBQUFBLE9BQU8sRUFBRSxVQUZDO0FBR1ZDLGNBQUFBLFVBQVUsRUFBRSxHQUhGO0FBSVZDLGNBQUFBLFlBQVksRUFBRSxHQUpKO0FBS1ZDLGNBQUFBLFdBQVcsRUFBRTtBQUNYSixnQkFBQUEsRUFBRSxFQUFFO0FBRE8sZUFMSDtBQVFWSyxjQUFBQSxTQUFTLEVBQUU7QUFDVEwsZ0JBQUFBLEVBQUUsRUFBRTtBQURLLGVBUkQ7QUFXVk0sY0FBQUEsVUFBVSxFQUFFO0FBQ1ZOLGdCQUFBQSxFQUFFLEVBQUU7QUFETTtBQVhGLGFBRGtCO0FBZ0J4Qk8sWUFBQUEsSUFoQndCLEdBZ0JqQixJQWhCaUI7QUFpQnhCQyxZQUFBQSxHQWpCd0IsR0FpQmxCO0FBQ1ZDLGNBQUFBLFFBQVEsRUFBRTtBQUNSQyxnQkFBQUEsR0FBRyxFQUFFO0FBQ0hDLGtCQUFBQSxhQUFhLEVBQUU7QUFBQSwyQkFBTSxHQUFOO0FBQUEsbUJBRFo7QUFFSEMsa0JBQUFBLGVBQWUsRUFBRTtBQUFBLDJCQUFNLEdBQU47QUFBQSxtQkFGZDtBQUdIQyxrQkFBQUEsY0FBYyxFQUFFO0FBQUEsMkJBQU87QUFDckJiLHNCQUFBQSxFQUFFLEVBQUVELEdBQUcsQ0FBQ0M7QUFEYSxxQkFBUDtBQUFBLG1CQUhiO0FBTUhjLGtCQUFBQSxZQUFZLEVBQUU7QUFBQSwyQkFBTztBQUNuQmQsc0JBQUFBLEVBQUUsRUFBRUQsR0FBRyxDQUFDQztBQURXLHFCQUFQO0FBQUEsbUJBTlg7QUFTSGUsa0JBQUFBLGFBQWEsRUFBRTtBQUFBLDJCQUFPO0FBQ3BCZixzQkFBQUEsRUFBRSxFQUFFRCxHQUFHLENBQUNDO0FBRFkscUJBQVA7QUFBQTtBQVRaO0FBREc7QUFEQSxhQWpCa0I7QUFrQ3hCZ0IsWUFBQUEsT0FsQ3dCLEdBa0NkQyxNQUFNLENBQUNELE9BQVAsQ0FBZWpCLEdBQWYsQ0FsQ2M7QUFBQSwrQkFtQ0xpQixPQW5DSzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLHlFQW1DbEJFLEdBbkNrQixtQkFtQ2JDLEdBbkNhO0FBQUE7QUFBQSxtQkFvQ1BDLFNBQVMsQ0FBQ0YsR0FBRCxDQUFULENBQWVuQixHQUFmLEVBQW9CUSxJQUFwQixFQUEwQkMsR0FBMUIsQ0FwQ087O0FBQUE7QUFvQ3RCYSxZQUFBQSxNQXBDc0I7QUFxQzVCdkIsWUFBQUEsQ0FBQyxDQUFDd0IsU0FBRixDQUFZSCxHQUFaLEVBQWlCRSxNQUFqQjs7QUFyQzRCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQWhDOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJ1xuaW1wb3J0ICogYXMgcmVzb2x2ZXJzIGZyb20gJy4vQWNjb3VudCdcblxudGVzdCgnQWNjb3VudCByZXNvbHZlcyBmaWVsZHMnLCBhc3luYyB0ID0+IHtcbiAgY29uc3Qgb2JqID0ge1xuICAgIGlkOiAnMHhmMDAnLFxuICAgIGVuc05hbWU6ICdmb28udGVzdCcsXG4gICAgZXRoQmFsYW5jZTogJzAnLFxuICAgIHRva2VuQmFsYW5jZTogJzAnLFxuICAgIGJyb2FkY2FzdGVyOiB7XG4gICAgICBpZDogJzB4ZjAwJyxcbiAgICB9LFxuICAgIGRlbGVnYXRvcjoge1xuICAgICAgaWQ6ICcweGYwMCcsXG4gICAgfSxcbiAgICB0cmFuc2NvZGVyOiB7XG4gICAgICBpZDogJzB4ZjAwJyxcbiAgICB9LFxuICB9XG4gIGNvbnN0IGFyZ3MgPSBudWxsXG4gIGNvbnN0IGN0eCA9IHtcbiAgICBsaXZlcGVlcjoge1xuICAgICAgcnBjOiB7XG4gICAgICAgIGdldEV0aEJhbGFuY2U6ICgpID0+ICcwJyxcbiAgICAgICAgZ2V0VG9rZW5CYWxhbmNlOiAoKSA9PiAnMCcsXG4gICAgICAgIGdldEJyb2FkY2FzdGVyOiAoKSA9PiAoe1xuICAgICAgICAgIGlkOiBvYmouaWQsXG4gICAgICAgIH0pLFxuICAgICAgICBnZXREZWxlZ2F0b3I6ICgpID0+ICh7XG4gICAgICAgICAgaWQ6IG9iai5pZCxcbiAgICAgICAgfSksXG4gICAgICAgIGdldFRyYW5zY29kZXI6ICgpID0+ICh7XG4gICAgICAgICAgaWQ6IG9iai5pZCxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbiAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKG9iailcbiAgZm9yIChjb25zdCBba2V5LCB2YWxdIG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNvbHZlcnNba2V5XShvYmosIGFyZ3MsIGN0eClcbiAgICB0LmRlZXBFcXVhbCh2YWwsIHJlc3VsdClcbiAgfVxufSlcbiJdfQ==
