'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.account = account
exports.broadcaster = broadcaster
exports.coinbase = coinbase
exports.currentBlock = currentBlock
exports.currentRound = currentRound
exports.delegator = delegator
exports.unbondlocks = unbondlocks
exports.unbondlock = unbondlock
exports.job = job
exports.jobs = jobs
exports.me = me
exports.transactions = transactions
exports.transcoder = transcoder
exports.transcoders = transcoders
exports.protocol = protocol

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime/helpers/toConsumableArray'),
)

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

var _utils = require('../utils')

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

/** Resolvers */

/**
 * Gets an Account by ID (ETH address)
 * @param {QueryObj} obj
 * @param {QueryAccountArgs} args
 * @param {string} args.id - ETH address
 * @param {string} args.ensName - ENS name
 * @param {GQLContext} ctx
 * @return {Account}
 */
function account(_x, _x2, _x3) {
  return _account.apply(this, arguments)
}
/**
 * Gets a Broadcaster by ID (ETH address)
 * @param {QueryObj} obj
 * @param {QueryBroadcasterArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Broadcaster}
 */

function _account() {
  _account = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee(obj, args, ctx) {
      var _ctx$livepeer, rpc, utils, addrOrName, id, ensName

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              ;(_ctx$livepeer = ctx.livepeer),
                (rpc = _ctx$livepeer.rpc),
                (utils = _ctx$livepeer.utils)
              addrOrName = args.id.toLowerCase()
              _context.next = 4
              return utils.resolveAddress(rpc.getENSAddress, addrOrName)

            case 4:
              id = _context.sent

              if (!(addrOrName === id)) {
                _context.next = 11
                break
              }

              _context.next = 8
              return rpc.getENSName(id)

            case 8:
              _context.t0 = _context.sent
              _context.next = 12
              break

            case 11:
              _context.t0 = addrOrName

            case 12:
              ensName = _context.t0
              return _context.abrupt('return', {
                id: id,
                ensName: ensName,
              })

            case 14:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    }),
  )
  return _account.apply(this, arguments)
}

function broadcaster(_x4, _x5, _x6) {
  return _broadcaster.apply(this, arguments)
}
/**
 * Gets the currently authenticated user's ETH account address. ctx.account
 * @param {QueryObj} obj
 * @param {QueryAccountArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Account}
 */

function _broadcaster() {
  _broadcaster = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee2(obj, args, ctx) {
      var id, _yield$ctx$livepeer$r, address, data, broadcaster

      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              id = args.id
              _context2.next = 3
              return ctx.livepeer.rpc.getBroadcaster(id)

            case 3:
              _yield$ctx$livepeer$r = _context2.sent
              address = _yield$ctx$livepeer$r.address
              data = (0,
              _objectWithoutProperties2.default)(_yield$ctx$livepeer$r, [
                'address',
              ])
              broadcaster = _objectSpread(
                _objectSpread({}, data),
                {},
                {
                  id: id,
                },
              )
              return _context2.abrupt('return', broadcaster)

            case 8:
            case 'end':
              return _context2.stop()
          }
        }
      }, _callee2)
    }),
  )
  return _broadcaster.apply(this, arguments)
}

function coinbase(_x7, _x8, _x9) {
  return _coinbase.apply(this, arguments)
}
/**
 * Gets the current Ethereum block
 * @param {QueryObj} obj
 * @param {QueryCurrentBlockArgs} args
 * @param {GQLContext} ctx
 * @return {Block}
 */

function _coinbase() {
  _coinbase = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee3(obj, args, ctx) {
      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch ((_context3.prev = _context3.next)) {
            case 0:
              return _context3.abrupt('return', ctx.account || '')

            case 1:
            case 'end':
              return _context3.stop()
          }
        }
      }, _callee3)
    }),
  )
  return _coinbase.apply(this, arguments)
}

function currentBlock(_x10, _x11, _x12) {
  return _currentBlock.apply(this, arguments)
}
/**
 * Gets a the current round
 * @param {QueryObj} obj
 * @param {QueryCurrentRoundArgs} args
 * @param {GQLContext} ctx
 * @return {Round}
 */

function _currentBlock() {
  _currentBlock = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee4(obj, args, ctx) {
      var result
      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch ((_context4.prev = _context4.next)) {
            case 0:
              _context4.next = 2
              return ctx.livepeer.rpc.getBlock('latest')

            case 2:
              result = _context4.sent
              return _context4.abrupt(
                'return',
                _objectSpread(
                  _objectSpread({}, result),
                  {},
                  {
                    id: result.number,
                  },
                ),
              )

            case 4:
            case 'end':
              return _context4.stop()
          }
        }
      }, _callee4)
    }),
  )
  return _currentBlock.apply(this, arguments)
}

function currentRound(_x13, _x14, _x15) {
  return _currentRound.apply(this, arguments)
}
/**
 * Gets a Delegator by ID (ETH address)
 * @param {QueryObj} obj
 * @param {QueryBroadcasterArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Broadcaster}
 */

function _currentRound() {
  _currentRound = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee5(obj, args, ctx) {
      var result
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch ((_context5.prev = _context5.next)) {
            case 0:
              _context5.next = 2
              return ctx.livepeer.rpc.getCurrentRoundInfo()

            case 2:
              result = _context5.sent
              return _context5.abrupt('return', result)

            case 4:
            case 'end':
              return _context5.stop()
          }
        }
      }, _callee5)
    }),
  )
  return _currentRound.apply(this, arguments)
}

function delegator(_x16, _x17, _x18) {
  return _delegator.apply(this, arguments)
}
/**
 * Gets unbonding locks by ETH address
 * @param {QueryObj} obj
 * @param {QueryUnbondingLockArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Array<UnbondingLock>}
 */

function _delegator() {
  _delegator = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee6(obj, args, ctx) {
      var id, _yield$ctx$livepeer$r2, address, data, delegator

      return _regenerator.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch ((_context6.prev = _context6.next)) {
            case 0:
              id = args.id
              _context6.next = 3
              return ctx.livepeer.rpc.getDelegator(id)

            case 3:
              _yield$ctx$livepeer$r2 = _context6.sent
              address = _yield$ctx$livepeer$r2.address
              data = (0,
              _objectWithoutProperties2.default)(_yield$ctx$livepeer$r2, [
                'address',
              ])
              delegator = _objectSpread(
                _objectSpread({}, data),
                {},
                {
                  id: id,
                },
              )
              return _context6.abrupt('return', delegator)

            case 8:
            case 'end':
              return _context6.stop()
          }
        }
      }, _callee6)
    }),
  )
  return _delegator.apply(this, arguments)
}

