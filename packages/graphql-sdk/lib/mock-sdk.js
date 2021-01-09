'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

var _sdk = require('@livepeer/sdk')

var _ALL_ENS_NAMES,
  _ALL_ETH_BALANCES,
  _ALL_TOKEN_BALANCES,
  _ALL_BROADCASTERS,
  _ALL_DELEGATORS,
  _ALL_TRANSCODERS

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

/**
 * Mock SDK Interface
 */
var livepeer = {
  config: {
    eth: {
      net_version: (function () {
        var _net_version = (0, _asyncToGenerator2.default)(
          /*#__PURE__*/ _regenerator.default.mark(function _callee() {
            return _regenerator.default.wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    return _context.abrupt('return', '1')

                  case 1:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          }),
        )

        function net_version() {
          return _net_version.apply(this, arguments)
        }

        return net_version
      })(),
    },
    contracts: {},
  },
  constants: {
    ADDRESS_PAD: _sdk.ADDRESS_PAD,
    EMPTY_ADDRESS: _sdk.EMPTY_ADDRESS,
    DELEGATOR_STATUS: _sdk.DELEGATOR_STATUS,
    TRANSCODER_STATUS: _sdk.TRANSCODER_STATUS,
    VIDEO_PROFILE_ID_SIZE: _sdk.VIDEO_PROFILE_ID_SIZE,
    VIDEO_PROFILES: _sdk.VIDEO_PROFILES,
  },
  rpc: {
    getBlock: (function () {
      var _getBlock = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee2(id) {
          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch ((_context2.prev = _context2.next)) {
                case 0:
                  return _context2.abrupt('return', {
                    number: /latest/.test(id)
                      ? ''.concat(CURRENT_BLOCK++)
                      : /earliest/.test(id)
                      ? '0'
                      : ''.concat(id),
                  })

                case 1:
                case 'end':
                  return _context2.stop()
              }
            }
          }, _callee2)
        }),
      )

      function getBlock(_x) {
        return _getBlock.apply(this, arguments)
      }

      return getBlock
    })(),
    getENSName: (function () {
      var _getENSName = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee3(id) {
          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch ((_context3.prev = _context3.next)) {
                case 0:
                  return _context3.abrupt('return', ALL_ENS_NAMES[id] || '')

                case 1:
                case 'end':
                  return _context3.stop()
              }
            }
          }, _callee3)
        }),
      )

      function getENSName(_x2) {
        return _getENSName.apply(this, arguments)
      }

      return getENSName
    })(),
    getENSAddress: (function () {
      var _getENSAddress = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee4(name) {
          return _regenerator.default.wrap(function _callee4$(_context4) {
            while (1) {
              switch ((_context4.prev = _context4.next)) {
                case 0:
                  return _context4.abrupt(
                    'return',
                    ALL_ENS_ADDRESSES[name] || '',
                  )

                case 1:
                case 'end':
                  return _context4.stop()
              }
            }
          }, _callee4)
        }),
      )

      function getENSAddress(_x3) {
        return _getENSAddress.apply(this, arguments)
      }

      return getENSAddress
    })(),
    getEthBalance: (function () {
      var _getEthBalance = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee5(id) {
          return _regenerator.default.wrap(function _callee5$(_context5) {
            while (1) {
              switch ((_context5.prev = _context5.next)) {
                case 0:
                  _context5.next = 2
                  return livepeer.utils.resolveAddress(
                    livepeer.rpc.getENSAddress,
                    id,
                  )

                case 2:
                  _context5.t0 = _context5.sent
                  return _context5.abrupt(
                    'return',
                    ALL_ETH_BALANCES[_context5.t0],
                  )

                case 4:
                case 'end':
                  return _context5.stop()
              }
            }
          }, _callee5)
        }),
      )

      function getEthBalance(_x4) {
        return _getEthBalance.apply(this, arguments)
      }

      return getEthBalance
    })(),
    getTokenBalance: (function () {
      var _getTokenBalance = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee6(id) {
          return _regenerator.default.wrap(function _callee6$(_context6) {
            while (1) {
              switch ((_context6.prev = _context6.next)) {
                case 0:
                  _context6.next = 2
                  return livepeer.utils.resolveAddress(
                    livepeer.rpc.getENSAddress,
                    id,
                  )

                case 2:
                  _context6.t0 = _context6.sent
                  return _context6.abrupt(
                    'return',
                    ALL_TOKEN_BALANCES[_context6.t0],
                  )

                case 4:
                case 'end':
                  return _context6.stop()
              }
            }
          }, _callee6)
        }),
      )

      function getTokenBalance(_x5) {
        return _getTokenBalance.apply(this, arguments)
      }

      return getTokenBalance
    })(),
    getBroadcaster: (function () {
      var _getBroadcaster = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee7(id) {
          return _regenerator.default.wrap(function _callee7$(_context7) {
            while (1) {
              switch ((_context7.prev = _context7.next)) {
                case 0:
                  _context7.next = 2
                  return livepeer.utils.resolveAddress(
                    livepeer.rpc.getENSAddress,
                    id,
                  )

                case 2:
                  _context7.t0 = _context7.sent
                  return _context7.abrupt(
                    'return',
                    ALL_BROADCASTERS[_context7.t0],
                  )

                case 4:
                case 'end':
                  return _context7.stop()
              }
            }
          }, _callee7)
        }),
      )

      function getBroadcaster(_x6) {
        return _getBroadcaster.apply(this, arguments)
      }

      return getBroadcaster
    })(),
    getCurrentRoundInfo: (function () {
      var _getCurrentRoundInfo = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee8() {
          return _regenerator.default.wrap(function _callee8$(_context8) {
            while (1) {
              switch ((_context8.prev = _context8.next)) {
                case 0:
                  return _context8.abrupt('return', ALL_ROUNDS[100])

                case 1:
                case 'end':
                  return _context8.stop()
              }
            }
          }, _callee8)
        }),
      )

      function getCurrentRoundInfo() {
        return _getCurrentRoundInfo.apply(this, arguments)
      }

      return getCurrentRoundInfo
    })(),
    getDelegator: (function () {
      var _getDelegator = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee9(id) {
          return _regenerator.default.wrap(function _callee9$(_context9) {
            while (1) {
              switch ((_context9.prev = _context9.next)) {
                case 0:
                  _context9.next = 2
                  return livepeer.utils.resolveAddress(
                    livepeer.rpc.getENSAddress,
                    id,
                  )

                case 2:
                  _context9.t0 = _context9.sent
                  return _context9.abrupt(
                    'return',
                    ALL_DELEGATORS[_context9.t0],
                  )

                case 4:
                case 'end':
                  return _context9.stop()
              }
            }
          }, _callee9)
        }),
      )

      function getDelegator(_x7) {
        return _getDelegator.apply(this, arguments)
      }

      return getDelegator
    })(),
    getJob: (function () {
      var _getJob = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee10(id) {
          return _regenerator.default.wrap(function _callee10$(_context10) {
            while (1) {
              switch ((_context10.prev = _context10.next)) {
                case 0:
                  return _context10.abrupt('return', ALL_JOBS[id])

                case 1:
                case 'end':
                  return _context10.stop()
              }
            }
          }, _callee10)
        }),
      )

      function getJob(_x8) {
        return _getJob.apply(this, arguments)
      }

      return getJob
    })(),
    getJobs: (function () {
      var _getJobs = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee11() {
          var _ref,
            broadcaster,
            _args11 = arguments

          return _regenerator.default.wrap(function _callee11$(_context11) {
            while (1) {
              switch ((_context11.prev = _context11.next)) {
                case 0:
                  ;(_ref =
                    _args11.length > 0 && _args11[0] !== undefined
                      ? _args11[0]
                      : {}),
                    (broadcaster = _ref.broadcaster)
                  return _context11.abrupt(
                    'return',
                    broadcaster
                      ? ALL_JOBS.filter(function (x) {
                          return x.broadcaster === broadcaster
                        }).reverse()
                      : ALL_JOBS.slice().reverse(),
                  )

                case 2:
                case 'end':
                  return _context11.stop()
              }
            }
          }, _callee11)
        }),
      )

      function getJobs() {
        return _getJobs.apply(this, arguments)
      }

      return getJobs
    })(),
    getTranscoder: (function () {
      var _getTranscoder = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee12(id) {
          return _regenerator.default.wrap(function _callee12$(_context12) {
            while (1) {
              switch ((_context12.prev = _context12.next)) {
                case 0:
                  _context12.next = 2
                  return livepeer.utils.resolveAddress(
                    livepeer.rpc.getENSAddress,
                    id,
                  )

                case 2:
                  _context12.t0 = _context12.sent
                  return _context12.abrupt(
                    'return',
                    ALL_TRANSCODERS[_context12.t0],
                  )

                case 4:
                case 'end':
                  return _context12.stop()
              }
            }
          }, _callee12)
        }),
      )

      function getTranscoder(_x9) {
        return _getTranscoder.apply(this, arguments)
      }

      return getTranscoder
    })(),
    getTranscoders: (function () {
      var _getTranscoders = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee13() {
          return _regenerator.default.wrap(function _callee13$(_context13) {
            while (1) {
              switch ((_context13.prev = _context13.next)) {
                case 0:
                  return _context13.abrupt(
                    'return',
                    Object.values(ALL_TRANSCODERS),
                  )

                case 1:
                case 'end':
                  return _context13.stop()
              }
            }
          }, _callee13)
        }),
      )

      function getTranscoders() {
        return _getTranscoders.apply(this, arguments)
      }

      return getTranscoders
    })(),
    getProtocolPaused: (function () {
      var _getProtocolPaused = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee14() {
          return _regenerator.default.wrap(function _callee14$(_context14) {
            while (1) {
              switch ((_context14.prev = _context14.next)) {
                case 0:
                  return _context14.abrupt('return', false)

                case 1:
                case 'end':
                  return _context14.stop()
              }
            }
          }, _callee14)
        }),
      )

      function getProtocolPaused() {
        return _getProtocolPaused.apply(this, arguments)
      }

      return getProtocolPaused
    })(),
    getProtocol: (function () {
      var _getProtocol = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee15() {
          return _regenerator.default.wrap(function _callee15$(_context15) {
            while (1) {
              switch ((_context15.prev = _context15.next)) {
                case 0:
                  return _context15.abrupt('return', PROTOCOL)

                case 1:
                case 'end':
                  return _context15.stop()
              }
            }
          }, _callee15)
        }),
      )

      function getProtocol() {
        return _getProtocol.apply(this, arguments)
      }

      return getProtocol
    })(),
    getDelegatorUnbondingLocks: (function () {
      var _getDelegatorUnbondingLocks = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee16() {
          return _regenerator.default.wrap(function _callee16$(_context16) {
            while (1) {
              switch ((_context16.prev = _context16.next)) {
                case 0:
                  return _context16.abrupt('return', UNBONDINGLOCKS)

                case 1:
                case 'end':
                  return _context16.stop()
              }
            }
          }, _callee16)
        }),
      )

      function getDelegatorUnbondingLocks() {
        return _getDelegatorUnbondingLocks.apply(this, arguments)
      }

      return getDelegatorUnbondingLocks
    })(),
    getDelegatorUnbondingLock: (function () {
      var _getDelegatorUnbondingLock = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/ _regenerator.default.mark(function _callee17(id, index) {
          return _regenerator.default.wrap(function _callee17$(_context17) {
            while (1) {
              switch ((_context17.prev = _context17.next)) {
                case 0:
                  return _context17.abrupt(
                    'return',
                    UNBONDINGLOCKS[parseInt(index)],
                  )

                case 1:
                case 'end':
                  return _context17.stop()
              }
            }
          }, _callee17)
        }),
      )

      function getDelegatorUnbondingLock(_x10, _x11) {
        return _getDelegatorUnbondingLock.apply(this, arguments)
      }

      return getDelegatorUnbondingLock
    })(),
  },
  utils: _objectSpread(
    _objectSpread({}, _sdk.utils),
    {},
    {
      resolveAddress: (function () {
        var _resolveAddress = (0, _asyncToGenerator2.default)(
          /*#__PURE__*/ _regenerator.default.mark(function _callee18(
            resolve,
            addrOrName,
          ) {
            return _regenerator.default.wrap(function _callee18$(_context18) {
              while (1) {
                switch ((_context18.prev = _context18.next)) {
                  case 0:
                    if (!_sdk.utils.isValidAddress(addrOrName)) {
                      _context18.next = 4
                      break
                    }

                    _context18.t0 = addrOrName
                    _context18.next = 7
                    break

                  case 4:
                    _context18.next = 6
                    return livepeer.rpc.getENSAddress(addrOrName)

                  case 6:
                    _context18.t0 = _context18.sent

                  case 7:
                    return _context18.abrupt('return', _context18.t0)

                  case 8:
                  case 'end':
                    return _context18.stop()
                }
              }
            }, _callee18)
          }),
        )

        function resolveAddress(_x12, _x13) {
          return _resolveAddress.apply(this, arguments)
        }

        return resolveAddress
      })(),
    },
  ),
}
/**
 * Mock Contract Data
 */

