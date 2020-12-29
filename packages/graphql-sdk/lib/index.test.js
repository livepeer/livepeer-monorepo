'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
)

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

require('cross-fetch/polyfill')

var _ava = _interopRequireDefault(require('ava'))

var _graphql = require('graphql')

var _sdk = require('@livepeer/sdk')

var _schema = _interopRequireDefault(require('./schema'))

var _queries = require('./queries')

var _mockSdk = _interopRequireDefault(require('./mock-sdk'))

var _Subscription = require('./resolvers/Subscription')

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

;(0, _ava.default)(
  'graphql init',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var res
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                _context.next = 2
                return (0, _graphql.graphql)(
                  _schema.default,
                  _graphql.introspectionQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  {},
                )

              case 2:
                res = _context.sent
                // console.log(res)
                t.pass()

              case 4:
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
;(0, _ava.default)(
  'Subscription',
  /*#__PURE__*/ (function () {
    var _ref2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee2(t) {
        var query, ast, subscription, prom
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                query =
                  '\n    subscription {\n      transactionSubmitted {\n        id\n        contract\n        gas\n        gasUsed\n        gasPrice\n        id\n        method\n        nonce\n        params\n        status\n        timeStamp\n      }\n    }\n  '
                ast = (0, _graphql.parse)(query)
                _context2.next = 4
                return (0, _graphql.subscribe)(_schema.default, ast)

              case 4:
                subscription = _context2.sent
                prom = subscription.next()
                ;(0, _Subscription.publish)(
                  _Subscription.TransactionSubmitted,
                  {
                    contract: 'BondingManager',
                    gas: '',
                    gasUsed: '',
                    gasPrice: '',
                    id: ''.concat(Date.now()),
                    method: 'claimEarnings',
                    nonce: '',
                    params: {
                      endRound: 0,
                    },
                    status: 'pending',
                    timeStamp: ''.concat(Math.floor(Date.now() / 1000)),
                  },
                )
                _context2.next = 9
                return prom

              case 9:
                t.pass()

              case 10:
              case 'end':
                return _context2.stop()
            }
          }
        }, _callee2)
      }),
    )

    return function (_x2) {
      return _ref2.apply(this, arguments)
    }
  })(),
)
/**
 * Account
 */

;(0, _ava.default)(
  'AccountQuery (with ID)',
  /*#__PURE__*/ (function () {
    var _ref3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee3(t) {
        var args, res
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                  lockId: '0',
                }
                _context3.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.AccountQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context3.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context3.stop()
            }
          }
        }, _callee3)
      }),
    )

    return function (_x3) {
      return _ref3.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'AccountQuery (with ENS name)',
  /*#__PURE__*/ (function () {
    var _ref4 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee4(t) {
        var args, res
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                args = {
                  id: 'foo.test',
                  lockId: '0',
                }
                _context4.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.AccountQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context4.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context4.stop()
            }
          }
        }, _callee4)
      }),
    )

    return function (_x4) {
      return _ref4.apply(this, arguments)
    }
  })(),
)
/**
 * Account Broadcaster
 */

;(0, _ava.default)(
  'AccountBroadcasterQuery (with ID)',
  /*#__PURE__*/ (function () {
    var _ref5 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee5(t) {
        var args, res
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch ((_context5.prev = _context5.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                  jobs: false,
                }
                _context5.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.AccountBroadcasterQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context5.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context5.stop()
            }
          }
        }, _callee5)
      }),
    )

    return function (_x5) {
      return _ref5.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'AccountBroadcasterQuery (include jobs)',
  /*#__PURE__*/ (function () {
    var _ref6 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee6(t) {
        var args, res
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                  jobs: true,
                }
                _context6.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.AccountBroadcasterQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context6.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context6.stop()
            }
          }
        }, _callee6)
      }),
    )

    return function (_x6) {
      return _ref6.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'AccountBroadcasterQuery (include jobs using skip/limit args)',
  /*#__PURE__*/ (function () {
    var _ref7 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee7(t) {
        var args, res
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch ((_context7.prev = _context7.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                  jobs: true,
                  jobsSkip: 1,
                  jobsLimit: 1,
                }
                _context7.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.AccountBroadcasterQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context7.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context7.stop()
            }
          }
        }, _callee7)
      }),
    )

    return function (_x7) {
      return _ref7.apply(this, arguments)
    }
  })(),
)
/**
 * Block
 */

