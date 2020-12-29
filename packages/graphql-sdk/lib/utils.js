'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.transformJob = transformJob

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
)

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    keys.push.apply(keys, symbols)
  }
  return keys
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        ;(0, _defineProperty2.default)(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        )
      })
    }
  }
  return target
}

function transformJob(_ref) {
  var id = _ref.id,
    streamId = _ref.streamId,
    transcodingOptions = _ref.transcodingOptions,
    broadcaster = _ref.broadcaster
  return {
    type: 'JobType',
    id: id,
    broadcaster: broadcaster,
    profiles: transcodingOptions.map(function (_ref2) {
      var hash = _ref2.hash,
        profile = (0, _objectWithoutProperties2.default)(_ref2, ['hash'])
      return _objectSpread(
        {
          id: hash,
        },
        profile,
      )
    }),
    streamId: streamId,
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJ0cmFuc2Zvcm1Kb2IiLCJpZCIsInN0cmVhbUlkIiwidHJhbnNjb2RpbmdPcHRpb25zIiwiYnJvYWRjYXN0ZXIiLCJ0eXBlIiwicHJvZmlsZXMiLCJtYXAiLCJoYXNoIiwicHJvZmlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTyxTQUFTQSxZQUFULE9BS0o7QUFBQSxNQUpEQyxFQUlDLFFBSkRBLEVBSUM7QUFBQSxNQUhEQyxRQUdDLFFBSERBLFFBR0M7QUFBQSxNQUZEQyxrQkFFQyxRQUZEQSxrQkFFQztBQUFBLE1BRERDLFdBQ0MsUUFEREEsV0FDQztBQUNELFNBQU87QUFDTEMsSUFBQUEsSUFBSSxFQUFFLFNBREQ7QUFFTEosSUFBQUEsRUFBRSxFQUFGQSxFQUZLO0FBR0xHLElBQUFBLFdBQVcsRUFBWEEsV0FISztBQUlMRSxJQUFBQSxRQUFRLEVBQUVILGtCQUFrQixDQUFDSSxHQUFuQixDQUF1QjtBQUFBLFVBQUdDLElBQUgsU0FBR0EsSUFBSDtBQUFBLFVBQVlDLE9BQVo7QUFBQTtBQUMvQlIsUUFBQUEsRUFBRSxFQUFFTztBQUQyQixTQUU1QkMsT0FGNEI7QUFBQSxLQUF2QixDQUpMO0FBUUxQLElBQUFBLFFBQVEsRUFBRUE7QUFSTCxHQUFQO0FBVUQiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtSm9iKHtcbiAgaWQsXG4gIHN0cmVhbUlkLFxuICB0cmFuc2NvZGluZ09wdGlvbnMsXG4gIGJyb2FkY2FzdGVyLFxufSkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdKb2JUeXBlJyxcbiAgICBpZCxcbiAgICBicm9hZGNhc3RlcixcbiAgICBwcm9maWxlczogdHJhbnNjb2RpbmdPcHRpb25zLm1hcCgoeyBoYXNoLCAuLi5wcm9maWxlIH0pID0+ICh7XG4gICAgICBpZDogaGFzaCxcbiAgICAgIC4uLnByb2ZpbGUsXG4gICAgfSkpLFxuICAgIHN0cmVhbUlkOiBzdHJlYW1JZCxcbiAgfVxufVxuIl19