var CURRENT_BLOCK = 0
var ALL_ENS_ADDRESSES = {
  'foo.test': _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
  'bar.test': _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
}
var ALL_ENS_NAMES =
  ((_ALL_ENS_NAMES = {}),
  (0, _defineProperty2.default)(
    _ALL_ENS_NAMES,
    ''.concat(_sdk.EMPTY_ADDRESS.replace(/00/g, '11')),
    '',
  ),
  (0, _defineProperty2.default)(
    _ALL_ENS_NAMES,
    ''.concat(_sdk.EMPTY_ADDRESS.replace(/00/g, '22')),
    'bar.test',
  ),
  _ALL_ENS_NAMES)
var ALL_ETH_BALANCES =
  ((_ALL_ETH_BALANCES = {}),
  (0, _defineProperty2.default)(
    _ALL_ETH_BALANCES,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
    '0',
  ),
  (0, _defineProperty2.default)(
    _ALL_ETH_BALANCES,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
    '1000000000',
  ),
  _ALL_ETH_BALANCES)
var ALL_TOKEN_BALANCES =
  ((_ALL_TOKEN_BALANCES = {}),
  (0, _defineProperty2.default)(
    _ALL_TOKEN_BALANCES,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
    '0',
  ),
  (0, _defineProperty2.default)(
    _ALL_TOKEN_BALANCES,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
    '9999999999',
  ),
  _ALL_TOKEN_BALANCES)
