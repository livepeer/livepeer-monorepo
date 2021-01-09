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

var resolvers = _interopRequireWildcard(require('./Transaction'))

;(0, _ava.default)(
  'Transaction resolves fields',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var obj, args, ctx, entries, _i, _entries, _entries$_i, key, val, result

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj = {
                  blockNumber: '5631830',
                  timeStamp: '1526599255',
                  id:
                    '0x7dfe3a8c03f484740073fafddc280a5d695c5e83d2cbb4e7663000fadcbdb437',
                  nonce: '0',
                  blockHash:
                    '0x4960e87b111cce47d51e64994e7b2f218c15c2522ba733356e7b477c4a93d38d',
                  transactionIndex: '154',
                  from: '0x623117424ed6325f594318a74995f818c2758212',
                  to: '0xe04d445f8a20e1d64cc249a0f86843c2381c0b5b',
                  value: '400000000000000000',
                  gas: '21000',
                  gasPrice: '10000000000',
                  isError: '0',
                  status: '1',
                  input: '0x',
                  contractAddress: '',
                  cumulativeGasUsed: '6195463',
                  gasUsed: '21000',
                  confirmations: '3460',
                  // derived
                  contract: '',
                  method: '',
                  params: [],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvVHJhbnNhY3Rpb24udGVzdC5qcyJdLCJuYW1lcyI6WyJ0Iiwib2JqIiwiYmxvY2tOdW1iZXIiLCJ0aW1lU3RhbXAiLCJpZCIsIm5vbmNlIiwiYmxvY2tIYXNoIiwidHJhbnNhY3Rpb25JbmRleCIsImZyb20iLCJ0byIsInZhbHVlIiwiZ2FzIiwiZ2FzUHJpY2UiLCJpc0Vycm9yIiwic3RhdHVzIiwiaW5wdXQiLCJjb250cmFjdEFkZHJlc3MiLCJjdW11bGF0aXZlR2FzVXNlZCIsImdhc1VzZWQiLCJjb25maXJtYXRpb25zIiwiY29udHJhY3QiLCJtZXRob2QiLCJwYXJhbXMiLCJhcmdzIiwiY3R4IiwiZW50cmllcyIsIk9iamVjdCIsImtleSIsInZhbCIsInJlc29sdmVycyIsInJlc3VsdCIsImRlZXBFcXVhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUEsa0JBQUssNkJBQUw7QUFBQSxxRkFBb0MsaUJBQU1BLENBQU47QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUM1QkMsWUFBQUEsR0FENEIsR0FDdEI7QUFDVkMsY0FBQUEsV0FBVyxFQUFFLFNBREg7QUFFVkMsY0FBQUEsU0FBUyxFQUFFLFlBRkQ7QUFHVkMsY0FBQUEsRUFBRSxFQUFFLG9FQUhNO0FBSVZDLGNBQUFBLEtBQUssRUFBRSxHQUpHO0FBS1ZDLGNBQUFBLFNBQVMsRUFDUCxvRUFOUTtBQU9WQyxjQUFBQSxnQkFBZ0IsRUFBRSxLQVBSO0FBUVZDLGNBQUFBLElBQUksRUFBRSw0Q0FSSTtBQVNWQyxjQUFBQSxFQUFFLEVBQUUsNENBVE07QUFVVkMsY0FBQUEsS0FBSyxFQUFFLG9CQVZHO0FBV1ZDLGNBQUFBLEdBQUcsRUFBRSxPQVhLO0FBWVZDLGNBQUFBLFFBQVEsRUFBRSxhQVpBO0FBYVZDLGNBQUFBLE9BQU8sRUFBRSxHQWJDO0FBY1ZDLGNBQUFBLE1BQU0sRUFBRSxHQWRFO0FBZVZDLGNBQUFBLEtBQUssRUFBRSxJQWZHO0FBZ0JWQyxjQUFBQSxlQUFlLEVBQUUsRUFoQlA7QUFpQlZDLGNBQUFBLGlCQUFpQixFQUFFLFNBakJUO0FBa0JWQyxjQUFBQSxPQUFPLEVBQUUsT0FsQkM7QUFtQlZDLGNBQUFBLGFBQWEsRUFBRSxNQW5CTDtBQW9CVjtBQUNBQyxjQUFBQSxRQUFRLEVBQUUsRUFyQkE7QUFzQlZDLGNBQUFBLE1BQU0sRUFBRSxFQXRCRTtBQXVCVkMsY0FBQUEsTUFBTSxFQUFFO0FBdkJFLGFBRHNCO0FBMEI1QkMsWUFBQUEsSUExQjRCLEdBMEJyQixJQTFCcUI7QUEyQjVCQyxZQUFBQSxHQTNCNEIsR0EyQnRCLEVBM0JzQjtBQTRCNUJDLFlBQUFBLE9BNUI0QixHQTRCbEJDLE1BQU0sQ0FBQ0QsT0FBUCxDQUFleEIsR0FBZixDQTVCa0I7QUFBQSwrQkE2QlR3QixPQTdCUzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLHlFQTZCdEJFLEdBN0JzQixtQkE2QmpCQyxHQTdCaUI7QUFBQTtBQUFBLG1CQThCWEMsU0FBUyxDQUFDRixHQUFELENBQVQsQ0FBZTFCLEdBQWYsRUFBb0JzQixJQUFwQixFQUEwQkMsR0FBMUIsQ0E5Qlc7O0FBQUE7QUE4QjFCTSxZQUFBQSxNQTlCMEI7QUErQmhDOUIsWUFBQUEsQ0FBQyxDQUFDK0IsU0FBRixDQUFZSCxHQUFaLEVBQWlCRSxNQUFqQjs7QUEvQmdDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQXBDOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJ1xuaW1wb3J0ICogYXMgcmVzb2x2ZXJzIGZyb20gJy4vVHJhbnNhY3Rpb24nXG5cbnRlc3QoJ1RyYW5zYWN0aW9uIHJlc29sdmVzIGZpZWxkcycsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBvYmogPSB7XG4gICAgYmxvY2tOdW1iZXI6ICc1NjMxODMwJyxcbiAgICB0aW1lU3RhbXA6ICcxNTI2NTk5MjU1JyxcbiAgICBpZDogJzB4N2RmZTNhOGMwM2Y0ODQ3NDAwNzNmYWZkZGMyODBhNWQ2OTVjNWU4M2QyY2JiNGU3NjYzMDAwZmFkY2JkYjQzNycsXG4gICAgbm9uY2U6ICcwJyxcbiAgICBibG9ja0hhc2g6XG4gICAgICAnMHg0OTYwZTg3YjExMWNjZTQ3ZDUxZTY0OTk0ZTdiMmYyMThjMTVjMjUyMmJhNzMzMzU2ZTdiNDc3YzRhOTNkMzhkJyxcbiAgICB0cmFuc2FjdGlvbkluZGV4OiAnMTU0JyxcbiAgICBmcm9tOiAnMHg2MjMxMTc0MjRlZDYzMjVmNTk0MzE4YTc0OTk1ZjgxOGMyNzU4MjEyJyxcbiAgICB0bzogJzB4ZTA0ZDQ0NWY4YTIwZTFkNjRjYzI0OWEwZjg2ODQzYzIzODFjMGI1YicsXG4gICAgdmFsdWU6ICc0MDAwMDAwMDAwMDAwMDAwMDAnLFxuICAgIGdhczogJzIxMDAwJyxcbiAgICBnYXNQcmljZTogJzEwMDAwMDAwMDAwJyxcbiAgICBpc0Vycm9yOiAnMCcsXG4gICAgc3RhdHVzOiAnMScsXG4gICAgaW5wdXQ6ICcweCcsXG4gICAgY29udHJhY3RBZGRyZXNzOiAnJyxcbiAgICBjdW11bGF0aXZlR2FzVXNlZDogJzYxOTU0NjMnLFxuICAgIGdhc1VzZWQ6ICcyMTAwMCcsXG4gICAgY29uZmlybWF0aW9uczogJzM0NjAnLFxuICAgIC8vIGRlcml2ZWRcbiAgICBjb250cmFjdDogJycsXG4gICAgbWV0aG9kOiAnJyxcbiAgICBwYXJhbXM6IFtdLFxuICB9XG4gIGNvbnN0IGFyZ3MgPSBudWxsXG4gIGNvbnN0IGN0eCA9IHt9XG4gIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvYmopXG4gIGZvciAoY29uc3QgW2tleSwgdmFsXSBvZiBlbnRyaWVzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzW2tleV0ob2JqLCBhcmdzLCBjdHgpXG4gICAgdC5kZWVwRXF1YWwodmFsLCByZXN1bHQpXG4gIH1cbn0pXG4iXX0=
