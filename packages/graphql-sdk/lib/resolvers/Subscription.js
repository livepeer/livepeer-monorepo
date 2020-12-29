'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = exports.publish = exports.TransactionConfirmed = exports.TransactionSubmitted = exports.pubsub = void 0

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/toConsumableArray'),
)

var _graphqlSubscriptions = require('graphql-subscriptions')

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

var pubsub = new _graphqlSubscriptions.PubSub()
exports.pubsub = pubsub
var TransactionSubmitted = 'transactionSubmitted'
exports.TransactionSubmitted = TransactionSubmitted
var TransactionConfirmed = 'transactionConfirmed'
exports.TransactionConfirmed = TransactionConfirmed

var publish = function publish(type, payload) {
  pubsub.publish(type, payload)
}

exports.publish = publish
var _default = {
  transactionSubmitted: {
    resolve: function resolve(obj, args, ctx) {
      // Directly persist data to cache
      // console.log('got pending tx', obj)
      if (ctx && ctx.cache) cachePendingTransaction(ctx, obj)
      return obj
    },
    subscribe: function subscribe(obj, args, ctx) {
      return pubsub.asyncIterator(TransactionSubmitted)
    },
  },
  transactionConfirmed: {
    resolve: function resolve(obj, args, ctx) {
      // Directly remove data from cache
      // console.log('got confirmed tx', obj)
      if (ctx && ctx.cache) purgePendingTransaction(ctx, obj)
      return obj
    },
    subscribe: function subscribe(obj, args, ctx) {
      return pubsub.asyncIterator(TransactionConfirmed)
    },
  },
}
exports.default = _default

function cachePendingTransaction(_ref, obj) {
  var persistor = _ref.persistor
  var cache = persistor.cache.cache
  var data = cache.data.data // console.log(cache)

  var documentId = 'Transaction:'.concat(obj.id)
  var collectionId = 'pendingTransactions({"address":"'.concat(obj.from, '"})')
  var collection = data.ROOT_QUERY[collectionId] || []
  var document = data[documentId] || {}
  data.ROOT_QUERY[collectionId] = [
    {
      type: 'id',
      id: documentId,
      generated: false,
    },
  ].concat((0, _toConsumableArray2.default)(collection))
  data[documentId] = _objectSpread(
    _objectSpread({}, obj),
    {},
    {
      params: {
        type: 'json',
        json: obj.params,
      },
      __typename: 'Transaction',
    },
  )
  persistor.persist()
}