;(0, _ava.default)(
  'CurrentBlockQuery',
  /*#__PURE__*/ (function () {
    var _ref8 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee8(t) {
        var args, res
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch ((_context8.prev = _context8.next)) {
              case 0:
                args = {}
                _context8.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.CurrentBlockQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context8.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context8.stop()
            }
          }
        }, _callee8)
      }),
    )

    return function (_x8) {
      return _ref8.apply(this, arguments)
    }
  })(),
)
/**
 * Broadcaster
 */

;(0, _ava.default)(
  'BroadcasterQuery',
  /*#__PURE__*/ (function () {
    var _ref9 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee9(t) {
        var args, res
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch ((_context9.prev = _context9.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                  jobs: false,
                }
                _context9.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.BroadcasterQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context9.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context9.stop()
            }
          }
        }, _callee9)
      }),
    )

    return function (_x9) {
      return _ref9.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'BroadcasterQuery (include jobs)',
  /*#__PURE__*/ (function () {
    var _ref10 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee10(t) {
        var args, res
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch ((_context10.prev = _context10.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                  jobs: true,
                }
                _context10.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.BroadcasterQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context10.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context10.stop()
            }
          }
        }, _callee10)
      }),
    )

    return function (_x10) {
      return _ref10.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'BroadcasterQuery (include jobs using skip/limit args)',
  /*#__PURE__*/ (function () {
    var _ref11 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee11(t) {
        var args, res
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch ((_context11.prev = _context11.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                  jobs: true,
                  jobsSkip: 1,
                  jobsLimit: 1,
                }
                _context11.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.BroadcasterQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context11.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context11.stop()
            }
          }
        }, _callee11)
      }),
    )

    return function (_x11) {
      return _ref11.apply(this, arguments)
    }
  })(),
)
/**
 * Coinbase
 */

;(0, _ava.default)(
  'CoinbaseQuery (not authenticated)',
  /*#__PURE__*/ (function () {
    var _ref12 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee12(t) {
        var args, res
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch ((_context12.prev = _context12.next)) {
              case 0:
                args = null
                _context12.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.CoinbaseQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context12.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context12.stop()
            }
          }
        }, _callee12)
      }),
    )

    return function (_x12) {
      return _ref12.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'CoinbaseQuery (authenticated)',
  /*#__PURE__*/ (function () {
    var _ref13 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee13(t) {
        var args, res
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch ((_context13.prev = _context13.next)) {
              case 0:
                args = null
                _context13.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.CoinbaseQuery,
                  null,
                  {
                    account: '0x0ddb225031ccb58ff42866f82d907f7766899014',
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context13.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context13.stop()
            }
          }
        }, _callee13)
      }),
    )

    return function (_x13) {
      return _ref13.apply(this, arguments)
    }
  })(),
)
/**
 * Delegator
 */

;(0, _ava.default)(
  'DelegatorQuery',
  /*#__PURE__*/ (function () {
    var _ref14 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee14(t) {
        var args, res
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch ((_context14.prev = _context14.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                }
                _context14.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.DelegatorQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context14.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context14.stop()
            }
          }
        }, _callee14)
      }),
    )

    return function (_x14) {
      return _ref14.apply(this, arguments)
    }
  })(),
)
/**
 * Job
 */

;(0, _ava.default)(
  'JobQuery',
  /*#__PURE__*/ (function () {
    var _ref15 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee15(t) {
        var args, res
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch ((_context15.prev = _context15.next)) {
              case 0:
                args = {
                  id: '0',
                }
                _context15.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.JobQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context15.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context15.stop()
            }
          }
        }, _callee15)
      }),
    )

    return function (_x15) {
      return _ref15.apply(this, arguments)
    }
  })(),
)
/**
 * Jobs
 */