var ALL_BROADCASTERS =
  ((_ALL_BROADCASTERS = {}),
  (0, _defineProperty2.default)(
    _ALL_BROADCASTERS,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
    {
      address: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
      deposit: '0',
      withdrawBlock: '0',
    },
  ),
  (0, _defineProperty2.default)(
    _ALL_BROADCASTERS,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
    {
      address: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
      deposit: '1000',
      withdrawBlock: '50',
    },
  ),
  _ALL_BROADCASTERS)
var ALL_DELEGATORS =
  ((_ALL_DELEGATORS = {}),
  (0, _defineProperty2.default)(
    _ALL_DELEGATORS,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
    {
      address: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
      allowance: '0',
      delegateAddress: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
      bondedAmount: '0',
      fees: '0',
      delegatedAmount: '0',
      lastClaimRound: '0',
      pendingFees: '0',
      pendingStake: '0',
      startRound: '0',
      status: _sdk.DELEGATOR_STATUS.Unbonded,
      withdrawAmount: '0',
      withdrawRound: '0',
      nextUnbondingLockId: '0',
    },
  ),
  (0, _defineProperty2.default)(
    _ALL_DELEGATORS,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
    {
      address: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
      allowance: '0',
      delegateAddress: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
      bondedAmount: '0',
      fees: '0',
      delegatedAmount: '0',
      lastClaimRound: '0',
      pendingFees: '0',
      pendingStake: '0',
      startRound: '0',
      status: _sdk.DELEGATOR_STATUS.Unbonded,
      withdrawAmount: '0',
      withdrawRound: '0',
      nextUnbondingLockId: '0',
    },
  ),
  _ALL_DELEGATORS)
