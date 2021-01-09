'use strict'

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard')

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

var _ava = _interopRequireDefault(require('ava'))

var _sdk = require('@livepeer/sdk')

var resolvers = _interopRequireWildcard(require('./Query'))

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

;(0, _ava.default)(
  'Query resolves `account` field',
  /*#__PURE__*/ (function () {
    var _ref = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee(t) {
        var obj, args, ctx, result
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                obj = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
                  ensName: 'foo.test',
                }
                args = {
                  id: obj.id,
                }
                ctx = {
                  livepeer: {
                    utils: {
                      resolveAddress: function resolveAddress() {
                        return obj.id
                      },
                    },
                    rpc: {
                      getENSName: function getENSName() {
                        return obj.ensName
                      },
                    },
                  },
                }
                _context.next = 5
                return resolvers.account(obj, args, ctx)

              case 5:
                result = _context.sent
                t.deepEqual(obj, result)

              case 7:
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
  'Query resolves `broadcaster` field',
  /*#__PURE__*/ (function () {
    var _ref2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee2(t) {
        var obj, args, ctx, result
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                obj = {
                  id: 'foo',
                  deposit: '0',
                  withdrawBlock: '0',
                }
                args = {
                  id: obj.id,
                }
                ctx = {
                  livepeer: {
                    rpc: {
                      getBroadcaster: function getBroadcaster() {
                        return obj
                      },
                    },
                  },
                }
                _context2.next = 5
                return resolvers.broadcaster(obj, args, ctx)

              case 5:
                result = _context2.sent
                t.deepEqual(obj, result)

              case 7:
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
;(0, _ava.default)(
  'Query resolves `delegator` field',
  /*#__PURE__*/ (function () {
    var _ref3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee3(t) {
        var obj, args, ctx, result
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                obj = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
                  status: _sdk.DELEGATOR_STATUS.Unbonded,
                  stake: '0',
                  bondedAmount: '0',
                  unbondedAmount: '0',
                  delegateAddress: _sdk.EMPTY_ADDRESS.replace(/00/g, '22'),
                  delegatedAmount: '0',
                  lastClaimRound: '0',
                  startRound: '0',
                  withdrawAmount: '0',
                  withdrawRound: '0',
                  nextUnbondingLockId: '0',
                  delegate: {},
                }
                args = {
                  id: obj.id,
                }
                ctx = {
                  livepeer: {
                    rpc: {
                      getDelegator: function getDelegator() {
                        return obj
                      },
                    },
                  },
                }
                _context3.next = 5
                return resolvers.delegator(obj, args, ctx)

              case 5:
                result = _context3.sent
                t.deepEqual(obj, result)

              case 7:
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
  'Query resolves `job` field',
  /*#__PURE__*/ (function () {
    var _ref4 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee4(t) {
        var job, obj, args, ctx, result
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                job = {
                  jobId: '0',
                  broadcaster: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
                  transcodingOptions: [_sdk.VIDEO_PROFILES.P144p30fps16x9],
                  streamId: 'bar',
                }
                obj = {
                  id: job.id,
                }
                args = {
                  id: obj.id,
                }
                ctx = {
                  livepeer: {
                    rpc: {
                      getJob: function getJob() {
                        return job
                      },
                    },
                  },
                }
                _context4.next = 6
                return resolvers.job(obj, args, ctx)

              case 6:
                result = _context4.sent
                t.deepEqual((0, _utils.transformJob)(job), result)

              case 8:
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
;(0, _ava.default)(
  'Query resolves `jobs` field',
  /*#__PURE__*/ (function () {
    var _ref5 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee5(t) {
        var jobs,
          ctx,
          obj,
          args,
          result,
          expected,
          _obj,
          _args5,
          _result,
          _expected,
          _obj2,
          _args6,
          _result2,
          _expected2,
          _obj3,
          _args7,
          _result3,
          _expected3,
          _obj4,
          _args8,
          _result4,
          _expected4

        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch ((_context5.prev = _context5.next)) {
              case 0:
                jobs = Array(3)
                  .fill({
                    jobId: '0',
                    broadcaster: _sdk.EMPTY_ADDRESS,
                    transcodingOptions: [_sdk.VIDEO_PROFILES.P144p30fps16x9],
                    streamId: 'bar',
                  })
                  .map(function (x, i) {
                    return _objectSpread(
                      _objectSpread({}, x),
                      {},
                      {
                        jobId: i,
                        broadcaster: x.broadcaster.replace(
                          /00/g,
                          ''.concat(i + 1).concat(i + 1),
                        ),
                      },
                    )
                  })
                  .reverse()
                ctx = {
                  livepeer: {
                    rpc: {
                      getJobs: function getJobs(_ref6) {
                        var broadcaster = _ref6.broadcaster,
                          skip = _ref6.skip,
                          limit = _ref6.limit
                        return jobs.filter(function (x) {
                          return !broadcaster || x.broadcaster === broadcaster
                        })
                      },
                    },
                  },
                } // gets all jobs

                obj = {}
                args = {}
                _context5.next = 6
                return resolvers.jobs(obj, args, ctx)

              case 6:
                result = _context5.sent
                expected = jobs.map(_utils.transformJob)
                t.deepEqual(expected, result)
                _obj = {}
                _args5 = {
                  broadcaster: _sdk.EMPTY_ADDRESS.replace(/00/g, '33'),
                }
                _context5.next = 13
                return resolvers.jobs(_obj, _args5, ctx)

              case 13:
                _result = _context5.sent
                _expected = [jobs[0]].map(_utils.transformJob)
                t.deepEqual(_expected, _result)
                _obj2 = {}
                _args6 = {
                  skip: 1,
                }
                _context5.next = 20
                return resolvers.jobs(_obj2, _args6, ctx)

              case 20:
                _result2 = _context5.sent
                _expected2 = [jobs[1], jobs[2]].map(_utils.transformJob)
                t.deepEqual(_expected2, _result2)
                _obj3 = {}
                _args7 = {
                  limit: 1,
                }
                _context5.next = 27
                return resolvers.jobs(_obj3, _args7, ctx)

              case 27:
                _result3 = _context5.sent
                _expected3 = [jobs[0]].map(_utils.transformJob)
                t.deepEqual(_expected3, _result3)
                _obj4 = {}
                _args8 = {
                  skip: 1,
                  limit: 1,
                }
                _context5.next = 34
                return resolvers.jobs(_obj4, _args8, ctx)

              case 34:
                _result4 = _context5.sent
                _expected4 = [jobs[1]].map(_utils.transformJob)
                t.deepEqual(_expected4, _result4)

              case 37:
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
  'Query resolves `me` field',
  /*#__PURE__*/ (function () {
    var _ref7 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee6(t) {
        var obj, args, ctx, result
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                obj = {
                  id: 'foo',
                }
                args = {
                  id: obj.id,
                }
                ctx = {
                  account: obj.id,
                }
                _context6.next = 5
                return resolvers.me(obj, args, ctx)

              case 5:
                result = _context6.sent
                t.deepEqual(obj, result)

              case 7:
              case 'end':
                return _context6.stop()
            }
          }
        }, _callee6)
      }),
    )

    return function (_x6) {
      return _ref7.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'Query resolves `currentRound` field',
  /*#__PURE__*/ (function () {
    var _ref8 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee7(t) {
        var obj, args, ctx, result
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch ((_context7.prev = _context7.next)) {
              case 0:
                obj = {
                  id: '100',
                  initialized: false,
                  lastInitializedRound: '99',
                  length: '50',
                }
                args = {}
                ctx = {
                  livepeer: {
                    rpc: {
                      getCurrentRoundInfo: function getCurrentRoundInfo() {
                        return obj
                      },
                    },
                  },
                }
                _context7.next = 5
                return resolvers.currentRound(obj, args, ctx)

              case 5:
                result = _context7.sent
                t.deepEqual(obj, result)

              case 7:
              case 'end':
                return _context7.stop()
            }
          }
        }, _callee7)
      }),
    )

    return function (_x7) {
      return _ref8.apply(this, arguments)
    }
  })(),
)
;(0, _ava.default)(
  'Query resolves `transcoder` field',
  /*#__PURE__*/ (function () {
    var _ref9 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/ _regenerator.default.mark(function _callee8(t) {
        var obj, args, ctx, result
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch ((_context8.prev = _context8.next)) {
              case 0:
                obj = {
                  id: _sdk.EMPTY_ADDRESS.replace(/00/g, '11'),
                  active: false,
                  status: _sdk.TRANSCODER_STATUS.NotRegistered,
                  lastRewardRound: '0',
                  blockRewardCut: '0',
                  feeShare: '0',
                  pricePerSegment: '0',
                  pendingBlockRewardCut: '0',
                  pendingFeeShare: '0',
                  pendingPricePerSegment: '0',
                }
                args = {
                  id: obj.id,
                }
                ctx = {
                  livepeer: {
                    rpc: {
                      getTranscoder: function getTranscoder() {
                        return obj
                      },
                    },
                  },
                }
                _context8.next = 5
                return resolvers.transcoder(obj, args, ctx)

              case 5:
                result = _context8.sent
                t.deepEqual(obj, result)

              case 7:
              case 'end':
                return _context8.stop()
            }
          }
        }, _callee8)
      }),
    )

    return function (_x8) {
      return _ref9.apply(this, arguments)
    }
  })(),
)

_ava.default.todo('Query resolves `transcoders` field')
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvUXVlcnkudGVzdC5qcyJdLCJuYW1lcyI6WyJ0Iiwib2JqIiwiaWQiLCJFTVBUWV9BRERSRVNTIiwicmVwbGFjZSIsImVuc05hbWUiLCJhcmdzIiwiY3R4IiwibGl2ZXBlZXIiLCJ1dGlscyIsInJlc29sdmVBZGRyZXNzIiwicnBjIiwiZ2V0RU5TTmFtZSIsInJlc29sdmVycyIsImFjY291bnQiLCJyZXN1bHQiLCJkZWVwRXF1YWwiLCJkZXBvc2l0Iiwid2l0aGRyYXdCbG9jayIsImdldEJyb2FkY2FzdGVyIiwiYnJvYWRjYXN0ZXIiLCJzdGF0dXMiLCJERUxFR0FUT1JfU1RBVFVTIiwiVW5ib25kZWQiLCJzdGFrZSIsImJvbmRlZEFtb3VudCIsInVuYm9uZGVkQW1vdW50IiwiZGVsZWdhdGVBZGRyZXNzIiwiZGVsZWdhdGVkQW1vdW50IiwibGFzdENsYWltUm91bmQiLCJzdGFydFJvdW5kIiwid2l0aGRyYXdBbW91bnQiLCJ3aXRoZHJhd1JvdW5kIiwibmV4dFVuYm9uZGluZ0xvY2tJZCIsImRlbGVnYXRlIiwiZ2V0RGVsZWdhdG9yIiwiZGVsZWdhdG9yIiwiam9iIiwiam9iSWQiLCJ0cmFuc2NvZGluZ09wdGlvbnMiLCJWSURFT19QUk9GSUxFUyIsIlAxNDRwMzBmcHMxNng5Iiwic3RyZWFtSWQiLCJnZXRKb2IiLCJqb2JzIiwiQXJyYXkiLCJmaWxsIiwibWFwIiwieCIsImkiLCJyZXZlcnNlIiwiZ2V0Sm9icyIsInNraXAiLCJsaW1pdCIsImZpbHRlciIsImV4cGVjdGVkIiwidHJhbnNmb3JtSm9iIiwibWUiLCJpbml0aWFsaXplZCIsImxhc3RJbml0aWFsaXplZFJvdW5kIiwibGVuZ3RoIiwiZ2V0Q3VycmVudFJvdW5kSW5mbyIsImN1cnJlbnRSb3VuZCIsImFjdGl2ZSIsIlRSQU5TQ09ERVJfU1RBVFVTIiwiTm90UmVnaXN0ZXJlZCIsImxhc3RSZXdhcmRSb3VuZCIsImJsb2NrUmV3YXJkQ3V0IiwiZmVlU2hhcmUiLCJwcmljZVBlclNlZ21lbnQiLCJwZW5kaW5nQmxvY2tSZXdhcmRDdXQiLCJwZW5kaW5nRmVlU2hhcmUiLCJwZW5kaW5nUHJpY2VQZXJTZWdtZW50IiwiZ2V0VHJhbnNjb2RlciIsInRyYW5zY29kZXIiLCJ0ZXN0IiwidG9kbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBTUE7O0FBQ0E7Ozs7OztBQUVBLGtCQUFLLGdDQUFMO0FBQUEscUZBQXVDLGlCQUFNQSxDQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUMvQkMsWUFBQUEsR0FEK0IsR0FDekI7QUFDVkMsY0FBQUEsRUFBRSxFQUFFQyxtQkFBY0MsT0FBZCxDQUFzQixLQUF0QixFQUE2QixJQUE3QixDQURNO0FBRVZDLGNBQUFBLE9BQU8sRUFBRTtBQUZDLGFBRHlCO0FBSy9CQyxZQUFBQSxJQUwrQixHQUt4QjtBQUNYSixjQUFBQSxFQUFFLEVBQUVELEdBQUcsQ0FBQ0M7QUFERyxhQUx3QjtBQVEvQkssWUFBQUEsR0FSK0IsR0FRekI7QUFDVkMsY0FBQUEsUUFBUSxFQUFFO0FBQ1JDLGdCQUFBQSxLQUFLLEVBQUU7QUFDTEMsa0JBQUFBLGNBQWMsRUFBRTtBQUFBLDJCQUFNVCxHQUFHLENBQUNDLEVBQVY7QUFBQTtBQURYLGlCQURDO0FBSVJTLGdCQUFBQSxHQUFHLEVBQUU7QUFDSEMsa0JBQUFBLFVBQVUsRUFBRTtBQUFBLDJCQUFNWCxHQUFHLENBQUNJLE9BQVY7QUFBQTtBQURUO0FBSkc7QUFEQSxhQVJ5QjtBQUFBO0FBQUEsbUJBa0JoQlEsU0FBUyxDQUFDQyxPQUFWLENBQWtCYixHQUFsQixFQUF1QkssSUFBdkIsRUFBNkJDLEdBQTdCLENBbEJnQjs7QUFBQTtBQWtCL0JRLFlBQUFBLE1BbEIrQjtBQW1CckNmLFlBQUFBLENBQUMsQ0FBQ2dCLFNBQUYsQ0FBWWYsR0FBWixFQUFpQmMsTUFBakI7O0FBbkJxQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUF2Qzs7QUFBQTtBQUFBO0FBQUE7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Q0FBc0IsS0FBdEIsRUFBNkIsSUFBN0IsQ0FETTtBQUVWMkQsY0FBQUEsTUFBTSxFQUFFLEtBRkU7QUFHVjFDLGNBQUFBLE1BQU0sRUFBRTJDLHVCQUFrQkMsYUFIaEI7QUFJVkMsY0FBQUEsZUFBZSxFQUFFLEdBSlA7QUFLVkMsY0FBQUEsY0FBYyxFQUFFLEdBTE47QUFNVkMsY0FBQUEsUUFBUSxFQUFFLEdBTkE7QUFPVkMsY0FBQUEsZUFBZSxFQUFFLEdBUFA7QUFRVkMsY0FBQUEscUJBQXFCLEVBQUUsR0FSYjtBQVNWQyxjQUFBQSxlQUFlLEVBQUUsR0FUUDtBQVVWQyxjQUFBQSxzQkFBc0IsRUFBRTtBQVZkLGFBRDRCO0FBYWxDbEUsWUFBQUEsSUFia0MsR0FhM0I7QUFDWEosY0FBQUEsRUFBRSxFQUFFRCxHQUFHLENBQUNDO0FBREcsYUFiMkI7QUFnQmxDSyxZQUFBQSxHQWhCa0MsR0FnQjVCO0FBQ1ZDLGNBQUFBLFFBQVEsRUFBRTtBQUNSRyxnQkFBQUEsR0FBRyxFQUFFO0FBQ0g4RCxrQkFBQUEsYUFBYSxFQUFFO0FBQUEsMkJBQU14RSxHQUFOO0FBQUE7QUFEWjtBQURHO0FBREEsYUFoQjRCO0FBQUE7QUFBQSxtQkF1Qm5CWSxTQUFTLENBQUM2RCxVQUFWLENBQXFCekUsR0FBckIsRUFBMEJLLElBQTFCLEVBQWdDQyxHQUFoQyxDQXZCbUI7O0FBQUE7QUF1QmxDUSxZQUFBQSxNQXZCa0M7QUF3QnhDZixZQUFBQSxDQUFDLENBQUNnQixTQUFGLENBQVlmLEdBQVosRUFBaUJjLE1BQWpCOztBQXhCd0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsR0FBMUM7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBMkJBNEQsYUFBS0MsSUFBTCxDQUFVLG9DQUFWIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJ1xuaW1wb3J0IHtcbiAgREVMRUdBVE9SX1NUQVRVUyxcbiAgRU1QVFlfQUREUkVTUyxcbiAgVFJBTlNDT0RFUl9TVEFUVVMsXG4gIFZJREVPX1BST0ZJTEVTLFxufSBmcm9tICdAbGl2ZXBlZXIvc2RrJ1xuaW1wb3J0ICogYXMgcmVzb2x2ZXJzIGZyb20gJy4vUXVlcnknXG5pbXBvcnQgeyB0cmFuc2Zvcm1Kb2IgfSBmcm9tICcuLi91dGlscydcblxudGVzdCgnUXVlcnkgcmVzb2x2ZXMgYGFjY291bnRgIGZpZWxkJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IG9iaiA9IHtcbiAgICBpZDogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMTEnKSxcbiAgICBlbnNOYW1lOiAnZm9vLnRlc3QnLFxuICB9XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgaWQ6IG9iai5pZCxcbiAgfVxuICBjb25zdCBjdHggPSB7XG4gICAgbGl2ZXBlZXI6IHtcbiAgICAgIHV0aWxzOiB7XG4gICAgICAgIHJlc29sdmVBZGRyZXNzOiAoKSA9PiBvYmouaWQsXG4gICAgICB9LFxuICAgICAgcnBjOiB7XG4gICAgICAgIGdldEVOU05hbWU6ICgpID0+IG9iai5lbnNOYW1lLFxuICAgICAgfSxcbiAgICB9LFxuICB9XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc29sdmVycy5hY2NvdW50KG9iaiwgYXJncywgY3R4KVxuICB0LmRlZXBFcXVhbChvYmosIHJlc3VsdClcbn0pXG5cbnRlc3QoJ1F1ZXJ5IHJlc29sdmVzIGBicm9hZGNhc3RlcmAgZmllbGQnLCBhc3luYyB0ID0+IHtcbiAgY29uc3Qgb2JqID0ge1xuICAgIGlkOiAnZm9vJyxcbiAgICBkZXBvc2l0OiAnMCcsXG4gICAgd2l0aGRyYXdCbG9jazogJzAnLFxuICB9XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgaWQ6IG9iai5pZCxcbiAgfVxuICBjb25zdCBjdHggPSB7XG4gICAgbGl2ZXBlZXI6IHtcbiAgICAgIHJwYzoge1xuICAgICAgICBnZXRCcm9hZGNhc3RlcjogKCkgPT4gb2JqLFxuICAgICAgfSxcbiAgICB9LFxuICB9XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc29sdmVycy5icm9hZGNhc3RlcihvYmosIGFyZ3MsIGN0eClcbiAgdC5kZWVwRXF1YWwob2JqLCByZXN1bHQpXG59KVxuXG50ZXN0KCdRdWVyeSByZXNvbHZlcyBgZGVsZWdhdG9yYCBmaWVsZCcsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBvYmogPSB7XG4gICAgaWQ6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzExJyksXG4gICAgc3RhdHVzOiBERUxFR0FUT1JfU1RBVFVTLlVuYm9uZGVkLFxuICAgIHN0YWtlOiAnMCcsXG4gICAgYm9uZGVkQW1vdW50OiAnMCcsXG4gICAgdW5ib25kZWRBbW91bnQ6ICcwJyxcbiAgICBkZWxlZ2F0ZUFkZHJlc3M6IEVNUFRZX0FERFJFU1MucmVwbGFjZSgvMDAvZywgJzIyJyksXG4gICAgZGVsZWdhdGVkQW1vdW50OiAnMCcsXG4gICAgbGFzdENsYWltUm91bmQ6ICcwJyxcbiAgICBzdGFydFJvdW5kOiAnMCcsXG4gICAgd2l0aGRyYXdBbW91bnQ6ICcwJyxcbiAgICB3aXRoZHJhd1JvdW5kOiAnMCcsXG4gICAgbmV4dFVuYm9uZGluZ0xvY2tJZDogJzAnLFxuICAgIGRlbGVnYXRlOiB7fSxcbiAgfVxuICBjb25zdCBhcmdzID0ge1xuICAgIGlkOiBvYmouaWQsXG4gIH1cbiAgY29uc3QgY3R4ID0ge1xuICAgIGxpdmVwZWVyOiB7XG4gICAgICBycGM6IHtcbiAgICAgICAgZ2V0RGVsZWdhdG9yOiAoKSA9PiBvYmosXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzLmRlbGVnYXRvcihvYmosIGFyZ3MsIGN0eClcbiAgdC5kZWVwRXF1YWwob2JqLCByZXN1bHQpXG59KVxuXG50ZXN0KCdRdWVyeSByZXNvbHZlcyBgam9iYCBmaWVsZCcsIGFzeW5jIHQgPT4ge1xuICBjb25zdCBqb2IgPSB7XG4gICAgam9iSWQ6ICcwJyxcbiAgICBicm9hZGNhc3RlcjogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMTEnKSxcbiAgICB0cmFuc2NvZGluZ09wdGlvbnM6IFtWSURFT19QUk9GSUxFUy5QMTQ0cDMwZnBzMTZ4OV0sXG4gICAgc3RyZWFtSWQ6ICdiYXInLFxuICB9XG4gIGNvbnN0IG9iaiA9IHtcbiAgICBpZDogam9iLmlkLFxuICB9XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgaWQ6IG9iai5pZCxcbiAgfVxuICBjb25zdCBjdHggPSB7XG4gICAgbGl2ZXBlZXI6IHtcbiAgICAgIHJwYzoge1xuICAgICAgICBnZXRKb2I6ICgpID0+IGpvYixcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxuICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNvbHZlcnMuam9iKG9iaiwgYXJncywgY3R4KVxuICB0LmRlZXBFcXVhbCh0cmFuc2Zvcm1Kb2Ioam9iKSwgcmVzdWx0KVxufSlcblxudGVzdCgnUXVlcnkgcmVzb2x2ZXMgYGpvYnNgIGZpZWxkJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IGpvYnMgPSBBcnJheSgzKVxuICAgIC5maWxsKHtcbiAgICAgIGpvYklkOiAnMCcsXG4gICAgICBicm9hZGNhc3RlcjogRU1QVFlfQUREUkVTUyxcbiAgICAgIHRyYW5zY29kaW5nT3B0aW9uczogW1ZJREVPX1BST0ZJTEVTLlAxNDRwMzBmcHMxNng5XSxcbiAgICAgIHN0cmVhbUlkOiAnYmFyJyxcbiAgICB9KVxuICAgIC5tYXAoKHgsIGkpID0+ICh7XG4gICAgICAuLi54LFxuICAgICAgam9iSWQ6IGksXG4gICAgICBicm9hZGNhc3RlcjogeC5icm9hZGNhc3Rlci5yZXBsYWNlKC8wMC9nLCBgJHtpICsgMX0ke2kgKyAxfWApLFxuICAgIH0pKVxuICAgIC5yZXZlcnNlKClcbiAgY29uc3QgY3R4ID0ge1xuICAgIGxpdmVwZWVyOiB7XG4gICAgICBycGM6IHtcbiAgICAgICAgZ2V0Sm9iczogKHsgYnJvYWRjYXN0ZXIsIHNraXAsIGxpbWl0IH0pID0+IHtcbiAgICAgICAgICByZXR1cm4gam9icy5maWx0ZXIoeCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gIWJyb2FkY2FzdGVyIHx8IHguYnJvYWRjYXN0ZXIgPT09IGJyb2FkY2FzdGVyXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxuICAvLyBnZXRzIGFsbCBqb2JzXG4gIHtcbiAgICBjb25zdCBvYmogPSB7fVxuICAgIGNvbnN0IGFyZ3MgPSB7fVxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc29sdmVycy5qb2JzKG9iaiwgYXJncywgY3R4KVxuICAgIGNvbnN0IGV4cGVjdGVkID0gam9icy5tYXAodHJhbnNmb3JtSm9iKVxuICAgIHQuZGVlcEVxdWFsKGV4cGVjdGVkLCByZXN1bHQpXG4gIH1cbiAgLy8gZ2V0cyBqb2JzIGJ5IGJyb2FkY2FzdGVyXG4gIHtcbiAgICBjb25zdCBvYmogPSB7fVxuICAgIGNvbnN0IGFyZ3MgPSB7XG4gICAgICBicm9hZGNhc3RlcjogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMzMnKSxcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzLmpvYnMob2JqLCBhcmdzLCBjdHgpXG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbam9ic1swXV0ubWFwKHRyYW5zZm9ybUpvYilcbiAgICB0LmRlZXBFcXVhbChleHBlY3RlZCwgcmVzdWx0KVxuICB9XG4gIC8vIGdldHMgam9icyB3aXRoIHNraXAgYXJnXG4gIHtcbiAgICBjb25zdCBvYmogPSB7fVxuICAgIGNvbnN0IGFyZ3MgPSB7XG4gICAgICBza2lwOiAxLFxuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNvbHZlcnMuam9icyhvYmosIGFyZ3MsIGN0eClcbiAgICBjb25zdCBleHBlY3RlZCA9IFtqb2JzWzFdLCBqb2JzWzJdXS5tYXAodHJhbnNmb3JtSm9iKVxuICAgIHQuZGVlcEVxdWFsKGV4cGVjdGVkLCByZXN1bHQpXG4gIH1cbiAgLy8gZ2V0cyBqb2JzIHdpdGggbGltaXQgYXJnXG4gIHtcbiAgICBjb25zdCBvYmogPSB7fVxuICAgIGNvbnN0IGFyZ3MgPSB7XG4gICAgICBsaW1pdDogMSxcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzLmpvYnMob2JqLCBhcmdzLCBjdHgpXG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbam9ic1swXV0ubWFwKHRyYW5zZm9ybUpvYilcbiAgICB0LmRlZXBFcXVhbChleHBlY3RlZCwgcmVzdWx0KVxuICB9XG4gIC8vIGdldHMgam9icyB3aXRoIHNraXAgYW5kIGxpbWl0IGFyZ3NcbiAge1xuICAgIGNvbnN0IG9iaiA9IHt9XG4gICAgY29uc3QgYXJncyA9IHtcbiAgICAgIHNraXA6IDEsXG4gICAgICBsaW1pdDogMSxcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzLmpvYnMob2JqLCBhcmdzLCBjdHgpXG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbam9ic1sxXV0ubWFwKHRyYW5zZm9ybUpvYilcbiAgICB0LmRlZXBFcXVhbChleHBlY3RlZCwgcmVzdWx0KVxuICB9XG59KVxuXG50ZXN0KCdRdWVyeSByZXNvbHZlcyBgbWVgIGZpZWxkJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IG9iaiA9IHtcbiAgICBpZDogJ2ZvbycsXG4gIH1cbiAgY29uc3QgYXJncyA9IHtcbiAgICBpZDogb2JqLmlkLFxuICB9XG4gIGNvbnN0IGN0eCA9IHtcbiAgICBhY2NvdW50OiBvYmouaWQsXG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzLm1lKG9iaiwgYXJncywgY3R4KVxuICB0LmRlZXBFcXVhbChvYmosIHJlc3VsdClcbn0pXG5cbnRlc3QoJ1F1ZXJ5IHJlc29sdmVzIGBjdXJyZW50Um91bmRgIGZpZWxkJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IG9iaiA9IHtcbiAgICBpZDogJzEwMCcsXG4gICAgaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgIGxhc3RJbml0aWFsaXplZFJvdW5kOiAnOTknLFxuICAgIGxlbmd0aDogJzUwJyxcbiAgfVxuICBjb25zdCBhcmdzID0ge31cbiAgY29uc3QgY3R4ID0ge1xuICAgIGxpdmVwZWVyOiB7XG4gICAgICBycGM6IHtcbiAgICAgICAgZ2V0Q3VycmVudFJvdW5kSW5mbzogKCkgPT4gb2JqLFxuICAgICAgfSxcbiAgICB9LFxuICB9XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc29sdmVycy5jdXJyZW50Um91bmQob2JqLCBhcmdzLCBjdHgpXG4gIHQuZGVlcEVxdWFsKG9iaiwgcmVzdWx0KVxufSlcblxudGVzdCgnUXVlcnkgcmVzb2x2ZXMgYHRyYW5zY29kZXJgIGZpZWxkJywgYXN5bmMgdCA9PiB7XG4gIGNvbnN0IG9iaiA9IHtcbiAgICBpZDogRU1QVFlfQUREUkVTUy5yZXBsYWNlKC8wMC9nLCAnMTEnKSxcbiAgICBhY3RpdmU6IGZhbHNlLFxuICAgIHN0YXR1czogVFJBTlNDT0RFUl9TVEFUVVMuTm90UmVnaXN0ZXJlZCxcbiAgICBsYXN0UmV3YXJkUm91bmQ6ICcwJyxcbiAgICBibG9ja1Jld2FyZEN1dDogJzAnLFxuICAgIGZlZVNoYXJlOiAnMCcsXG4gICAgcHJpY2VQZXJTZWdtZW50OiAnMCcsXG4gICAgcGVuZGluZ0Jsb2NrUmV3YXJkQ3V0OiAnMCcsXG4gICAgcGVuZGluZ0ZlZVNoYXJlOiAnMCcsXG4gICAgcGVuZGluZ1ByaWNlUGVyU2VnbWVudDogJzAnLFxuICB9XG4gIGNvbnN0IGFyZ3MgPSB7XG4gICAgaWQ6IG9iai5pZCxcbiAgfVxuICBjb25zdCBjdHggPSB7XG4gICAgbGl2ZXBlZXI6IHtcbiAgICAgIHJwYzoge1xuICAgICAgICBnZXRUcmFuc2NvZGVyOiAoKSA9PiBvYmosXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzb2x2ZXJzLnRyYW5zY29kZXIob2JqLCBhcmdzLCBjdHgpXG4gIHQuZGVlcEVxdWFsKG9iaiwgcmVzdWx0KVxufSlcblxudGVzdC50b2RvKCdRdWVyeSByZXNvbHZlcyBgdHJhbnNjb2RlcnNgIGZpZWxkJylcbiJdfQ==