;(0, _ava.default)(
  'JobsQuery',
  /*#__PURE__*/ (function () {
    var _ref16 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee16(t) {
        var args, res
        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch ((_context16.prev = _context16.next)) {
              case 0:
                args = {}
                _context16.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.JobsQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context16.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context16.stop()
            }
          }
        }, _callee16)
      }),
    )

    return function (_x16) {
      return _ref16.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'JobsQuery (broadcaster arg)',
  /*#__PURE__*/ (function () {
    var _ref17 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee17(t) {
        var args, res
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch ((_context17.prev = _context17.next)) {
              case 0:
                args = {
                  broadcaster: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
                }
                _context17.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.JobsQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context17.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context17.stop()
            }
          }
        }, _callee17)
      }),
    )

    return function (_x17) {
      return _ref17.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'JobsQuery (skip arg)',
  /*#__PURE__*/ (function () {
    var _ref18 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee18(t) {
        var args, res
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch ((_context18.prev = _context18.next)) {
              case 0:
                args = {
                  skip: 1,
                }
                _context18.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.JobsQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context18.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context18.stop()
            }
          }
        }, _callee18)
      }),
    )

    return function (_x18) {
      return _ref18.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'JobsQuery (limit arg)',
  /*#__PURE__*/ (function () {
    var _ref19 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee19(t) {
        var args, res
        return _regenerator.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch ((_context19.prev = _context19.next)) {
              case 0:
                args = {
                  limit: 1,
                }
                _context19.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.JobsQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context19.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context19.stop()
            }
          }
        }, _callee19)
      }),
    )

    return function (_x19) {
      return _ref19.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'JobsQuery (skip / limit args)',
  /*#__PURE__*/ (function () {
    var _ref20 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee20(t) {
        var args, res
        return _regenerator.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch ((_context20.prev = _context20.next)) {
              case 0:
                args = {
                  skip: 1,
                  limit: 3,
                }
                _context20.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.JobsQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context20.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context20.stop()
            }
          }
        }, _callee20)
      }),
    )

    return function (_x20) {
      return _ref20.apply(this, arguments)
    }
  })(),
)
/**
 * Round
 */

;(0, _ava.default)(
  'CurrentRoundQuery',
  /*#__PURE__*/ (function () {
    var _ref21 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee21(t) {
        var args, res
        return _regenerator.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch ((_context21.prev = _context21.next)) {
              case 0:
                args = {}
                _context21.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.CurrentRoundQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context21.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context21.stop()
            }
          }
        }, _callee21)
      }),
    )

    return function (_x21) {
      return _ref21.apply(this, arguments)
    }
  })(),
)
/**
 * Transactions
 */

;(0, _ava.default)(
  'TransactionsQuery',
  /*#__PURE__*/ (function () {
    var _ref22 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee22(t) {
        var args, res, transactions
        return _regenerator.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch ((_context22.prev = _context22.next)) {
              case 0:
                args = {
                  address: '0x0000000000000000000000000000000000000000',
                  limit: '2',
                  sort: 'desc',
                  // this address has 3 txns in this range
                  // (1 on 46423, 1 on 46421, and 1 on 46420)
                  // this query should return the txns from the two more recent blocks
                  startBlock: '46420',
                  endBlock: '46423',
                }
                _context22.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.TransactionsQuery,
                  null,
                  {
                    persistor: {
                      cache: {
                        cache: {
                          data: {
                            data: {
                              ROOT_QUERY: {},
                            },
                          },
                        },
                      },
                    },
                    livepeer: _mockSdk.default,
                    etherscanApiKey: 'REYGA15N2SCUKVFQKG3C24USKSR8WZB29B',
                  },
                  args,
                )

              case 3:
                res = _context22.sent
                // remove "confirmations" field since it changes frequently
                transactions = res.data.transactions.map(function (_ref23) {
                  var confirmations = _ref23.confirmations,
                    tx = (0, _objectWithoutProperties2.default)(_ref23, [
                      'confirmations',
                    ])
                  return tx
                }) // console.log(JSON.stringify(res, null, 2))

                t.snapshot(
                  _objectSpread(
                    _objectSpread({}, res),
                    {},
                    {
                      data: _objectSpread(
                        _objectSpread({}, res.data),
                        {},
                        {
                          transactions: transactions,
                        },
                      ),
                    },
                  ),
                )

              case 6:
              case 'end':
                return _context22.stop()
            }
          }
        }, _callee22)
      }),
    )

    return function (_x22) {
      return _ref22.apply(this, arguments)
    }
  })(),
)
/**
 * Transcoder
 */

;(0, _ava.default)(
  'TranscoderQuery',
  /*#__PURE__*/ (function () {
    var _ref24 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee23(t) {
        var args, res
        return _regenerator.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch ((_context23.prev = _context23.next)) {
              case 0:
                args = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                }
                _context23.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.TranscoderQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context23.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context23.stop()
            }
          }
        }, _callee23)
      }),
    )

    return function (_x23) {
      return _ref24.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'TranscodersQuery',
  /*#__PURE__*/ (function () {
    var _ref25 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee24(t) {
        var args, res
        return _regenerator.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch ((_context24.prev = _context24.next)) {
              case 0:
                args = {}
                _context24.next = 3
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.TranscodersQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  args,
                )

              case 3:
                res = _context24.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 5:
              case 'end':
                return _context24.stop()
            }
          }
        }, _callee24)
      }),
    )

    return function (_x24) {
      return _ref25.apply(this, arguments)
    }
  })(),
)
/**
 * Protocol
 */