var ALL_JOBS = [
  {
    id: '0',
    streamId: 'x36xhzz',
    transcodingOptions: [_sdk.VIDEO_PROFILES.P144p30fps16x9],
    broadcaster: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
  },
  {
    id: '1',
    streamId: 'x36xhzz',
    transcodingOptions: [
      _sdk.VIDEO_PROFILES.P144p30fps16x9,
      _sdk.VIDEO_PROFILES.P240p30fps16x9,
    ],
    broadcaster: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
  },
  {
    id: '2',
    streamId: 'baz',
    transcodingOptions: [
      _sdk.VIDEO_PROFILES.P360p30fps16x9,
      _sdk.VIDEO_PROFILES.P720p30fps4x3,
      _sdk.VIDEO_PROFILES.P576p30fps16x9,
    ],
    broadcaster: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
  },
  {
    id: '3',
    streamId: 'baz',
    transcodingOptions: [],
    broadcaster: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
  },
]
var ALL_ROUNDS = {
  100: {
    id: '100',
    initialized: false,
    lastInitializedRound: '99',
    length: '50',
    startBlock: '12345',
  },
}
var ALL_TRANSCODERS =
  ((_ALL_TRANSCODERS = {}),
  (0, _defineProperty2.default)(
    _ALL_TRANSCODERS,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
    {
      active: false,
      address: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
      blockRewardCut: '0',
      feeShare: '0',
      lastRewardRound: '0',
      pricePerSegment: '0',
      pendingRewardCut: '0',
      pendingFeeShare: '0',
      pendingPricePerSegment: '0',
      rewardCut: '0',
      status: _sdk.TRANSCODER_STATUS.NotRegistered,
      totalStake: '0',
    },
  ),
  (0, _defineProperty2.default)(
    _ALL_TRANSCODERS,
    _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
    {
      active: true,
      address: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
      blockRewardCut: '0',
      feeShare: '0',
      lastRewardRound: '0',
      pricePerSegment: '0',
      pendingRewardCut: '0',
      pendingFeeShare: '0',
      pendingPricePerSegment: '0',
      rewardCut: '0',
      status: _sdk.TRANSCODER_STATUS.Registered,
      totalStake: '0',
    },
  ),
  _ALL_TRANSCODERS)
