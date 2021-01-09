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

var resolvers = _interopRequireWildcard(require('./Broadcaster'))

;(0, _ava.default)(
  'Broadcaster resolves fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var obj, args, ctx, entries, _i, _entries, _entries$_i, key, val, result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj = {
                  id: 'foo',
                  deposit: '0',
                  withdrawBlock: '0',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvQnJvYWRjYXN0ZXIudGVzdC5qcyJdLCJuYW1lcyI6WyJ0Iiwib2JqIiwiaWQiLCJkZXBvc2l0Iiwid2l0aGRyYXdCbG9jayIsImFyZ3MiLCJjdHgiLCJlbnRyaWVzIiwiT2JqZWN0Iiwia2V5IiwidmFsIiwicmVzb2x2ZXJzIiwicmVzdWx0IiwiZGVlcEVxdWFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQSxrQkFBSyw2QkFBTDtBQUFBLHFGQUFvQyxpQkFBTUEsQ0FBTjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQzVCQyxZQUFBQSxHQUQ0QixHQUN0QjtBQUNWQyxjQUFBQSxFQUFFLEVBQUUsS0FETTtBQUVWQyxjQUFBQSxPQUFPLEVBQUUsR0FGQztBQUdWQyxjQUFBQSxhQUFhLEVBQUU7QUFITCxhQURzQjtBQU01QkMsWUFBQUEsSUFONEIsR0FNckIsSUFOcUI7QUFPNUJDLFlBQUFBLEdBUDRCLEdBT3RCLEVBUHNCO0FBUTVCQyxZQUFBQSxPQVI0QixHQVFsQkMsTUFBTSxDQUFDRCxPQUFQLENBQWVOLEdBQWYsQ0FSa0I7QUFBQSwrQkFTVE0sT0FUUzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLHlFQVN0QkUsR0FUc0IsbUJBU2pCQyxHQVRpQjtBQUFBO0FBQUEsbUJBVVhDLFNBQVMsQ0FBQ0YsR0FBRCxDQUFULENBQWVSLEdBQWYsRUFBb0JJLElBQXBCLEVBQTBCQyxHQUExQixDQVZXOztBQUFBO0FBVTFCTSxZQUFBQSxNQVYwQjtBQVdoQ1osWUFBQUEsQ0FBQyxDQUFDYSxTQUFGLENBQVlILEdBQVosRUFBaUJFLE1BQWpCOztBQVhnQztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFwQzs7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ2F2YSdcbmltcG9ydCAqIGFzIHJlc29sdmVycyBmcm9tICcuL0Jyb2FkY2FzdGVyJ1xuXG50ZXN0KCdCcm9hZGNhc3RlciByZXNvbHZlcyBmaWVsZHMnLCBhc3luYyB0ID0+IHtcbiAgY29uc3Qgb2JqID0ge1xuICAgIGlkOiAnZm9vJyxcbiAgICBkZXBvc2l0OiAnMCcsXG4gICAgd2l0aGRyYXdCbG9jazogJzAnLFxuICB9XG4gIGNvbnN0IGFyZ3MgPSBudWxsXG4gIGNvbnN0IGN0eCA9IHt9XG4gIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvYmopXG4gIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzW2tleV0ob2JqLCBhcmdzLCBjdHgpXG4gICAgdC5kZWVwRXF1YWwodmFsLCByZXN1bHQpXG4gIH1cbn0pXG4iXX0=