;(0, _ava.default)(
  'ProtocolQuery',
  /*#__PURE__*/ (function () {
    var _ref26 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee25(t) {
        var res
        return _regenerator.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch ((_context25.prev = _context25.next)) {
              case 0:
                _context25.next = 2
                return (0, _graphql.graphql)(
                  _schema.default,
                  _queries.ProtocolQuery,
                  null,
                  {
                    livepeer: _mockSdk.default,
                  },
                  {},
                )

              case 2:
                res = _context25.sent
                // console.log(JSON.stringify(res, null, 2))
                t.snapshot(res)

              case 4:
              case 'end':
                return _context25.stop()
            }
          }
        }, _callee25)
      }),
    )

    return function (_x25) {
      return _ref26.apply(this, arguments)
    }
  })(),
)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50ZXN0LmpzIl0sIm5hbWVzIjpbInQiLCJzY2hlbWEiLCJpbnRyb3NwZWN0aW9uUXVlcnkiLCJsaXZlcGVlciIsInJlcyIsInBhc3MiLCJxdWVyeSIsImFzdCIsInN1YnNjcmlwdGlvbiIsInByb20iLCJuZXh0IiwiVHJhbnNhY3Rpb25TdWJtaXR0ZWQiLCJjb250cmFjdCIsImdhcyIsImdhc1VzZWQiLCJnYXNQcmljZSIsImlkIiwiRGF0ZSIsIm5vdyIsIm1ldGhvZCIsIm5vbmNlIiwicGFyYW1zIiwiZW5kUm91bmQiLCJzdGF0dXMiLCJ0aW1lU3RhbXAiLCJNYXRoIiwiZmxvb3IiLCJhcmdzIiwiRU1QVFlfQUREUkVTUyIsInJlcGxhY2UiLCJsb2NrSWQiLCJBY2NvdW50UXVlcnkiLCJzbmFwc2hvdCIsImpvYnMiLCJBY2NvdW50QnJvYWRjYXN0ZXJRdWVyeSIsImpvYnNTa2lwIiwiam9ic0xpbWl0IiwiQ3VycmVudEJsb2NrUXVlcnkiLCJCcm9hZGNhc3RlclF1ZXJ5IiwiQ29pbmJhc2VRdWVyeSIsImFjY291bnQiLCJEZWxlZ2F0b3JRdWVyeSIsIkpvYlF1ZXJ5IiwiSm9ic1F1ZXJ5IiwiYnJvYWRjYXN0ZXIiLCJza2lwIiwibGltaXQiLCJDdXJyZW50Um91bmRRdWVyeSIsImFkZHJlc3MiLCJzb3J0Iiwic3RhcnRCbG9jayIsImVuZEJsb2NrIiwiVHJhbnNhY3Rpb25zUXVlcnkiLCJwZXJzaXN0b3IiLCJjYWNoZSIsImRhdGEiLCJST09UX1FVRVJZIiwiZXRoZXJzY2FuQXBpS2V5IiwidHJhbnNhY3Rpb25zIiwibWFwIiwiY29uZmlybWF0aW9ucyIsInR4IiwiVHJhbnNjb2RlclF1ZXJ5IiwiVHJhbnNjb2RlcnNRdWVyeSIsIlByb3RvY29sUXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQWVBOztBQUNBOzs7Ozs7QUFFQSxrQkFBSyxjQUFMO0FBQUEs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QTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUNGLHNCQUFRQyxlQUFSLEVBQWdCK0Qsc0JBQWhCLEVBQStCLElBQS9CLEVBQXFDO0FBQUU3RCxjQUFBQSxRQUFRLEVBQVJBO0FBQUYsYUFBckMsRUFBbUQsRUFBbkQsQ0FERTs7QUFBQTtBQUNkQyxZQUFBQSxHQURjO0FBRXBCO0FBQ0FKLFlBQUFBLENBQUMsQ0FBQ2dDLFFBQUYsQ0FBVzVCLEdBQVg7O0FBSG9CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQXRCOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdjcm9zcy1mZXRjaC9wb2x5ZmlsbCdcbmltcG9ydCB0ZXN0IGZyb20gJ2F2YSdcbmltcG9ydCB7IGdyYXBocWwsIGludHJvc3BlY3Rpb25RdWVyeSwgcGFyc2UsIHN1YnNjcmliZSB9IGZyb20gJ2dyYXBocWwnXG5pbXBvcnQgeyBFTVBUWV9BRERSRVNTIH0gZnJvbSAnQGxpdmVwZWVyL3Nkaydcbi8vIGltcG9ydCB7IHNjaGVtYSB9IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgc2NoZW1hIGZyb20gJy4vc2NoZW1hJ1xuaW1wb3J0IHtcbiAgQWNjb3VudFF1ZXJ5LFxuICBBY2NvdW50QnJvYWRjYXN0ZXJRdWVyeSxcbiAgQnJvYWRjYXN0ZXJRdWVyeSxcbiAgQ29pbmJhc2VRdWVyeSxcbiAgQ3VycmVudEJsb2NrUXVlcnksXG4gIEN1cnJlbnRSb3VuZFF1ZXJ5LFxuICBEZWxlZ2F0b3JRdWVyeSxcbiAgSm9iUXVlcnksXG4gIEpvYnNRdWVyeSxcbiAgVHJhbnNhY3Rpb25zUXVlcnksXG4gIFRyYW5zY29kZXJRdWVyeSxcbiAgVHJhbnNjb2RlcnNRdWVyeSxcbiAgUHJvdG9jb2xRdWVyeSxcbn0gZnJvbSAnLi9xdWVyaWVzJ1xuaW1wb3J0IGxpdmVwZWVyIGZyb20gJy4vbW9jay1zZGsnXG5pbXBvcnQgeyBwdWJsaXNoLCBUcmFuc2FjdGlvblN1Ym1pdHRlZCB9IGZyb20gJy4vcmVzb2x2ZXJzL1N1YnNjcmlwdGlvbidcblxudGVzdCgnZ3JhcGhxbCBpbml0JywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBpbnRyb3NwZWN0aW9uUXVlcnksIG51bGwsIHsgbGl2ZXBlZXIgfSwge30pXG4gIC8vIGNvbnNvbGUubG9nKHJlcylcbiAgdC5wYXNzKClcbn0pXG5cbnRlc3QoJ1N1YnNjcmlwdGlvbicsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBxdWVyeSA9IGBcbiAgICBzdWJzY3JpcHRpb24ge1xuICAgICAgdHJhbnNhY3Rpb25TdWJtaXR0ZWQge1xuICAgICAgICBpZFxuICAgICAgICBjb250cmFjdFxuICAgICAgICBnYXNcbiAgICAgICAgZ2FzVXNlZFxuICAgICAgICBnYXNQcmljZVxuICAgICAgICBpZFxuICAgICAgICBtZXRob2RcbiAgICAgICAgbm9uY2VcbiAgICAgICAgcGFyYW1zXG4gICAgICAgIHN0YXR1c1xuICAgICAgICB0aW1lU3RhbXBcbiAgICAgIH1cbiAgICB9XG4gIGBcbiAgY29uc3QgYXN0ID0gcGFyc2UocXVlcnkpXG4gIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGF3YWl0IHN1YnNjcmliZShzY2hlbWEsIGFzdClcbiAgY29uc3QgcHJvbSA9IHN1YnNjcmlwdGlvbi5uZXh0KClcbiAgcHVibGlzaChUcmFuc2FjdGlvblN1Ym1pdHRlZCwge1xuICAgIGNvbnRyYWN0OiAnQm9uZGluZ01hbmFnZXInLFxuICAgIGdhczogJycsXG4gICAgZ2FzVXNlZDogJycsXG4gICAgZ2FzUHJpY2U6ICcnLFxuICAgIGlkOiBgJHtEYXRlLm5vdygpfWAsXG4gICAgbWV0aG9kOiAnY2xhaW1FYXJuaW5ncycsXG4gICAgbm9uY2U6ICcnLFxuICAgIHBhcmFtczogeyBlbmRSb3VuZDogMCB9LFxuICAgIHN0YXR1czogJ3BlbmRpbmcnLFxuICAgIHRpbWVTdGFtcDogYCR7TWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCl9YCxcbiAgfSlcbiAgYXdhaXQgcHJvbVxuICB0LnBhc3MoKVxufSlcblxuLyoqXG4gKiBBY2NvdW50XG4gKi9cbnRlc3QoJ0FjY291bnRRdWVyeSAod2l0aCBJRCknLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgYXJncyA9IHtcbiAgICBpZDogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMjInKSxcbiAgICBsb2NrSWQ6ICcwJyxcbiAgfVxuICBjb25zdCByZXMgPSBhd2FpdCBncmFwaHFsKHNjaGVtYSwgQWNjb3VudFF1ZXJ5LCBudWxsLCB7IGxpdmVwZWVyIH0sIGFyZ3MpXG4gIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgMikpXG4gIHQuc25hcHNob3QocmVzKVxufSlcblxudGVzdCgnQWNjb3VudFF1ZXJ5ICh3aXRoIEVOUyBuYW1lKScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIGlkOiAnZm9vLnRlc3QnLFxuICAgIGxvY2tJZDogJzAnLFxuICB9XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBBY2NvdW50UXVlcnksIG51bGwsIHsgbGl2ZXBlZXIgfSwgYXJncylcbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSlcbiAgdC5zbmFwc2hvdChyZXMpXG59KVxuXG4vKipcbiAqIEFjY291bnQgQnJvYWRjYXN0ZXJcbiAqL1xudGVzdCgnQWNjb3VudEJyb2FkY2FzdGVyUXVlcnkgKHdpdGggSUQpJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgaWQ6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyksXG4gICAgam9iczogZmFsc2UsXG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChcbiAgICBzY2hlbWEsXG4gICAgQWNjb3VudEJyb2FkY2FzdGVyUXVlcnksXG4gICAgbnVsbCxcbiAgICB7IGxpdmVwZWVyIH0sXG4gICAgYXJncyxcbiAgKVxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsIDIpKVxuICB0LnNuYXBzaG90KHJlcylcbn0pXG5cbnRlc3QoJ0FjY291bnRCcm9hZGNhc3RlclF1ZXJ5IChpbmNsdWRlIGpvYnMpJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgaWQ6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyksXG4gICAgam9iczogdHJ1ZSxcbiAgfVxuICBjb25zdCByZXMgPSBhd2FpdCBncmFwaHFsKFxuICAgIHNjaGVtYSxcbiAgICBBY2NvdW50QnJvYWRjYXN0ZXJRdWVyeSxcbiAgICBudWxsLFxuICAgIHsgbGl2ZXBlZXIgfSxcbiAgICBhcmdzLFxuICApXG4gIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgMikpXG4gIHQuc25hcHNob3QocmVzKVxufSlcblxudGVzdCgnQWNjb3VudEJyb2FkY2FzdGVyUXVlcnkgKGluY2x1ZGUgam9icyB1c2luZyBza2lwL2xpbWl0IGFyZ3MpJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgaWQ6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyksXG4gICAgam9iczogdHJ1ZSxcbiAgICBqb2JzU2tpcDogMSxcbiAgICBqb2JzTGltaXQ6IDEsXG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChcbiAgICBzY2hlbWEsXG4gICAgQWNjb3VudEJyb2FkY2FzdGVyUXVlcnksXG4gICAgbnVsbCxcbiAgICB7IGxpdmVwZWVyIH0sXG4gICAgYXJncyxcbiAgKVxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsIDIpKVxuICB0LnNuYXBzaG90KHJlcylcbn0pXG5cbi8qKlxuICogQmxvY2tcbiAqL1xudGVzdCgnQ3VycmVudEJsb2NrUXVlcnknLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgYXJncyA9IHt9XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBDdXJyZW50QmxvY2tRdWVyeSwgbnVsbCwgeyBsaXZlcGVlciB9LCBhcmdzKVxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsIDIpKVxuICB0LnNuYXBzaG90KHJlcylcbn0pXG5cbi8qKlxuICogQnJvYWRjYXN0ZXJcbiAqL1xudGVzdCgnQnJvYWRjYXN0ZXJRdWVyeScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIGlkOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpLFxuICAgIGpvYnM6IGZhbHNlLFxuICB9XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBCcm9hZGNhc3RlclF1ZXJ5LCBudWxsLCB7IGxpdmVwZWVyIH0sIGFyZ3MpXG4gIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgMikpXG4gIHQuc25hcHNob3QocmVzKVxufSlcblxudGVzdCgnQnJvYWRjYXN0ZXJRdWVyeSAoaW5jbHVkZSBqb2JzKScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIGlkOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpLFxuICAgIGpvYnM6IHRydWUsXG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChzY2hlbWEsIEJyb2FkY2FzdGVyUXVlcnksIG51bGwsIHsgbGl2ZXBlZXIgfSwgYXJncylcbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSlcbiAgdC5zbmFwc2hvdChyZXMpXG59KVxuXG50ZXN0KCdCcm9hZGNhc3RlclF1ZXJ5IChpbmNsdWRlIGpvYnMgdXNpbmcgc2tpcC9saW1pdCBhcmdzKScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIGlkOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpLFxuICAgIGpvYnM6IHRydWUsXG4gICAgam9ic1NraXA6IDEsXG4gICAgam9ic0xpbWl0OiAxLFxuICB9XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBCcm9hZGNhc3RlclF1ZXJ5LCBudWxsLCB7IGxpdmVwZWVyIH0sIGFyZ3MpXG4gIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgMikpXG4gIHQuc25hcHNob3QocmVzKVxufSlcblxuLyoqXG4gKiBDb2luYmFzZVxuICovXG50ZXN0KCdDb2luYmFzZVF1ZXJ5IChub3QgYXV0aGVudGljYXRlZCknLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgYXJncyA9IG51bGxcbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChzY2hlbWEsIENvaW5iYXNlUXVlcnksIG51bGwsIHsgbGl2ZXBlZXIgfSwgYXJncylcbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSlcbiAgdC5zbmFwc2hvdChyZXMpXG59KVxuXG50ZXN0KCdDb2luYmFzZVF1ZXJ5IChhdXRoZW50aWNhdGVkKScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0gbnVsbFxuICBjb25zdCByZXMgPSBhd2FpdCBncmFwaHFsKFxuICAgIHNjaGVtYSxcbiAgICBDb2luYmFzZVF1ZXJ5LFxuICAgIG51bGwsXG4gICAgeyBhY2NvdW50OiAnMHgwZGRiMjI1MDMxY2NiNThmZjQyODY2ZjgyZDkwN2Y3NzY2ODk5MDE0JywgbGl2ZXBlZXIgfSxcbiAgICBhcmdzLFxuICApXG4gIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgMikpXG4gIHQuc25hcHNob3QocmVzKVxufSlcblxuLyoqXG4gKiBEZWxlZ2F0b3JcbiAqL1xudGVzdCgnRGVsZWdhdG9yUXVlcnknLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgYXJncyA9IHtcbiAgICBpZDogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMjInKSxcbiAgfVxuICBjb25zdCByZXMgPSBhd2FpdCBncmFwaHFsKHNjaGVtYSwgRGVsZWdhdG9yUXVlcnksIG51bGwsIHsgbGl2ZXBlZXIgfSwgYXJncylcbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSlcbiAgdC5zbmFwc2hvdChyZXMpXG59KVxuXG4vKipcbiAqIEpvYlxuICovXG50ZXN0KCdKb2JRdWVyeScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIGlkOiAnMCcsXG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChzY2hlbWEsIEpvYlF1ZXJ5LCBudWxsLCB7IGxpdmVwZWVyIH0sIGFyZ3MpXG4gIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgMikpXG4gIHQuc25hcHNob3QocmVzKVxufSlcblxuLyoqXG4gKiBKb2JzXG4gKi9cbnRlc3QoJ0pvYnNRdWVyeScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge31cbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChzY2hlbWEsIEpvYnNRdWVyeSwgbnVsbCwgeyBsaXZlcGVlciB9LCBhcmdzKVxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsIDIpKVxuICB0LnNuYXBzaG90KHJlcylcbn0pXG5cbnRlc3QoJ0pvYnNRdWVyeSAoYnJvYWRjYXN0ZXIgYXJnKScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIGJyb2FkY2FzdGVyOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcxMScpLFxuICB9XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBKb2JzUXVlcnksIG51bGwsIHsgbGl2ZXBlZXIgfSwgYXJncylcbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSlcbiAgdC5zbmFwc2hvdChyZXMpXG59KVxuXG50ZXN0KCdKb2JzUXVlcnkgKHNraXAgYXJnKScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIHNraXA6IDEsXG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChzY2hlbWEsIEpvYnNRdWVyeSwgbnVsbCwgeyBsaXZlcGVlciB9LCBhcmdzKVxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsIDIpKVxuICB0LnNuYXBzaG90KHJlcylcbn0pXG5cbnRlc3QoJ0pvYnNRdWVyeSAobGltaXQgYXJnKScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIGxpbWl0OiAxLFxuICB9XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBKb2JzUXVlcnksIG51bGwsIHsgbGl2ZXBlZXIgfSwgYXJncylcbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSlcbiAgdC5zbmFwc2hvdChyZXMpXG59KVxuXG50ZXN0KCdKb2JzUXVlcnkgKHNraXAgLyBsaW1pdCBhcmdzKScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIHNraXA6IDEsXG4gICAgbGltaXQ6IDMsXG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChzY2hlbWEsIEpvYnNRdWVyeSwgbnVsbCwgeyBsaXZlcGVlciB9LCBhcmdzKVxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsIDIpKVxuICB0LnNuYXBzaG90KHJlcylcbn0pXG5cbi8qKlxuICogUm91bmRcbiAqL1xudGVzdCgnQ3VycmVudFJvdW5kUXVlcnknLCBhc3luYyB0ID0+IHtcbiAgY29uc3QgYXJncyA9IHt9XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBDdXJyZW50Um91bmRRdWVyeSwgbnVsbCwgeyBsaXZlcGVlciB9LCBhcmdzKVxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsIDIpKVxuICB0LnNuYXBzaG90KHJlcylcbn0pXG5cbi8qKlxuICogVHJhbnNhY3Rpb25zXG4gKi9cbnRlc3QoJ1RyYW5zYWN0aW9uc1F1ZXJ5JywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgYWRkcmVzczogJzB4MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsXG4gICAgbGltaXQ6ICcyJyxcbiAgICBzb3J0OiAnZGVzYycsXG4gICAgLy8gdGhpcyBhZGRyZXNzIGhhcyAzIHR4bnMgaW4gdGhpcyByYW5nZVxuICAgIC8vICgxIG9uIDQ2NDIzLCAxIG9uIDQ2NDIxLCBhbmQgMSBvbiA0NjQyMClcbiAgICAvLyB0aGlzIHF1ZXJ5IHNob3VsZCByZXR1cm4gdGhlIHR4bnMgZnJvbSB0aGUgdHdvIG1vcmUgcmVjZW50IGJsb2Nrc1xuICAgIHN0YXJ0QmxvY2s6ICc0NjQyMCcsXG4gICAgZW5kQmxvY2s6ICc0NjQyMycsXG4gIH1cbiAgY29uc3QgcmVzID0gYXdhaXQgZ3JhcGhxbChcbiAgICBzY2hlbWEsXG4gICAgVHJhbnNhY3Rpb25zUXVlcnksXG4gICAgbnVsbCxcbiAgICB7XG4gICAgICBwZXJzaXN0b3I6IHtcbiAgICAgICAgY2FjaGU6IHtcbiAgICAgICAgICBjYWNoZToge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgUk9PVF9RVUVSWToge30sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbGl2ZXBlZXIsXG4gICAgICBldGhlcnNjYW5BcGlLZXk6ICdSRVlHQTE1TjJTQ1VLVkZRS0czQzI0VVNLU1I4V1pCMjlCJyxcbiAgICB9LFxuICAgIGFyZ3MsXG4gIClcbiAgLy8gcmVtb3ZlIFwiY29uZmlybWF0aW9uc1wiIGZpZWxkIHNpbmNlIGl0IGNoYW5nZXMgZnJlcXVlbnRseVxuICBjb25zdCB0cmFuc2FjdGlvbnMgPSByZXMuZGF0YS50cmFuc2FjdGlvbnMubWFwKFxuICAgICh7IGNvbmZpcm1hdGlvbnMsIC4uLnR4IH0pID0+IHR4LFxuICApXG4gIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlcywgbnVsbCwgMikpXG4gIHQuc25hcHNob3Qoe1xuICAgIC4uLnJlcyxcbiAgICBkYXRhOiB7XG4gICAgICAuLi5yZXMuZGF0YSxcbiAgICAgIHRyYW5zYWN0aW9ucyxcbiAgICB9LFxuICB9KVxufSlcblxuLyoqXG4gKiBUcmFuc2NvZGVyXG4gKi9cbnRlc3QoJ1RyYW5zY29kZXJRdWVyeScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBhcmdzID0ge1xuICAgIGlkOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpLFxuICB9XG4gIGNvbnN0IHJlcyA9IGF3YWl0IGdyYXBocWwoc2NoZW1hLCBUcmFuc2NvZGVyUXVlcnksIG51bGwsIHsgbGl2ZXBlZXIgfSwgYXJncylcbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSlcbiAgdC5zbmFwc2hvdChyZXMpXG59KVxuXG50ZXN0KCdUcmFuc2NvZGVyc1F1ZXJ5JywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IGFyZ3MgPSB7fVxuICBjb25zdCByZXMgPSBhd2FpdCBncmFwaHFsKHNjaGVtYSwgVHJhbnNjb2RlcnNRdWVyeSwgbnVsbCwgeyBsaXZlcGVlciB9LCBhcmdzKVxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXMsIG51bGwsIDIpKVxuICB0LnNuYXBzaG90KHJlcylcbn0pXG5cbi8qKlxuICogUHJvdG9jb2xcbiAqL1xudGVzdCgnUHJvdG9jb2xRdWVyeScsIGFzeW5jIHQgPT4ge1xuICBjb25zdCByZXMgPSBhd2FpdCBncmFwaHFsKHNjaGVtYSwgUHJvdG9jb2xRdWVyeSwgbnVsbCwgeyBsaXZlcGVlciB9LCB7fSlcbiAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzLCBudWxsLCAyKSlcbiAgdC5zbmFwc2hvdChyZXMpXG59KVxuIl19