var PROTOCOL = {
  paused: false,
  totalTokenSupply: '0',
  totalBondedToken: '0',
  targetBondingRate: '0',
  transcoderPoolMaxSize: '0',
  maxEarningsClaimsRounds: '0',
}
var UNBONDINGLOCKS = [
  {
    id: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
    delegator: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
    amount: '0',
    withdrawRound: '0',
  },
]
var _default = livepeer
exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2NrLXNkay5qcyJdLCJuYW1lcyI6WyJsaXZlcGVlciIsImNvbmZpZyIsImV0aCIsIm5ldF92ZXJzaW9uIiwiY29udHJhY3RzIiwiY29uc3RhbnRzIiwiQUREUkVTU19QQUQiLCJFTVBUWV9BRERSRVNTIiwiREVMRUdBVE9SX1NUQVRVUyIsIlRSQU5TQ09ERVJfU1RBVFVTIiwiVklERU9fUFJPRklMRV9JRF9TSVpFIiwiVklERU9fUFJPRklMRVMiLCJycGMiLCJnZXRCbG9jayIsImlkIiwibnVtYmVyIiwidGVzdCIsIkNVUlJFTlRfQkxPQ0siLCJnZXRFTlNOYW1lIiwiQUxMX0VOU19OQU1FUyIsImdldEVOU0FkZHJlc3MiLCJuYW1lIiwiQUxMX0VOU19BRERSRVNTRVMiLCJnZXRFdGhCYWxhbmNlIiwidXRpbHMiLCJyZXNvbHZlQWRkcmVzcyIsIkFMTF9FVEhfQkFMQU5DRVMiLCJnZXRUb2tlbkJhbGFuY2UiLCJBTExfVE9LRU5fQkFMQU5DRVMiLCJnZXRCcm9hZGNhc3RlciIsIkFMTF9CUk9BRENBU1RFUlMiLCJnZXRDdXJyZW50Um91bmRJbmZvIiwiQUxMX1JPVU5EUyIsImdldERlbGVnYXRvciIsIkFMTF9ERUxFR0FUT1JTIiwiZ2V0Sm9iIiwiQUxMX0pPQlMiLCJnZXRKb2JzIiwiYnJvYWRjYXN0ZXIiLCJmaWx0ZXIiLCJ4IiwicmV2ZXJzZSIsInNsaWNlIiwiZ2V0VHJhbnNjb2RlciIsIkFMTF9UUkFOU0NPREVSUyIsImdldFRyYW5zY29kZXJzIiwiT2JqZWN0IiwidmFsdWVzIiwiZ2V0UHJvdG9jb2xQYXVzZWQiLCJnZXRQcm90b2NvbCIsIlBST1RPQ09MIiwiZ2V0RGVsZWdhdG9yVW5ib25kaW5nTG9ja3MiLCJVTkJPTkRJTkdMT0NLUyIsImdldERlbGVnYXRvclVuYm9uZGluZ0xvY2siLCJpbmRleCIsInBhcnNlSW50IiwicmVzb2x2ZSIsImFkZHJPck5hbWUiLCJpc1ZhbGlkQWRkcmVzcyIsInJlcGxhY2UiLCJhZGRyZXNzIiwiZGVwb3NpdCIsIndpdGhkcmF3QmxvY2siLCJhbGxvd2FuY2UiLCJkZWxlZ2F0ZUFkZHJlc3MiLCJib25kZWRBbW91bnQiLCJmZWVzIiwiZGVsZWdhdGVkQW1vdW50IiwibGFzdENsYWltUm91bmQiLCJwZW5kaW5nRmVlcyIsInBlbmRpbmdTdGFrZSIsInN0YXJ0Um91bmQiLCJzdGF0dXMiLCJVbmJvbmRlZCIsIndpdGhkcmF3QW1vdW50Iiwid2l0aGRyYXdSb3VuZCIsIm5leHRVbmJvbmRpbmdMb2NrSWQiLCJzdHJlYW1JZCIsInRyYW5zY29kaW5nT3B0aW9ucyIsIlAxNDRwMzBmcHMxNng5IiwiUDI0MHAzMGZwczE2eDkiLCJQMzYwcDMwZnBzMTZ4OSIsIlA3MjBwMzBmcHM0eDMiLCJQNTc2cDMwZnBzMTZ4OSIsImluaXRpYWxpemVkIiwibGFzdEluaXRpYWxpemVkUm91bmQiLCJsZW5ndGgiLCJzdGFydEJsb2NrIiwiYWN0aXZlIiwiYmxvY2tSZXdhcmRDdXQiLCJmZWVTaGFyZSIsImxhc3RSZXdhcmRSb3VuZCIsInByaWNlUGVyU2VnbWVudCIsInBlbmRpbmdSZXdhcmRDdXQiLCJwZW5kaW5nRmVlU2hhcmUiLCJwZW5kaW5nUHJpY2VQZXJTZWdtZW50IiwicmV3YXJkQ3V0IiwiTm90UmVnaXN0ZXJlZCIsInRvdGFsU3Rha2UiLCJSZWdpc3RlcmVkIiwicGF1c2VkIiwidG90YWxUb2tlblN1cHBseSIsInRvdGFsQm9uZGVkVG9rZW4iLCJ0YXJnZXRCb25kaW5nUmF0ZSIsInRyYW5zY29kZXJQb29sTWF4U2l6ZSIsIm1heEVhcm5pbmdzQ2xhaW1zUm91bmRzIiwiZGVsZWdhdG9yIiwiYW1vdW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFVQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxRQUFRLEdBQUc7QUFDZkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05DLElBQUFBLEdBQUcsRUFBRTtBQUNIQyxNQUFBQSxXQUFXO0FBQUEsbUdBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtB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QUFnQixFQUFFLEdBUGtCO0FBUXBDQyxFQUFBQSxlQUFlLEVBQUUsR0FSbUI7QUFTcENDLEVBQUFBLHNCQUFzQixFQUFFLEdBVFk7QUFVcENDLEVBQUFBLFNBQVMsRUFBRSxHQVZ5QjtBQVdwQ3hCLEVBQUFBLE1BQU0sRUFBRS9ELHVCQUFrQjBGLFVBWFU7QUFZcENELEVBQUFBLFVBQVUsRUFBRTtBQVp3QixDQWZuQixvQkFBckI7QUErQkEsSUFBTWhELFFBQVEsR0FBRztBQUNma0QsRUFBQUEsTUFBTSxFQUFFLEtBRE87QUFFZkMsRUFBQUEsZ0JBQWdCLEVBQUUsR0FGSDtBQUdmQyxFQUFBQSxnQkFBZ0IsRUFBRSxHQUhIO0FBSWZDLEVBQUFBLGlCQUFpQixFQUFFLEdBSko7QUFLZkMsRUFBQUEscUJBQXFCLEVBQUUsR0FMUjtBQU1mQyxFQUFBQSx1QkFBdUIsRUFBRTtBQU5WLENBQWpCO0FBU0EsSUFBTXJELGNBQWMsR0FBRyxDQUNyQjtBQUNFdEMsRUFBQUEsRUFBRSxFQUFFUCxtQkFBY29ELE9BQWQsQ0FBc0IsS0FBdEIsRUFBNkIsSUFBN0IsQ0FETjtBQUVFK0MsRUFBQUEsU0FBUyxFQUFFbkcsbUJBQWNvRCxPQUFkLENBQXNCLEtBQXRCLEVBQTZCLElBQTdCLENBRmI7QUFHRWdELEVBQUFBLE1BQU0sRUFBRSxHQUhWO0FBSUVoQyxFQUFBQSxhQUFhLEVBQUU7QUFKakIsQ0FEcUIsQ0FBdkI7ZUFTZTNFLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICB1dGlscyxcbiAgQUREUkVTU19QQUQsXG4gIEVNUFRZX0FERFJFU1MsXG4gIERFTEVHQVRPUl9TVEFUVVMsXG4gIFRSQU5TQ09ERVJfU1RBVFVTLFxuICBWSURFT19QUk9GSUxFX0lEX1NJWkUsXG4gIFZJREVPX1BST0ZJTEVTLFxufSBmcm9tICdAbGl2ZXBlZXIvc2RrJ1xuXG4vKipcbiAqIE1vY2sgU0RLIEludGVyZmFjZVxuICovXG5cbmNvbnN0IGxpdmVwZWVyID0ge1xuICBjb25maWc6IHtcbiAgICBldGg6IHtcbiAgICAgIG5ldF92ZXJzaW9uOiBhc3luYyAoKSA9PiAnMScsXG4gICAgfSxcbiAgICBjb250cmFjdHM6IHt9LFxuICB9LFxuICBjb25zdGFudHM6IHtcbiAgICBBRERSRVNTX1BBRCxcbiAgICBFTVBUWV9BRERSRVNTLFxuICAgIERFTEVHQVRPUl9TVEFUVVMsXG4gICAgVFJBTlNDT0RFUl9TVEFUVVMsXG4gICAgVklERU9fUFJPRklMRV9JRF9TSVpFLFxuICAgIFZJREVPX1BST0ZJTEVTLFxuICB9LFxuICBycGM6IHtcbiAgICBnZXRCbG9jazogYXN5bmMgaWQgPT4gKHtcbiAgICAgIG51bWJlcjogL2xhdGVzdC8udGVzdChpZClcbiAgICAgICAgPyBgJHtDVVJSRU5UX0JMT0NLKyt9YFxuICAgICAgICA6IC9lYXJsaWVzdC8udGVzdChpZClcbiAgICAgICAgPyAnMCdcbiAgICAgICAgOiBgJHtpZH1gLFxuICAgIH0pLFxuICAgIGdldEVOU05hbWU6IGFzeW5jIGlkID0+IEFMTF9FTlNfTkFNRVNbaWRdIHx8ICcnLFxuICAgIGdldEVOU0FkZHJlc3M6IGFzeW5jIG5hbWUgPT4gQUxMX0VOU19BRERSRVNTRVNbbmFtZV0gfHwgJycsXG4gICAgZ2V0RXRoQmFsYW5jZTogYXN5bmMgaWQgPT5cbiAgICAgIEFMTF9FVEhfQkFMQU5DRVNbXG4gICAgICAgIGF3YWl0IGxpdmVwZWVyLnV0aWxzLnJlc29sdmVBZGRyZXNzKGxpdmVwZWVyLnJwYy5nZXRFTlNBZGRyZXNzLCBpZClcbiAgICAgIF0sXG4gICAgZ2V0VG9rZW5CYWxhbmNlOiBhc3luYyBpZCA9PlxuICAgICAgQUxMX1RPS0VOX0JBTEFOQ0VTW1xuICAgICAgICBhd2FpdCBsaXZlcGVlci51dGlscy5yZXNvbHZlQWRkcmVzcyhsaXZlcGVlci5ycGMuZ2V0RU5TQWRkcmVzcywgaWQpXG4gICAgICBdLFxuICAgIGdldEJyb2FkY2FzdGVyOiBhc3luYyBpZCA9PlxuICAgICAgQUxMX0JST0FEQ0FTVEVSU1tcbiAgICAgICAgYXdhaXQgbGl2ZXBlZXIudXRpbHMucmVzb2x2ZUFkZHJlc3MobGl2ZXBlZXIucnBjLmdldEVOU0FkZHJlc3MsIGlkKVxuICAgICAgXSxcbiAgICBnZXRDdXJyZW50Um91bmRJbmZvOiBhc3luYyAoKSA9PiBBTExfUk9VTkRTWzEwMF0sXG4gICAgZ2V0RGVsZWdhdG9yOiBhc3luYyBpZCA9PlxuICAgICAgQUxMX0RFTEVHQVRPUlNbXG4gICAgICAgIGF3YWl0IGxpdmVwZWVyLnV0aWxzLnJlc29sdmVBZGRyZXNzKGxpdmVwZWVyLnJwYy5nZXRFTlNBZGRyZXNzLCBpZClcbiAgICAgIF0sXG4gICAgZ2V0Sm9iOiBhc3luYyBpZCA9PiBBTExfSk9CU1tpZF0sXG4gICAgZ2V0Sm9iczogYXN5bmMgKHsgYnJvYWRjYXN0ZXIgfSA9IHt9KSA9PlxuICAgICAgYnJvYWRjYXN0ZXJcbiAgICAgICAgPyBBTExfSk9CUy5maWx0ZXIoeCA9PiB4LmJyb2FkY2FzdGVyID09PSBicm9hZGNhc3RlcikucmV2ZXJzZSgpXG4gICAgICAgIDogQUxMX0pPQlMuc2xpY2UoKS5yZXZlcnNlKCksXG4gICAgZ2V0VHJhbnNjb2RlcjogYXN5bmMgaWQgPT5cbiAgICAgIEFMTF9UUkFOU0NPREVSU1tcbiAgICAgICAgYXdhaXQgbGl2ZXBlZXIudXRpbHMucmVzb2x2ZUFkZHJlc3MobGl2ZXBlZXIucnBjLmdldEVOU0FkZHJlc3MsIGlkKVxuICAgICAgXSxcbiAgICBnZXRUcmFuc2NvZGVyczogYXN5bmMgKCkgPT4gT2JqZWN0LnZhbHVlcyhBTExfVFJBTlNDT0RFUlMpLFxuICAgIGdldFByb3RvY29sUGF1c2VkOiBhc3luYyAoKSA9PiBmYWxzZSxcbiAgICBnZXRQcm90b2NvbDogYXN5bmMgKCkgPT4gUFJPVE9DT0wsXG4gICAgZ2V0RGVsZWdhdG9yVW5ib25kaW5nTG9ja3M6IGFzeW5jICgpID0+IFVOQk9ORElOR0xPQ0tTLFxuICAgIGdldERlbGVnYXRvclVuYm9uZGluZ0xvY2s6IGFzeW5jIChpZCwgaW5kZXgpID0+XG4gICAgICBVTkJPTkRJTkdMT0NLU1twYXJzZUludChpbmRleCldLFxuICB9LFxuICB1dGlsczoge1xuICAgIC4uLnV0aWxzLFxuICAgIHJlc29sdmVBZGRyZXNzOiBhc3luYyAocmVzb2x2ZSwgYWRkck9yTmFtZSkgPT4ge1xuICAgICAgcmV0dXJuIHV0aWxzLmlzVmFsaWRBZGRyZXNzKGFkZHJPck5hbWUpXG4gICAgICAgID8gYWRkck9yTmFtZVxuICAgICAgICA6IGF3YWl0IGxpdmVwZWVyLnJwYy5nZXRFTlNBZGRyZXNzKGFkZHJPck5hbWUpXG4gICAgfSxcbiAgfSxcbn1cblxuLyoqXG4gKiBNb2NrIENvbnRyYWN0IERhdGFcbiAqL1xuXG5sZXQgQ1VSUkVOVF9CTE9DSyA9IDBcblxuY29uc3QgQUxMX0VOU19BRERSRVNTRVMgPSB7XG4gICdmb28udGVzdCc6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzExJyksXG4gICdiYXIudGVzdCc6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyksXG59XG5cbmNvbnN0IEFMTF9FTlNfTkFNRVMgPSB7XG4gIFtgJHtFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcxMScpfWBdOiAnJyxcbiAgLy8gc2ltdWxhdGUgcmV2ZXJzZSBsb29rdXAgZmFpbCAoaGFwcGVucyBtb3N0IG9mIHRoZSB0aW1lKVxuICBbYCR7RU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMjInKX1gXTogJ2Jhci50ZXN0Jyxcbn1cblxuY29uc3QgQUxMX0VUSF9CQUxBTkNFUyA9IHtcbiAgW0VNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzExJyldOiAnMCcsXG4gIFtFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpXTogJzEwMDAwMDAwMDAnLFxufVxuXG5jb25zdCBBTExfVE9LRU5fQkFMQU5DRVMgPSB7XG4gIFtFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcxMScpXTogJzAnLFxuICBbRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMjInKV06ICc5OTk5OTk5OTk5Jyxcbn1cblxuY29uc3QgQUxMX0JST0FEQ0FTVEVSUyA9IHtcbiAgW0VNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzExJyldOiB7XG4gICAgYWRkcmVzczogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMTEnKSxcbiAgICBkZXBvc2l0OiAnMCcsXG4gICAgd2l0aGRyYXdCbG9jazogJzAnLFxuICB9LFxuICBbRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMjInKV06IHtcbiAgICBhZGRyZXNzOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpLFxuICAgIGRlcG9zaXQ6ICcxMDAwJyxcbiAgICB3aXRoZHJhd0Jsb2NrOiAnNTAnLFxuICB9LFxufVxuXG5jb25zdCBBTExfREVMRUdBVE9SUyA9IHtcbiAgW0VNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzExJyldOiB7XG4gICAgYWRkcmVzczogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMTEnKSxcbiAgICBhbGxvd2FuY2U6ICcwJyxcbiAgICBkZWxlZ2F0ZUFkZHJlc3M6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyksXG4gICAgYm9uZGVkQW1vdW50OiAnMCcsXG4gICAgZmVlczogJzAnLFxuICAgIGRlbGVnYXRlZEFtb3VudDogJzAnLFxuICAgIGxhc3RDbGFpbVJvdW5kOiAnMCcsXG4gICAgcGVuZGluZ0ZlZXM6ICcwJyxcbiAgICBwZW5kaW5nU3Rha2U6ICcwJyxcbiAgICBzdGFydFJvdW5kOiAnMCcsXG4gICAgc3RhdHVzOiBERUxFR0FUT1JfU1RBVFVTLlVuYm9uZGVkLFxuICAgIHdpdGhkcmF3QW1vdW50OiAnMCcsXG4gICAgd2l0aGRyYXdSb3VuZDogJzAnLFxuICAgIG5leHRVbmJvbmRpbmdMb2NrSWQ6ICcwJyxcbiAgfSxcbiAgW0VNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyldOiB7XG4gICAgYWRkcmVzczogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMjInKSxcbiAgICBhbGxvd2FuY2U6ICcwJyxcbiAgICBkZWxlZ2F0ZUFkZHJlc3M6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzExJyksXG4gICAgYm9uZGVkQW1vdW50OiAnMCcsXG4gICAgZmVlczogJzAnLFxuICAgIGRlbGVnYXRlZEFtb3VudDogJzAnLFxuICAgIGxhc3RDbGFpbVJvdW5kOiAnMCcsXG4gICAgcGVuZGluZ0ZlZXM6ICcwJyxcbiAgICBwZW5kaW5nU3Rha2U6ICcwJyxcbiAgICBzdGFydFJvdW5kOiAnMCcsXG4gICAgc3RhdHVzOiBERUxFR0FUT1JfU1RBVFVTLlVuYm9uZGVkLFxuICAgIHdpdGhkcmF3QW1vdW50OiAnMCcsXG4gICAgd2l0aGRyYXdSb3VuZDogJzAnLFxuICAgIG5leHRVbmJvbmRpbmdMb2NrSWQ6ICcwJyxcbiAgfSxcbn1cblxuY29uc3QgQUxMX0pPQlMgPSBbXG4gIHtcbiAgICBpZDogJzAnLFxuICAgIHN0cmVhbUlkOiAneDM2eGh6eicsXG4gICAgdHJhbnNjb2RpbmdPcHRpb25zOiBbVklERU9fUFJPRklMRVMuUDE0NHAzMGZwczE2eDldLFxuICAgIGJyb2FkY2FzdGVyOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcxMScpLFxuICB9LFxuICB7XG4gICAgaWQ6ICcxJyxcbiAgICBzdHJlYW1JZDogJ3gzNnhoenonLFxuICAgIHRyYW5zY29kaW5nT3B0aW9uczogW1xuICAgICAgVklERU9fUFJPRklMRVMuUDE0NHAzMGZwczE2eDksXG4gICAgICBWSURFT19QUk9GSUxFUy5QMjQwcDMwZnBzMTZ4OSxcbiAgICBdLFxuICAgIGJyb2FkY2FzdGVyOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpLFxuICB9LFxuICB7XG4gICAgaWQ6ICcyJyxcbiAgICBzdHJlYW1JZDogJ2JheicsXG4gICAgdHJhbnNjb2RpbmdPcHRpb25zOiBbXG4gICAgICBWSURFT19QUk9GSUxFUy5QMzYwcDMwZnBzMTZ4OSxcbiAgICAgIFZJREVPX1BST0ZJTEVTLlA3MjBwMzBmcHM0eDMsXG4gICAgICBWSURFT19QUk9GSUxFUy5QNTc2cDMwZnBzMTZ4OSxcbiAgICBdLFxuICAgIGJyb2FkY2FzdGVyOiBFTVBUWV9BRERSRVNTLnJlcGxhY2UoLzAwL2csICcyMicpLFxuICB9LFxuICB7XG4gICAgaWQ6ICczJyxcbiAgICBzdHJlYW1JZDogJ2JheicsXG4gICAgdHJhbnNjb2RpbmdPcHRpb25zOiBbXSxcbiAgICBicm9hZGNhc3RlcjogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMjInKSxcbiAgfSxcbl1cblxuY29uc3QgQUxMX1JPVU5EUyA9IHtcbiAgMTAwOiB7XG4gICAgaWQ6ICcxMDAnLFxuICAgIGluaXRpYWxpemVkOiBmYWxzZSxcbiAgICBsYXN0SW5pdGlhbGl6ZWRSb3VuZDogJzk5JyxcbiAgICBsZW5ndGg6ICc1MCcsXG4gICAgc3RhcnRCbG9jazogJzEyMzQ1JyxcbiAgfSxcbn1cblxuY29uc3QgQUxMX1RSQU5TQ09ERVJTID0ge1xuICBbRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMTEnKV06IHtcbiAgICBhY3RpdmU6IGZhbHNlLFxuICAgIGFkZHJlc3M6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzExJyksXG4gICAgYmxvY2tSZXdhcmRDdXQ6ICcwJyxcbiAgICBmZWVTaGFyZTogJzAnLFxuICAgIGxhc3RSZXdhcmRSb3VuZDogJzAnLFxuICAgIHByaWNlUGVyU2VnbWVudDogJzAnLFxuICAgIHBlbmRpbmdSZXdhcmRDdXQ6ICcwJyxcbiAgICBwZW5kaW5nRmVlU2hhcmU6ICcwJyxcbiAgICBwZW5kaW5nUHJpY2VQZXJTZWdtZW50OiAnMCcsXG4gICAgcmV3YXJkQ3V0OiAnMCcsXG4gICAgc3RhdHVzOiBUUkFOU0NPREVSX1NUQVRVUy5Ob3RSZWdpc3RlcmVkLFxuICAgIHRvdGFsU3Rha2U6ICcwJyxcbiAgfSxcbiAgW0VNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyldOiB7XG4gICAgYWN0aXZlOiB0cnVlLFxuICAgIGFkZHJlc3M6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyksXG4gICAgYmxvY2tSZXdhcmRDdXQ6ICcwJyxcbiAgICBmZWVTaGFyZTogJzAnLFxuICAgIGxhc3RSZXdhcmRSb3VuZDogJzAnLFxuICAgIHByaWNlUGVyU2VnbWVudDogJzAnLFxuICAgIHBlbmRpbmdSZXdhcmRDdXQ6ICcwJyxcbiAgICBwZW5kaW5nRmVlU2hhcmU6ICcwJyxcbiAgICBwZW5kaW5nUHJpY2VQZXJTZWdtZW50OiAnMCcsXG4gICAgcmV3YXJkQ3V0OiAnMCcsXG4gICAgc3RhdHVzOiBUUkFOU0NPREVSX1NUQVRVUy5SZWdpc3RlcmVkLFxuICAgIHRvdGFsU3Rha2U6ICcwJyxcbiAgfSxcbn1cblxuY29uc3QgUFJPVE9DT0wgPSB7XG4gIHBhdXNlZDogZmFsc2UsXG4gIHRvdGFsVG9rZW5TdXBwbHk6ICcwJyxcbiAgdG90YWxCb25kZWRUb2tlbjogJzAnLFxuICB0YXJnZXRCb25kaW5nUmF0ZTogJzAnLFxuICB0cmFuc2NvZGVyUG9vbE1heFNpemU6ICcwJyxcbiAgbWF4RWFybmluZ3NDbGFpbXNSb3VuZHM6ICcwJyxcbn1cblxuY29uc3QgVU5CT05ESU5HTE9DS1MgPSBbXG4gIHtcbiAgICBpZDogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMjInKSxcbiAgICBkZWxlZ2F0b3I6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzExJyksXG4gICAgYW1vdW50OiAnMCcsXG4gICAgd2l0aGRyYXdSb3VuZDogJzAnLFxuICB9LFxuXVxuXG5leHBvcnQgZGVmYXVsdCBsaXZlcGVlclxuIl19
