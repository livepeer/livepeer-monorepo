'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/toConsumableArray'),
)

var _graphqlTools = require('graphql-tools')

var _graphqlTypeJson = _interopRequireDefault(require('graphql-type-json'))

var _types = _interopRequireDefault(require('./types'))

var _resolvers = _interopRequireDefault(require('./resolvers'))

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

var SchemaDef =
  '\nschema {\n  query: Query\n  mutation: Mutation\n  subscription: Subscription\n}\n'

var _default = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: [SchemaDef].concat(
    (0, _toConsumableArray2.default)(_types.default),
  ),
  resolvers: _objectSpread(
    _objectSpread({}, _resolvers.default),
    {},
    {
      JSON: _graphqlTypeJson.default,
    },
  ),
})

exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zY2hlbWEuanMiXSwibmFtZXMiOlsiU2NoZW1hRGVmIiwidHlwZURlZnMiLCJ0eXBlcyIsInJlc29sdmVycyIsIkpTT04iLCJHcmFwaFFMSlNPTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLHdGQUFmOztlQVFlLHdDQUFxQjtBQUNsQ0MsRUFBQUEsUUFBUSxHQUFHRCxTQUFILDBDQUFpQkUsY0FBakIsRUFEMEI7QUFFbENDLEVBQUFBLFNBQVMsa0NBQU9BLGtCQUFQO0FBQWtCQyxJQUFBQSxJQUFJLEVBQUVDO0FBQXhCO0FBRnlCLENBQXJCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtYWtlRXhlY3V0YWJsZVNjaGVtYSB9IGZyb20gJ2dyYXBocWwtdG9vbHMnXG5pbXBvcnQgR3JhcGhRTEpTT04gZnJvbSAnZ3JhcGhxbC10eXBlLWpzb24nXG5pbXBvcnQgdHlwZXMgZnJvbSAnLi90eXBlcydcbmltcG9ydCByZXNvbHZlcnMgZnJvbSAnLi9yZXNvbHZlcnMnXG5cbmNvbnN0IFNjaGVtYURlZiA9IGBcbnNjaGVtYSB7XG4gIHF1ZXJ5OiBRdWVyeVxuICBtdXRhdGlvbjogTXV0YXRpb25cbiAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25cbn1cbmBcblxuZXhwb3J0IGRlZmF1bHQgbWFrZUV4ZWN1dGFibGVTY2hlbWEoe1xuICB0eXBlRGVmczogW1NjaGVtYURlZiwgLi4udHlwZXNdLFxuICByZXNvbHZlcnM6IHsgLi4ucmVzb2x2ZXJzLCBKU09OOiBHcmFwaFFMSlNPTiB9LFxufSlcbiJdfQ==