function unbondlocks(_x19, _x20, _x21) {
  return _unbondlocks.apply(this, arguments)
}
/**
 * Gets unbonding locks by ETH address
 * @param {QueryObj} obj
 * @param {QueryUnbondingLockArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Array<UnbondingLock>}
 */

function _unbondlocks() {
  _unbondlocks = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee7(obj, args, ctx) {
      var id, result
      return _regenerator.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch ((_context7.prev = _context7.next)) {
            case 0:
              id = args.id
              _context7.next = 3
              return ctx.livepeer.rpc.getDelegatorUnbondingLocks(id)

            case 3:
              result = _context7.sent
              return _context7.abrupt('return', result)

            case 5:
            case 'end':
              return _context7.stop()
          }
        }
      }, _callee7)
    }),
  )
  return _unbondlocks.apply(this, arguments)
}

function unbondlock(_x22, _x23, _x24) {
  return _unbondlock.apply(this, arguments)
}
/**
 * Gets a Job by ID
 * @param {QueryObj} obj
 * @param {QueryJobArgs} args
 * @param {string} args.id - Job ID
 * @param {GQLContext} ctx
 * @return {Job}
 */

function _unbondlock() {
  _unbondlock = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee8(obj, args, ctx) {
      var id, lockId, result
      return _regenerator.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch ((_context8.prev = _context8.next)) {
            case 0:
              ;(id = args.id), (lockId = args.lockId)
              _context8.next = 3
              return ctx.livepeer.rpc.getDelegatorUnbondingLock(id, lockId)

            case 3:
              result = _context8.sent
              return _context8.abrupt('return', result)

            case 5:
            case 'end':
              return _context8.stop()
          }
        }
      }, _callee8)
    }),
  )
  return _unbondlock.apply(this, arguments)
}

function job(_x25, _x26, _x27) {
  return _job.apply(this, arguments)
}
/**
 * Gets many Jobs
 * @param {QueryObj} obj
 * @param {QueryJobsArgs} args
 * @param {string} [args.broadcaster] - ETH address
 * @param {number} [args.skip=0] - The number of Jobs to skip
 * @param {number} [args.limit=100] - The max number onf Jobs to return
 * @param {GQLContext} ctx
 * @return {Array<Job>}
 */

function _job() {
  _job = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee9(obj, args, ctx) {
      var id, result, job
      return _regenerator.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch ((_context9.prev = _context9.next)) {
            case 0:
              id = args.id
              _context9.next = 3
              return ctx.livepeer.rpc.getJob(id)

            case 3:
              result = _context9.sent
              job = (0, _utils.transformJob)(result)
              return _context9.abrupt('return', job)

            case 6:
            case 'end':
              return _context9.stop()
          }
        }
      }, _callee9)
    }),
  )
  return _job.apply(this, arguments)
}

function jobs(_x28, _x29, _x30) {
  return _jobs.apply(this, arguments)
}
/**
 * Gets an Account by ID (ETH address). Uses ctx.accounts
 * @param {QueryObj} obj
 * @param {QueryAccountArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Account}
 */

function _jobs() {
  _jobs = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee10(obj, args, ctx) {
      var _args$skip,
        skip,
        _args$limit,
        limit,
        _args$broadcaster,
        broadcaster,
        _args,
        result,
        jobs

      return _regenerator.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch ((_context10.prev = _context10.next)) {
            case 0:
              ;(_args$skip = args.skip),
                (skip = _args$skip === void 0 ? 0 : _args$skip),
                (_args$limit = args.limit),
                (limit = _args$limit === void 0 ? 100 : _args$limit),
                (_args$broadcaster = args.broadcaster),
                (broadcaster =
                  _args$broadcaster === void 0
                    ? ctx.account
                    : _args$broadcaster),
                (_args = (0, _objectWithoutProperties2.default)(args, [
                  'skip',
                  'limit',
                  'broadcaster',
                ]))
              _context10.next = 3
              return ctx.livepeer.rpc.getJobs(
                _objectSpread(
                  {
                    broadcaster: broadcaster,
                  },
                  _args,
                ),
              )

            case 3:
              result = _context10.sent
              jobs = result.slice(skip, skip + limit).map(_utils.transformJob)
              return _context10.abrupt('return', jobs)

            case 6:
            case 'end':
              return _context10.stop()
          }
        }
      }, _callee10)
    }),
  )
  return _jobs.apply(this, arguments)
}

function me(_x31, _x32, _x33) {
  return _me.apply(this, arguments)
}
/**
 * Gets all transactions to and from an account between the given start block and end block
 * @param {QueryObj} obj
 * @param {QueryTransactionsArgs} args
 * @param {string} [args.address] - ETH address that sent the transaction
 * @param {number} [args.startBlock=0] - The start block to search from
 * @param {number} [args.endBlock=99999999] - The end block to search to
 * @param {string} [args.skip] - Page number
 * @param {string} [args.limit] - Max records to return
 * @param {string} [args.sort='asc'] - 'asc' or 'desc'
 * @param {GQLContext} ctx
 * @return {Array<Transaction>}
 */

function _me() {
  _me = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee11(obj, args, ctx) {
      var id
      return _regenerator.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch ((_context11.prev = _context11.next)) {
            case 0:
              // Account field resolvers will fill in the rest
              id = ctx.account

              if (id) {
                _context11.next = 3
                break
              }

              throw new Error('No unlocked account is available')

            case 3:
              return _context11.abrupt('return', {
                id: id,
              })

            case 4:
            case 'end':
              return _context11.stop()
          }
        }
      }, _callee11)
    }),
  )
  return _me.apply(this, arguments)
}

function transactions(_x34, _x35, _x36) {
  return _transactions.apply(this, arguments)
}
/**
 * Gets a Transcoder by ID (ETH address)
 * @param {QueryObj} obj
 * @param {QueryTranscoderArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Transcoder}
 */