function purgePendingTransaction(_ref2, obj) {
  var persistor = _ref2.persistor
  var cache = persistor.cache.cache
  var data = cache.data.data
  var documentId = 'Transaction:'.concat(obj.id)
  var collectionId = 'pendingTransactions({"address":"'.concat(obj.from, '"})')
  var collection = data.ROOT_QUERY[collectionId] || []
  var document = data[documentId] || {}
  data.ROOT_QUERY[collectionId] = collection.filter(function (x) {
    return x.id !== documentId
  })
  data[documentId] = document.gasUsed
    ? document
    : _objectSpread(
        _objectSpread(_objectSpread({}, document), obj),
        {},
        {
          params: {
            type: 'json',
            json: obj.params,
          },
          __typename: 'Transaction',
        },
      )
  data['Delegator:'.concat(obj.from)] = _objectSpread(
    {
      lastClaimRound: obj.params._endRound,
    },
    data['Delegator:'.concat(obj.from)],
  )
  persistor.persist()
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvU3Vic2NyaXB0aW9uLmpzIl0sIm5hbWVzIjpbInB1YnN1YiIsIlB1YlN1YiIsIlRyYW5zYWN0aW9uU3VibWl0dGVkIiwiVHJhbnNhY3Rpb25Db25maXJtZWQiLCJwdWJsaXNoIiwidHlwZSIsInBheWxvYWQiLCJ0cmFuc2FjdGlvblN1Ym1pdHRlZCIsInJlc29sdmUiLCJvYmoiLCJhcmdzIiwiY3R4IiwiY2FjaGUiLCJjYWNoZVBlbmRpbmdUcmFuc2FjdGlvbiIsInN1YnNjcmliZSIsImFzeW5jSXRlcmF0b3IiLCJ0cmFuc2FjdGlvbkNvbmZpcm1lZCIsInB1cmdlUGVuZGluZ1RyYW5zYWN0aW9uIiwicGVyc2lzdG9yIiwiZGF0YSIsImRvY3VtZW50SWQiLCJpZCIsImNvbGxlY3Rpb25JZCIsImZyb20iLCJjb2xsZWN0aW9uIiwiUk9PVF9RVUVSWSIsImRvY3VtZW50IiwiZ2VuZXJhdGVkIiwicGFyYW1zIiwianNvbiIsIl9fdHlwZW5hbWUiLCJwZXJzaXN0IiwiZmlsdGVyIiwieCIsImdhc1VzZWQiLCJsYXN0Q2xhaW1Sb3VuZCIsIl9lbmRSb3VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFTyxJQUFNQSxNQUFNLEdBQUcsSUFBSUMsNEJBQUosRUFBZjs7QUFFQSxJQUFNQyxvQkFBb0IsR0FBRyxzQkFBN0I7O0FBRUEsSUFBTUMsb0JBQW9CLEdBQUcsc0JBQTdCOzs7QUFFQSxJQUFNQyxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDQyxJQUFELEVBQU9DLE9BQVAsRUFBbUI7QUFDeENOLEVBQUFBLE1BQU0sQ0FBQ0ksT0FBUCxDQUFlQyxJQUFmLEVBQXFCQyxPQUFyQjtBQUNELENBRk07OztlQUlRO0FBQ2JDLEVBQUFBLG9CQUFvQixFQUFFO0FBQ3BCQyxJQUFBQSxPQUFPLEVBQUUsaUJBQUNDLEdBQUQsRUFBTUMsSUFBTixFQUFZQyxHQUFaLEVBQW9CO0FBQzNCO0FBQ0E7QUFDQSxVQUFJ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S0FBU0QsVUFBYjtBQUFBLEdBQW5CLENBQWhDO0FBQ0FELEVBQUFBLElBQUksQ0FBQ0MsVUFBRCxDQUFKLEdBQW1CTSxRQUFRLENBQUNRLE9BQVQsR0FDZlIsUUFEZSxpREFHVkEsUUFIVSxHQUlWakIsR0FKVTtBQUtibUIsSUFBQUEsTUFBTSxFQUFFO0FBQUV2QixNQUFBQSxJQUFJLEVBQUUsTUFBUjtBQUFnQndCLE1BQUFBLElBQUksRUFBRXBCLEdBQUcsQ0FBQ21CO0FBQTFCLEtBTEs7QUFNYkUsSUFBQUEsVUFBVSxFQUFFO0FBTkMsSUFBbkI7QUFRQVgsRUFBQUEsSUFBSSxxQkFBY1YsR0FBRyxDQUFDYyxJQUFsQixFQUFKO0FBQ0VZLElBQUFBLGNBQWMsRUFBRTFCLEdBQUcsQ0FBQ21CLE1BQUosQ0FBV1E7QUFEN0IsS0FFS2pCLElBQUkscUJBQWNWLEdBQUcsQ0FBQ2MsSUFBbEIsRUFGVDtBQUlBTCxFQUFBQSxTQUFTLENBQUNhLE9BQVY7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFB1YlN1YiB9IGZyb20gJ2dyYXBocWwtc3Vic2NyaXB0aW9ucydcblxuZXhwb3J0IGNvbnN0IHB1YnN1YiA9IG5ldyBQdWJTdWIoKVxuXG5leHBvcnQgY29uc3QgVHJhbnNhY3Rpb25TdWJtaXR0ZWQgPSAndHJhbnNhY3Rpb25TdWJtaXR0ZWQnXG5cbmV4cG9ydCBjb25zdCBUcmFuc2FjdGlvbkNvbmZpcm1lZCA9ICd0cmFuc2FjdGlvbkNvbmZpcm1lZCdcblxuZXhwb3J0IGNvbnN0IHB1Ymxpc2ggPSAodHlwZSwgcGF5bG9hZCkgPT4ge1xuICBwdWJzdWIucHVibGlzaCh0eXBlLCBwYXlsb2FkKVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHRyYW5zYWN0aW9uU3VibWl0dGVkOiB7XG4gICAgcmVzb2x2ZTogKG9iaiwgYXJncywgY3R4KSA9PiB7XG4gICAgICAvLyBEaXJlY3RseSBwZXJzaXN0IGRhdGEgdG8gY2FjaGVcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdnb3QgcGVuZGluZyB0eCcsIG9iailcbiAgICAgIGlmIChjdHggJiYgY3R4LmNhY2hlKSBjYWNoZVBlbmRpbmdUcmFuc2FjdGlvbihjdHgsIG9iailcbiAgICAgIHJldHVybiBvYmpcbiAgICB9LFxuICAgIHN1YnNjcmliZTogKG9iaiwgYXJncywgY3R4KSA9PiBwdWJzdWIuYXN5bmNJdGVyYXRvcihUcmFuc2FjdGlvblN1Ym1pdHRlZCksXG4gIH0sXG4gIHRyYW5zYWN0aW9uQ29uZmlybWVkOiB7XG4gICAgcmVzb2x2ZTogKG9iaiwgYXJncywgY3R4KSA9PiB7XG4gICAgICAvLyBEaXJlY3RseSByZW1vdmUgZGF0YSBmcm9tIGNhY2hlXG4gICAgICAvLyBjb25zb2xlLmxvZygnZ290IGNvbmZpcm1lZCB0eCcsIG9iailcbiAgICAgIGlmIChjdHggJiYgY3R4LmNhY2hlKSBwdXJnZVBlbmRpbmdUcmFuc2FjdGlvbihjdHgsIG9iailcbiAgICAgIHJldHVybiBvYmpcbiAgICB9LFxuICAgIHN1YnNjcmliZTogKG9iaiwgYXJncywgY3R4KSA9PiBwdWJzdWIuYXN5bmNJdGVyYXRvcihUcmFuc2FjdGlvbkNvbmZpcm1lZCksXG4gIH0sXG59XG5cbmZ1bmN0aW9uIGNhY2hlUGVuZGluZ1RyYW5zYWN0aW9uKHsgcGVyc2lzdG9yIH0sIG9iaikge1xuICBjb25zdCB7IGNhY2hlIH0gPSBwZXJzaXN0b3IuY2FjaGVcbiAgY29uc3QgeyBkYXRhIH0gPSBjYWNoZS5kYXRhXG4gIC8vIGNvbnNvbGUubG9nKGNhY2hlKVxuICBjb25zdCBkb2N1bWVudElkID0gYFRyYW5zYWN0aW9uOiR7b2JqLmlkfWBcbiAgY29uc3QgY29sbGVjdGlvbklkID0gYHBlbmRpbmdUcmFuc2FjdGlvbnMoe1wiYWRkcmVzc1wiOlwiJHtvYmouZnJvbX1cIn0pYFxuICBjb25zdCBjb2xsZWN0aW9uID0gZGF0YS5ST09UX1FVRVJZW2NvbGxlY3Rpb25JZF0gfHwgW11cbiAgY29uc3QgZG9jdW1lbnQgPSBkYXRhW2RvY3VtZW50SWRdIHx8IHt9XG4gIGRhdGEuUk9PVF9RVUVSWVtjb2xsZWN0aW9uSWRdID0gW1xuICAgIHsgdHlwZTogJ2lkJywgaWQ6IGRvY3VtZW50SWQsIGdlbmVyYXRlZDogZmFsc2UgfSxcbiAgICAuLi5jb2xsZWN0aW9uLFxuICBdXG4gIGRhdGFbZG9jdW1lbnRJZF0gPSB7XG4gICAgLi4ub2JqLFxuICAgIHBhcmFtczogeyB0eXBlOiAnanNvbicsIGpzb246IG9iai5wYXJhbXMgfSxcbiAgICBfX3R5cGVuYW1lOiAnVHJhbnNhY3Rpb24nLFxuICB9XG4gIHBlcnNpc3Rvci5wZXJzaXN0KClcbn1cblxuZnVuY3Rpb24gcHVyZ2VQZW5kaW5nVHJhbnNhY3Rpb24oeyBwZXJzaXN0b3IgfSwgb2JqKSB7XG4gIGNvbnN0IHsgY2FjaGUgfSA9IHBlcnNpc3Rvci5jYWNoZVxuICBjb25zdCB7IGRhdGEgfSA9IGNhY2hlLmRhdGFcbiAgY29uc3QgZG9jdW1lbnRJZCA9IGBUcmFuc2FjdGlvbjoke29iai5pZH1gXG4gIGNvbnN0IGNvbGxlY3Rpb25JZCA9IGBwZW5kaW5nVHJhbnNhY3Rpb25zKHtcImFkZHJlc3NcIjpcIiR7b2JqLmZyb219XCJ9KWBcbiAgY29uc3QgY29sbGVjdGlvbiA9IGRhdGEuUk9PVF9RVUVSWVtjb2xsZWN0aW9uSWRdIHx8IFtdXG4gIGNvbnN0IGRvY3VtZW50ID0gZGF0YVtkb2N1bWVudElkXSB8fCB7fVxuICBkYXRhLlJPT1RfUVVFUllbY29sbGVjdGlvbklkXSA9IGNvbGxlY3Rpb24uZmlsdGVyKHggPT4geC5pZCAhPT0gZG9jdW1lbnRJZClcbiAgZGF0YVtkb2N1bWVudElkXSA9IGRvY3VtZW50Lmdhc1VzZWRcbiAgICA/IGRvY3VtZW50XG4gICAgOiB7XG4gICAgICAgIC4uLmRvY3VtZW50LFxuICAgICAgICAuLi5vYmosXG4gICAgICAgIHBhcmFtczogeyB0eXBlOiAnanNvbicsIGpzb246IG9iai5wYXJhbXMgfSxcbiAgICAgICAgX190eXBlbmFtZTogJ1RyYW5zYWN0aW9uJyxcbiAgICAgIH1cbiAgZGF0YVtgRGVsZWdhdG9yOiR7b2JqLmZyb219YF0gPSB7XG4gICAgbGFzdENsYWltUm91bmQ6IG9iai5wYXJhbXMuX2VuZFJvdW5kLFxuICAgIC4uLmRhdGFbYERlbGVnYXRvcjoke29iai5mcm9tfWBdLFxuICB9XG4gIHBlcnNpc3Rvci5wZXJzaXN0KClcbn1cbiJdfQ==