function _transactions() {
  _transactions = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee12(obj, args, ctx) {
      var account,
        etherscanApiKey,
        livepeer,
        persistor,
        cache,
        config,
        rpc,
        utils,
        contracts,
        eth,
        _args$startBlock,
        startBlock,
        _args$endBlock,
        endBlock,
        _args$skip2,
        skip,
        _args$limit2,
        limit,
        _args$sort,
        sort,
        address,
        networkId,
        rootUrl,
        queryString,
        result,
        json,
        cacheData,
        pendingTxRefs,
        pendingTxns,
        transactions,
        values

      return _regenerator.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch ((_context12.prev = _context12.next)) {
            case 0:
              // console.log(ctx)
              ;(account = ctx.account),
                (etherscanApiKey = ctx.etherscanApiKey),
                (livepeer = ctx.livepeer),
                (persistor = ctx.persistor)
              cache = persistor.cache.cache
              ;(config = livepeer.config),
                (rpc = livepeer.rpc),
                (utils = livepeer.utils)
              ;(contracts = config.contracts), (eth = config.eth)
              ;(_args$startBlock = args.startBlock),
                (startBlock =
                  _args$startBlock === void 0 ? 0 : _args$startBlock),
                (_args$endBlock = args.endBlock),
                (endBlock =
                  _args$endBlock === void 0 ? 99999999 : _args$endBlock),
                (_args$skip2 = args.skip),
                (skip = _args$skip2 === void 0 ? 0 : _args$skip2),
                (_args$limit2 = args.limit),
                (limit = _args$limit2 === void 0 ? 100 : _args$limit2),
                (_args$sort = args.sort),
                (sort = _args$sort === void 0 ? 'desc' : _args$sort)
              _context12.next = 7
              return utils.resolveAddress(rpc.getENSAddress, args.address)

            case 7:
              address = _context12.sent
              _context12.next = 10
              return eth.net_version()

            case 10:
              networkId = _context12.sent
              rootUrl = 'https://'.concat(
                networkId === '4' ? 'api-rinkeby' : 'api',
                '.etherscan.io/api',
              )
              queryString = '?module=account&action=txlist&address='
                .concat(address, '&startBlock=')
                .concat(startBlock, '&endBlock=')
                .concat(endBlock, '&page=')
                .concat(1 + skip, '&offset=')
                .concat(limit, '&sort=')
                .concat(sort, '&apiKey=')
                .concat(etherscanApiKey)
              _context12.next = 15
              return fetch(rootUrl + queryString)

            case 15:
              result = _context12.sent
              _context12.next = 18
              return result.json()

            case 18:
              json = _context12.sent
              cacheData = cache.data.data // console.log(cache)

              pendingTxRefs =
                cacheData.ROOT_QUERY[
                  'pendingTransactions({"address":"'.concat(address, '"})')
                ] || []
              pendingTxns = new Map(
                pendingTxRefs.map(function (x) {
                  return [cacheData[x.id].id, cacheData[x.id]]
                }),
              )
              transactions = json.result.map(function (_ref) {
                var id = _ref.hash,
                  status = _ref.txreceipt_status,
                  x = (0, _objectWithoutProperties2.default)(_ref, [
                    'hash',
                    'txreceipt_status',
                  ])

                var _utils$decodeContract = utils.decodeContractInput(
                    contracts,
                    x.to,
                    x.input,
                  ),
                  contract = _utils$decodeContract.contract,
                  method = _utils$decodeContract.method,
                  params = _utils$decodeContract.params

                if (pendingTxns.has(id)) {
                  pendingTxns.delete(id)
                }

                return _objectSpread(
                  _objectSpread({}, x),
                  {},
                  {
                    id: id,
                    status: status,
                    contract: contract,
                    method: method,
                    params: params,
                  },
                )
              })
              values = (0, _toConsumableArray2.default)(pendingTxns.values())
              return _context12.abrupt(
                'return',
                [].concat(
                  (0, _toConsumableArray2.default)(
                    values.map(function (_ref2) {
                      var __typename = _ref2.__typename,
                        params = _ref2.params,
                        x = (0, _objectWithoutProperties2.default)(_ref2, [
                          '__typename',
                          'params',
                        ])
                      return _objectSpread(
                        _objectSpread({}, x),
                        {},
                        {
                          params: params.json,
                        },
                      )
                    }),
                  ),
                  (0, _toConsumableArray2.default)(transactions),
                ),
              )

            case 25:
            case 'end':
              return _context12.stop()
          }
        }
      }, _callee12)
    }),
  )
  return _transactions.apply(this, arguments)
}

function transcoder(_x37, _x38, _x39) {
  return _transcoder.apply(this, arguments)
}
/**
 * Gets many Transcoders
 * @param {QueryObj} obj
 * @param {QueryTranscodersArgs} args
 * @param {string} [args.broadcaster] - ETH address
 * @param {number} [args.skip=0] - The number of Transcoders to skip
 * @param {number} [args.first=100] - The max number onf Transcoders to return
 * @param {GQLContext} ctx
 * @return {Array<Transcoder>}
 */

function _transcoder() {
  _transcoder = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee13(obj, args, ctx) {
      var id, _yield$ctx$livepeer$r3, address, data, transcoder

      return _regenerator.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch ((_context13.prev = _context13.next)) {
            case 0:
              id = args.id
              _context13.next = 3
              return ctx.livepeer.rpc.getTranscoder(id)

            case 3:
              _yield$ctx$livepeer$r3 = _context13.sent
              address = _yield$ctx$livepeer$r3.address
              data = (0,
              _objectWithoutProperties2.default)(_yield$ctx$livepeer$r3, [
                'address',
              ])
              transcoder = _objectSpread(
                _objectSpread(_objectSpread({}, transcoder), data),
                {},
                {
                  id: id,
                },
              )
              return _context13.abrupt('return', transcoder)

            case 8:
            case 'end':
              return _context13.stop()
          }
        }
      }, _callee13)
    }),
  )
  return _transcoder.apply(this, arguments)
}

function transcoders(_x40, _x41, _x42) {
  return _transcoders.apply(this, arguments)
}
/**
 * Gets a the protocol
 * @param {QueryObj} obj
 * @param {GQLContext} ctx
 * @return {Protocol}
 */

function _transcoders() {
  _transcoders = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee14(obj, args, ctx) {
      var _args$skip3, skip, _args$first, first, result, transcoders

      return _regenerator.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch ((_context14.prev = _context14.next)) {
            case 0:
              ;(_args$skip3 = args.skip),
                (skip = _args$skip3 === void 0 ? 0 : _args$skip3),
                (_args$first = args.first),
                (first = _args$first === void 0 ? 100 : _args$first)
              _context14.next = 3
              return ctx.livepeer.rpc.getTranscoders()

            case 3:
              result = _context14.sent
              transcoders = result
                .slice(skip, skip + first)
                .map(function (_ref3) {
                  var id = _ref3.address,
                    x = (0, _objectWithoutProperties2.default)(_ref3, [
                      'address',
                    ])
                  return _objectSpread(
                    _objectSpread({}, x),
                    {},
                    {
                      id: id,
                    },
                  )
                })
              return _context14.abrupt('return', transcoders)

            case 6:
            case 'end':
              return _context14.stop()
          }
        }
      }, _callee14)
    }),
  )
  return _transcoders.apply(this, arguments)
}

function protocol(_x43, _x44, _x45) {
  return _protocol.apply(this, arguments)
}

function _protocol() {
  _protocol = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee15(obj, args, ctx) {
      var protocol
      return _regenerator.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch ((_context15.prev = _context15.next)) {
            case 0:
              _context15.next = 2
              return ctx.livepeer.rpc.getProtocol()

            case 2:
              protocol = _context15.sent
              return _context15.abrupt('return', protocol)

            case 4:
            case 'end':
              return _context15.stop()
          }
        }
      }, _callee15)
    }),
  )
  return _protocol.apply(this, arguments)
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvUXVlcnkuanMiXSwibmFtZXMiOlsiYWNjb3VudCIsIm9iaiIsImFyZ3MiLCJjdHgiLCJsaXZlcGVlciIsInJwYyIsInV0aWxzIiwiYWRkck9yTmFtZSIsImlkIiwidG9Mb3dlckNhc2UiLCJyZXNvbHZlQWRkcmVzcyIsImdldEVOU0FkZHJlc3MiLCJnZXRFTlNOYW1lIiwiZW5zTmFtZSIsImJyb2FkY2FzdGVyIiwiZ2V0QnJvYWRjYXN0ZXIiLCJhZGRyZXNzIiwiZGF0YSIsImNvaW5iYXNlIiwiY3VycmVudEJsb2NrIiwiZ2V0QmxvY2siLCJyZXN1bHQiLCJudW1iZXIiLCJjdXJyZW50Um91bmQiLCJnZXRDdXJyZW50Um91bmRJbmZvIiwiZGVsZWdhdG9yIiwiZ2V0RGVsZWdhdG9yIiwidW5ib25kbG9ja3MiLCJnZXREZWxlZ2F0b3JVbmJvbmRpbmdMb2NrcyIsInVuYm9uZGxvY2siLCJsb2NrSWQiLCJnZXREZWxlZ2F0b3JVbmJvbmRpbmdMb2NrIiwiam9iIiwiZ2V0Sm9iIiwiam9icyIsInNraXAiLCJsaW1pdCIsIl9hcmdzIiwiZ2V0Sm9icyIsInNsaWNlIiwibWFwIiwidHJhbnNmb3JtSm9iIiwibWUiLCJFcnJvciIsInRyYW5zYWN0aW9ucyIsImV0aGVyc2NhbkFwaUtleSIsInBlcnNpc3RvciIsImNhY2hlIiwiY29uZmlnIiwiY29udHJhY3RzIiwiZXRoIiwic3RhcnRCbG9jayIsImVuZEJsb2NrIiwic29ydCIsIm5ldF92ZXJzaW9uIiwibmV0d29ya0lkIiwicm9vdFVybCIsInF1ZXJ5U3RyaW5nIiwiZmV0Y2giLCJqc29uIiwiY2FjaGVEYXRhIiwicGVuZGluZ1R4UmVmcyIsIlJPT1RfUVVFUlkiLCJwZW5kaW5nVHhucyIsIk1hcCIsIngiLCJoYXNoIiwic3RhdHVzIiwidHhyZWNlaXB0X3N0YXR1cyIsImRlY29kZUNvbnRyYWN0SW5wdXQiLCJ0byIsImlucHV0IiwiY29udHJhY3QiLCJtZXRob2QiLCJwYXJhbXMiLCJoYXMiLCJkZWxldGUiLCJ2YWx1ZXMiLCJfX3R5cGVuYW1lIiwidHJhbnNjb2RlciIsImdldFRyYW5zY29kZXIiLCJ0cmFuc2NvZGVycyIsImZpcnN0IiwiZ2V0VHJhbnNjb2RlcnMiLCJwcm90b2NvbCIsImdldFByb3RvY29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBNkNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtTQUNzQkEsTzs7O0FBUXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7cUZBZk8saUJBQXVCQyxHQUF2QixFQUE0QkMsSUFBNUIsRUFBa0NDLEdBQWxDO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw0QkFDa0JBLEdBQUcsQ0FBQ0MsUUFEdEIsRUFDR0MsR0FESCxpQkFDR0EsR0FESCxFQUNRQyxLQURSLGlCQUNRQSxLQURSO0FBRUNDLFlBQUFBLFVBRkQsR0FFY0wsSUFBSSxDQUFDTSxFQUFMLENBQVFDLFdBQVIsRUFGZDtBQUFBO0FBQUEsbUJBR1lILEtBQUssQ0FBQ0ksY0FBTixDQUFxQkwsR0FBRyxDQUFDTSxhQUF6QixFQUF3Q0osVUFBeEMsQ0FIWjs7QUFBQTtBQUdDQyxZQUFBQSxFQUhEOztBQUFBLGtCQUlXRCxVQUFVLEtBQUtDLEVBSjFCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsbUJBSXFDSCxHQUFHLENBQUNPLFVBQUosQ0FBZUosRUFBZixDQUpyQzs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLDBCQUkwREQsVUFKMUQ7O0FBQUE7QUFJQ00sWUFBQUEsT0FKRDtBQUFBLDZDQUtFO0FBQUVMLGNBQUFBLEVBQUUsRUFBRkEsRUFBRjtBQUFNSyxjQUFBQSxPQUFPLEVBQVBBO0FBQU4sYUFMRjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOzs7O1NBZ0JlQyxXOzs7QUFXdEI7QUFDQTtB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YSxDQVBmO0FBQUEsK0NBVUV5RSxXQVZGOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7Ozs7U0FtQmVHLFE7Ozs7O3NGQUFmLG1CQUNMbkYsR0FESyxFQUVMQyxJQUZLLEVBR0xDLEdBSEs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFLa0JBLEdBQUcsQ0FBQ0MsUUFBSixDQUFhQyxHQUFiLENBQWlCZ0YsV0FBakIsRUFMbEI7O0FBQUE7QUFLQ0QsWUFBQUEsUUFMRDtBQUFBLCtDQU1FQSxRQU5GOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0cmFuc2Zvcm1Kb2IgfSBmcm9tICcuLi91dGlscydcblxuLyoqIFR5cGVkZWZzICovXG5cbnR5cGUgR1FMQ29udGV4dCA9IHtcbiAgbGl2ZXBlZXI6IE9iamVjdCxcbiAgYWNjb3VudD86IHN0cmluZyxcbiAgZXRoZXJzY2FuQXBpS2V5OiBzdHJpbmcsXG59XG5cbnR5cGUgUXVlcnlPYmogPSB7fVxuXG50eXBlIFF1ZXJ5QWNjb3VudEFyZ3MgPSB7XG4gIGlkPzogc3RyaW5nLFxufVxuXG50eXBlIFF1ZXJ5QnJvYWRjYXN0ZXJBcmdzID0ge1xuICBpZD86IHN0cmluZyxcbn1cblxudHlwZSBRdWVyeUN1cnJlbnRCbG9ja0FyZ3MgPSB7fVxuXG50eXBlIFF1ZXJ5Q3VycmVudFJvdW5kQXJncyA9IHt9XG5cbnR5cGUgUXVlcnlVbmJvbmRpbmdMb2NrQXJncyA9IHt9XG5cbnR5cGUgUXVlcnlEZWxlZ2F0b3JBcmdzID0ge1xuICBpZD86IHN0cmluZyxcbn1cblxudHlwZSBRdWVyeUpvYkFyZ3MgPSB7XG4gIGlkPzogc3RyaW5nLFxufVxuXG50eXBlIFF1ZXJ5Sm9ic0FyZ3MgPSB7XG4gIGJyb2FkY2FzdGVyPzogc3RyaW5nLFxuICBza2lwPzogbnVtYmVyLFxuICBsaW1pdD86IG51bWJlcixcbn1cblxudHlwZSBRdWVyeVRyYW5zY29kZXJBcmdzID0ge1xuICBpZD86IHN0cmluZyxcbn1cblxudHlwZSBRdWVyeVByb3RvY29sQXJncyA9IHt9XG4vKiogUmVzb2x2ZXJzICovXG5cbi8qKlxuICogR2V0cyBhbiBBY2NvdW50IGJ5IElEIChFVEggYWRkcmVzcylcbiAqIEBwYXJhbSB7UXVlcnlPYmp9IG9ialxuICogQHBhcmFtIHtRdWVyeUFjY291bnRBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5pZCAtIEVUSCBhZGRyZXNzXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5lbnNOYW1lIC0gRU5TIG5hbWVcbiAqIEBwYXJhbSB7R1FMQ29udGV4dH0gY3R4XG4gKiBAcmV0dXJuIHtBY2NvdW50fVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWNjb3VudChvYmosIGFyZ3MsIGN0eCkge1xuICBjb25zdCB7IHJwYywgdXRpbHMgfSA9IGN0eC5saXZlcGVlclxuICBjb25zdCBhZGRyT3JOYW1lID0gYXJncy5pZC50b0xvd2VyQ2FzZSgpXG4gIGNvbnN0IGlkID0gYXdhaXQgdXRpbHMucmVzb2x2ZUFkZHJlc3MocnBjLmdldEVOU0FkZHJlc3MsIGFkZHJPck5hbWUpXG4gIGNvbnN0IGVuc05hbWUgPSBhZGRyT3JOYW1lID09PSBpZCA/IGF3YWl0IHJwYy5nZXRFTlNOYW1lKGlkKSA6IGFkZHJPck5hbWVcbiAgcmV0dXJuIHsgaWQsIGVuc05hbWUgfVxufVxuXG4vKipcbiAqIEdldHMgYSBCcm9hZGNhc3RlciBieSBJRCAoRVRIIGFkZHJlc3MpXG4gKiBAcGFyYW0ge1F1ZXJ5T2JqfSBvYmpcbiAqIEBwYXJhbSB7UXVlcnlCcm9hZGNhc3RlckFyZ3N9IGFyZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLmlkIC0gRVRIIGFkZHJlc3NcbiAqIEBwYXJhbSB7R1FMQ29udGV4dH0gY3R4XG4gKiBAcmV0dXJuIHtCcm9hZGNhc3Rlcn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJyb2FkY2FzdGVyKFxuICBvYmo6IFF1ZXJ5T2JqLFxuICBhcmdzOiBRdWVyeUJyb2FkY2FzdGVyQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogQnJvYWRjYXN0ZXIge1xuICBjb25zdCB7IGlkIH0gPSBhcmdzXG4gIGNvbnN0IHsgYWRkcmVzcywgLi4uZGF0YSB9ID0gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRCcm9hZGNhc3RlcihpZClcbiAgY29uc3QgYnJvYWRjYXN0ZXIgPSB7IC4uLmRhdGEsIGlkIH1cbiAgcmV0dXJuIGJyb2FkY2FzdGVyXG59XG5cbi8qKlxuICogR2V0cyB0aGUgY3VycmVudGx5IGF1dGhlbnRpY2F0ZWQgdXNlcidzIEVUSCBhY2NvdW50IGFkZHJlc3MuIGN0eC5hY2NvdW50XG4gKiBAcGFyYW0ge1F1ZXJ5T2JqfSBvYmpcbiAqIEBwYXJhbSB7UXVlcnlBY2NvdW50QXJnc30gYXJnc1xuICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MuaWQgLSBFVEggYWRkcmVzc1xuICogQHBhcmFtIHtHUUxDb250ZXh0fSBjdHhcbiAqIEByZXR1cm4ge0FjY291bnR9XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb2luYmFzZShvYmosIGFyZ3MsIGN0eCkge1xuICByZXR1cm4gY3R4LmFjY291bnQgfHwgJydcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBjdXJyZW50IEV0aGVyZXVtIGJsb2NrXG4gKiBAcGFyYW0ge1F1ZXJ5T2JqfSBvYmpcbiAqIEBwYXJhbSB7UXVlcnlDdXJyZW50QmxvY2tBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge0dRTENvbnRleHR9IGN0eFxuICogQHJldHVybiB7QmxvY2t9XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjdXJyZW50QmxvY2soXG4gIG9iajogUXVlcnlPYmosXG4gIGFyZ3M6IFF1ZXJ5Q3VycmVudEJsb2NrQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogQmxvY2sge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjdHgubGl2ZXBlZXIucnBjLmdldEJsb2NrKCdsYXRlc3QnKVxuICByZXR1cm4ge1xuICAgIC4uLnJlc3VsdCxcbiAgICBpZDogcmVzdWx0Lm51bWJlcixcbiAgfVxufVxuXG4vKipcbiAqIEdldHMgYSB0aGUgY3VycmVudCByb3VuZFxuICogQHBhcmFtIHtRdWVyeU9ian0gb2JqXG4gKiBAcGFyYW0ge1F1ZXJ5Q3VycmVudFJvdW5kQXJnc30gYXJnc1xuICogQHBhcmFtIHtHUUxDb250ZXh0fSBjdHhcbiAqIEByZXR1cm4ge1JvdW5kfVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3VycmVudFJvdW5kKFxuICBvYmo6IFF1ZXJ5T2JqLFxuICBhcmdzOiBRdWVyeUN1cnJlbnRSb3VuZEFyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFJvdW5kIHtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRDdXJyZW50Um91bmRJbmZvKClcbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vKipcbiAqIEdldHMgYSBEZWxlZ2F0b3IgYnkgSUQgKEVUSCBhZGRyZXNzKVxuICogQHBhcmFtIHtRdWVyeU9ian0gb2JqXG4gKiBAcGFyYW0ge1F1ZXJ5QnJvYWRjYXN0ZXJBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5pZCAtIEVUSCBhZGRyZXNzXG4gKiBAcGFyYW0ge0dRTENvbnRleHR9IGN0eFxuICogQHJldHVybiB7QnJvYWRjYXN0ZXJ9XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxlZ2F0b3IoXG4gIG9iajogUXVlcnlPYmosXG4gIGFyZ3M6IFF1ZXJ5RGVsZWdhdG9yQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogRGVsZWdhdG9yIHtcbiAgY29uc3QgeyBpZCB9ID0gYXJnc1xuICBjb25zdCB7IGFkZHJlc3MsIC4uLmRhdGEgfSA9IGF3YWl0IGN0eC5saXZlcGVlci5ycGMuZ2V0RGVsZWdhdG9yKGlkKVxuICBjb25zdCBkZWxlZ2F0b3IgPSB7IC4uLmRhdGEsIGlkIH1cbiAgcmV0dXJuIGRlbGVnYXRvclxufVxuXG4vKipcbiAqIEdldHMgdW5ib25kaW5nIGxvY2tzIGJ5IEVUSCBhZGRyZXNzXG4gKiBAcGFyYW0ge1F1ZXJ5T2JqfSBvYmpcbiAqIEBwYXJhbSB7UXVlcnlVbmJvbmRpbmdMb2NrQXJnc30gYXJnc1xuICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MuaWQgLSBFVEggYWRkcmVzc1xuICogQHBhcmFtIHtHUUxDb250ZXh0fSBjdHhcbiAqIEByZXR1cm4ge0FycmF5PFVuYm9uZGluZ0xvY2s+fVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdW5ib25kbG9ja3MoXG4gIG9iajogQWNjb3VudE9iaixcbiAgYXJnczogUXVlcnlVbmJvbmRpbmdMb2NrQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogQXJyYXk8VW5ib25kTG9jaz4ge1xuICBjb25zdCB7IGlkIH0gPSBhcmdzXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGN0eC5saXZlcGVlci5ycGMuZ2V0RGVsZWdhdG9yVW5ib25kaW5nTG9ja3MoaWQpXG4gIHJldHVybiByZXN1bHRcbn1cblxuLyoqXG4gKiBHZXRzIHVuYm9uZGluZyBsb2NrcyBieSBFVEggYWRkcmVzc1xuICogQHBhcmFtIHtRdWVyeU9ian0gb2JqXG4gKiBAcGFyYW0ge1F1ZXJ5VW5ib25kaW5nTG9ja0FyZ3N9IGFyZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzLmlkIC0gRVRIIGFkZHJlc3NcbiAqIEBwYXJhbSB7R1FMQ29udGV4dH0gY3R4XG4gKiBAcmV0dXJuIHtBcnJheTxVbmJvbmRpbmdMb2NrPn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVuYm9uZGxvY2soXG4gIG9iajogQWNjb3VudE9iaixcbiAgYXJnczogUXVlcnlVbmJvbmRpbmdMb2NrQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogQXJyYXk8VW5ib25kTG9jaz4ge1xuICBjb25zdCB7IGlkLCBsb2NrSWQgfSA9IGFyZ3NcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXREZWxlZ2F0b3JVbmJvbmRpbmdMb2NrKGlkLCBsb2NrSWQpXG4gIHJldHVybiByZXN1bHRcbn1cblxuLyoqXG4gKiBHZXRzIGEgSm9iIGJ5IElEXG4gKiBAcGFyYW0ge1F1ZXJ5T2JqfSBvYmpcbiAqIEBwYXJhbSB7UXVlcnlKb2JBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5pZCAtIEpvYiBJRFxuICogQHBhcmFtIHtHUUxDb250ZXh0fSBjdHhcbiAqIEByZXR1cm4ge0pvYn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGpvYihcbiAgb2JqOiBRdWVyeU9iaixcbiAgYXJnczogUXVlcnlKb2JBcmdzLFxuICBjdHg6IEdRTENvbnRleHQsXG4pOiBKb2Ige1xuICBjb25zdCB7IGlkIH0gPSBhcmdzXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGN0eC5saXZlcGVlci5ycGMuZ2V0Sm9iKGlkKVxuICBjb25zdCBqb2IgPSB0cmFuc2Zvcm1Kb2IocmVzdWx0KVxuICByZXR1cm4gam9iXG59XG5cbi8qKlxuICogR2V0cyBtYW55IEpvYnNcbiAqIEBwYXJhbSB7UXVlcnlPYmp9IG9ialxuICogQHBhcmFtIHtRdWVyeUpvYnNBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MuYnJvYWRjYXN0ZXJdIC0gRVRIIGFkZHJlc3NcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5za2lwPTBdIC0gVGhlIG51bWJlciBvZiBKb2JzIHRvIHNraXBcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5saW1pdD0xMDBdIC0gVGhlIG1heCBudW1iZXIgb25mIEpvYnMgdG8gcmV0dXJuXG4gKiBAcGFyYW0ge0dRTENvbnRleHR9IGN0eFxuICogQHJldHVybiB7QXJyYXk8Sm9iPn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGpvYnMoXG4gIG9iajogUXVlcnlPYmosXG4gIGFyZ3M6IFF1ZXJ5Sm9ic0FyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IEFycmF5PEpvYj4ge1xuICBjb25zdCB7IHNraXAgPSAwLCBsaW1pdCA9IDEwMCwgYnJvYWRjYXN0ZXIgPSBjdHguYWNjb3VudCwgLi4uX2FyZ3MgfSA9IGFyZ3NcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRKb2JzKHtcbiAgICBicm9hZGNhc3RlcixcbiAgICAuLi5fYXJncyxcbiAgfSlcbiAgY29uc3Qgam9icyA9IHJlc3VsdC5zbGljZShza2lwLCBza2lwICsgbGltaXQpLm1hcCh0cmFuc2Zvcm1Kb2IpXG4gIHJldHVybiBqb2JzXG59XG5cbi8qKlxuICogR2V0cyBhbiBBY2NvdW50IGJ5IElEIChFVEggYWRkcmVzcykuIFVzZXMgY3R4LmFjY291bnRzXG4gKiBAcGFyYW0ge1F1ZXJ5T2JqfSBvYmpcbiAqIEBwYXJhbSB7UXVlcnlBY2NvdW50QXJnc30gYXJnc1xuICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MuaWQgLSBFVEggYWRkcmVzc1xuICogQHBhcmFtIHtHUUxDb250ZXh0fSBjdHhcbiAqIEByZXR1cm4ge0FjY291bnR9XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtZShvYmosIGFyZ3MsIGN0eCkge1xuICAvLyBBY2NvdW50IGZpZWxkIHJlc29sdmVycyB3aWxsIGZpbGwgaW4gdGhlIHJlc3RcbiAgY29uc3QgaWQgPSBjdHguYWNjb3VudFxuICBpZiAoIWlkKSB0aHJvdyBuZXcgRXJyb3IoYE5vIHVubG9ja2VkIGFjY291bnQgaXMgYXZhaWxhYmxlYClcbiAgcmV0dXJuIHsgaWQgfVxufVxuXG4vKipcbiAqIEdldHMgYWxsIHRyYW5zYWN0aW9ucyB0byBhbmQgZnJvbSBhbiBhY2NvdW50IGJldHdlZW4gdGhlIGdpdmVuIHN0YXJ0IGJsb2NrIGFuZCBlbmQgYmxvY2tcbiAqIEBwYXJhbSB7UXVlcnlPYmp9IG9ialxuICogQHBhcmFtIHtRdWVyeVRyYW5zYWN0aW9uc0FyZ3N9IGFyZ3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5hZGRyZXNzXSAtIEVUSCBhZGRyZXNzIHRoYXQgc2VudCB0aGUgdHJhbnNhY3Rpb25cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5zdGFydEJsb2NrPTBdIC0gVGhlIHN0YXJ0IGJsb2NrIHRvIHNlYXJjaCBmcm9tXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MuZW5kQmxvY2s9OTk5OTk5OTldIC0gVGhlIGVuZCBibG9jayB0byBzZWFyY2ggdG9cbiAqIEBwYXJhbSB7c3RyaW5nfSBbYXJncy5za2lwXSAtIFBhZ2UgbnVtYmVyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MubGltaXRdIC0gTWF4IHJlY29yZHMgdG8gcmV0dXJuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3Muc29ydD0nYXNjJ10gLSAnYXNjJyBvciAnZGVzYydcbiAqIEBwYXJhbSB7R1FMQ29udGV4dH0gY3R4XG4gKiBAcmV0dXJuIHtBcnJheTxUcmFuc2FjdGlvbj59XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cmFuc2FjdGlvbnMoXG4gIG9iajogUXVlcnlPYmosXG4gIGFyZ3M6IFF1ZXJ5VHJhbnNjYWN0aW9uc0FyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IEFycmF5PFRyYW5zYWN0aW9ucz4ge1xuICAvLyBjb25zb2xlLmxvZyhjdHgpXG4gIGNvbnN0IHsgYWNjb3VudCwgZXRoZXJzY2FuQXBpS2V5LCBsaXZlcGVlciwgcGVyc2lzdG9yIH0gPSBjdHhcbiAgY29uc3QgeyBjYWNoZSB9ID0gcGVyc2lzdG9yLmNhY2hlXG4gIGNvbnN0IHsgY29uZmlnLCBycGMsIHV0aWxzIH0gPSBsaXZlcGVlclxuICBjb25zdCB7IGNvbnRyYWN0cywgZXRoIH0gPSBjb25maWdcbiAgY29uc3Qge1xuICAgIHN0YXJ0QmxvY2sgPSAwLFxuICAgIGVuZEJsb2NrID0gOTk5OTk5OTksXG4gICAgc2tpcCA9IDAsXG4gICAgbGltaXQgPSAxMDAsXG4gICAgc29ydCA9ICdkZXNjJyxcbiAgfSA9IGFyZ3NcbiAgY29uc3QgYWRkcmVzcyA9IGF3YWl0IHV0aWxzLnJlc29sdmVBZGRyZXNzKHJwYy5nZXRFTlNBZGRyZXNzLCBhcmdzLmFkZHJlc3MpXG4gIGNvbnN0IG5ldHdvcmtJZCA9IGF3YWl0IGV0aC5uZXRfdmVyc2lvbigpXG4gIGNvbnN0IHJvb3RVcmwgPSBgaHR0cHM6Ly8ke1xuICAgIG5ldHdvcmtJZCA9PT0gJzQnID8gJ2FwaS1yaW5rZWJ5JyA6ICdhcGknXG4gIH0uZXRoZXJzY2FuLmlvL2FwaWBcbiAgY29uc3QgcXVlcnlTdHJpbmcgPSBgP21vZHVsZT1hY2NvdW50JmFjdGlvbj10eGxpc3QmYWRkcmVzcz0ke2FkZHJlc3N9JnN0YXJ0QmxvY2s9JHtzdGFydEJsb2NrfSZlbmRCbG9jaz0ke2VuZEJsb2NrfSZwYWdlPSR7MSArXG4gICAgc2tpcH0mb2Zmc2V0PSR7bGltaXR9JnNvcnQ9JHtzb3J0fSZhcGlLZXk9JHtldGhlcnNjYW5BcGlLZXl9YFxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaChyb290VXJsICsgcXVlcnlTdHJpbmcpXG4gIGNvbnN0IGpzb24gPSBhd2FpdCByZXN1bHQuanNvbigpXG4gIGNvbnN0IGNhY2hlRGF0YSA9IGNhY2hlLmRhdGEuZGF0YVxuICAvLyBjb25zb2xlLmxvZyhjYWNoZSlcbiAgY29uc3QgcGVuZGluZ1R4UmVmcyA9XG4gICAgY2FjaGVEYXRhLlJPT1RfUVVFUllbYHBlbmRpbmdUcmFuc2FjdGlvbnMoe1wiYWRkcmVzc1wiOlwiJHthZGRyZXNzfVwifSlgXSB8fCBbXVxuICBjb25zdCBwZW5kaW5nVHhucyA9IG5ldyBNYXAoXG4gICAgcGVuZGluZ1R4UmVmcy5tYXAoeCA9PiBbY2FjaGVEYXRhW3guaWRdLmlkLCBjYWNoZURhdGFbeC5pZF1dKSxcbiAgKVxuICBjb25zdCB0cmFuc2FjdGlvbnMgPSBqc29uLnJlc3VsdC5tYXAoXG4gICAgKHsgaGFzaDogaWQsIHR4cmVjZWlwdF9zdGF0dXM6IHN0YXR1cywgLi4ueCB9KSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRyYWN0LCBtZXRob2QsIHBhcmFtcyB9ID0gdXRpbHMuZGVjb2RlQ29udHJhY3RJbnB1dChcbiAgICAgICAgY29udHJhY3RzLFxuICAgICAgICB4LnRvLFxuICAgICAgICB4LmlucHV0LFxuICAgICAgKVxuICAgICAgaWYgKHBlbmRpbmdUeG5zLmhhcyhpZCkpIHtcbiAgICAgICAgcGVuZGluZ1R4bnMuZGVsZXRlKGlkKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4ueCwgaWQsIHN0YXR1cywgY29udHJhY3QsIG1ldGhvZCwgcGFyYW1zIH1cbiAgICB9LFxuICApXG4gIGNvbnN0IHZhbHVlcyA9IFsuLi5wZW5kaW5nVHhucy52YWx1ZXMoKV1cbiAgcmV0dXJuIFtcbiAgICAuLi52YWx1ZXMubWFwKCh7IF9fdHlwZW5hbWUsIHBhcmFtcywgLi4ueCB9KSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi54LFxuICAgICAgICBwYXJhbXM6IHBhcmFtcy5qc29uLFxuICAgICAgfVxuICAgIH0pLFxuICAgIC4uLnRyYW5zYWN0aW9ucyxcbiAgXVxufVxuXG4vKipcbiAqIEdldHMgYSBUcmFuc2NvZGVyIGJ5IElEIChFVEggYWRkcmVzcylcbiAqIEBwYXJhbSB7UXVlcnlPYmp9IG9ialxuICogQHBhcmFtIHtRdWVyeVRyYW5zY29kZXJBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gYXJncy5pZCAtIEVUSCBhZGRyZXNzXG4gKiBAcGFyYW0ge0dRTENvbnRleHR9IGN0eFxuICogQHJldHVybiB7VHJhbnNjb2Rlcn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zY29kZXIoXG4gIG9iajogUXVlcnlPYmosXG4gIGFyZ3M6IFF1ZXJ5VHJhbnNjb2RlckFyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFRyYW5zY29kZXIge1xuICBjb25zdCB7IGlkIH0gPSBhcmdzXG4gIGNvbnN0IHsgYWRkcmVzcywgLi4uZGF0YSB9ID0gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRUcmFuc2NvZGVyKGlkKVxuICBjb25zdCB0cmFuc2NvZGVyID0ge1xuICAgIC4uLnRyYW5zY29kZXIsXG4gICAgLi4uZGF0YSxcbiAgICBpZCxcbiAgfVxuICByZXR1cm4gdHJhbnNjb2RlclxufVxuXG4vKipcbiAqIEdldHMgbWFueSBUcmFuc2NvZGVyc1xuICogQHBhcmFtIHtRdWVyeU9ian0gb2JqXG4gKiBAcGFyYW0ge1F1ZXJ5VHJhbnNjb2RlcnNBcmdzfSBhcmdzXG4gKiBAcGFyYW0ge3N0cmluZ30gW2FyZ3MuYnJvYWRjYXN0ZXJdIC0gRVRIIGFkZHJlc3NcbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJncy5za2lwPTBdIC0gVGhlIG51bWJlciBvZiBUcmFuc2NvZGVycyB0byBza2lwXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ3MuZmlyc3Q9MTAwXSAtIFRoZSBtYXggbnVtYmVyIG9uZiBUcmFuc2NvZGVycyB0byByZXR1cm5cbiAqIEBwYXJhbSB7R1FMQ29udGV4dH0gY3R4XG4gKiBAcmV0dXJuIHtBcnJheTxUcmFuc2NvZGVyPn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRyYW5zY29kZXJzKFxuICBvYmo6IFF1ZXJ5T2JqLFxuICBhcmdzOiBRdWVyeVRyYW5zY29kZXJzQXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogQXJyYXk8VHJhbnNjb2Rlcj4ge1xuICBjb25zdCB7IHNraXAgPSAwLCBmaXJzdCA9IDEwMCB9ID0gYXJnc1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBjdHgubGl2ZXBlZXIucnBjLmdldFRyYW5zY29kZXJzKClcbiAgY29uc3QgdHJhbnNjb2RlcnMgPSByZXN1bHRcbiAgICAuc2xpY2Uoc2tpcCwgc2tpcCArIGZpcnN0KVxuICAgIC5tYXAoKHsgYWRkcmVzczogaWQsIC4uLnggfSkgPT4gKHsgLi4ueCwgaWQgfSkpXG4gIHJldHVybiB0cmFuc2NvZGVyc1xufVxuXG4vKipcbiAqIEdldHMgYSB0aGUgcHJvdG9jb2xcbiAqIEBwYXJhbSB7UXVlcnlPYmp9IG9ialxuICogQHBhcmFtIHtHUUxDb250ZXh0fSBjdHhcbiAqIEByZXR1cm4ge1Byb3RvY29sfVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvdG9jb2woXG4gIG9iajogUXVlcnlPYmosXG4gIGFyZ3M6IFF1ZXJ5UHJvdG9jb2xBcmdzLFxuICBjdHg6IEdRTENvbnRleHQsXG4pOiBQcm90b2NvbCB7XG4gIGNvbnN0IHByb3RvY29sID0gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5nZXRQcm90b2NvbCgpXG4gIHJldHVybiBwcm90b2NvbFxufVxuIl19
