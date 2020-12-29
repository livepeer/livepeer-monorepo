'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.approve = approve
exports.bond = bond
exports.claimEarnings = claimEarnings
exports.sendTransaction = sendTransaction
exports.unbond = unbond
exports.rebond = rebond
exports.rebondFromUnbonded = rebondFromUnbonded
exports.initializeRound = initializeRound

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

var _Subscription = require('./Subscription')

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

var BN = require('bn.js')
/** Typedefs */

/** Resolvers */

/**
 * Approve an amount for an ERC20 token transfer
 * @param {MutationObj} obj
 * @param {string} type - The approval type
 * @param {string} amount - The approval amount
 * @return {Promise<TxReceipt>}
 */
function approve(_x, _x2, _x3) {
  return _approve.apply(this, arguments)
}
/**
 * Submits a bond transaction for a previously approved amount
 * @param {MutationObj} obj
 * @param {string} to - The ETH address of the delegate to bond to
 * @param {string} amount - The approval amount
 * @return {Promise<TxReceipt>}
 */

function _approve() {
  _approve = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee(obj, args, ctx) {
      var type, amount, gas
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              ;(type = args.type), (amount = args.amount)
              _context.t0 = type
              _context.next = _context.t0 === 'bond' ? 4 : 11
              break

            case 4:
              _context.next = 6
              return ctx.livepeer.rpc.estimateGas('LivepeerToken', 'approve', [
                ctx.livepeer.config.contracts.BondingManager.address,
                amount,
              ])

            case 6:
              gas = _context.sent
              _context.next = 9
              return ctx.livepeer.rpc.approveTokenBondAmount(amount, {
                gas: gas,
              })

            case 9:
              return _context.abrupt('return', _context.sent)

            case 11:
              throw new Error(
                'Approval type "'.concat(type, '" is not supported.'),
              )

            case 12:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    }),
  )
  return _approve.apply(this, arguments)
}

function bond(_x4, _x5, _x6) {
  return _bond.apply(this, arguments)
}
/**
 * Submits a claimEarnings transaction
 * @param {MutationObj} obj
 * @param {string} endRound - The round to claim earnings until
 * @return {Promise<TxReceipt>}
 */

function _bond() {
  _bond = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee2(obj, args, ctx) {
      var to, amount, gas
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              ;(to = args.to), (amount = args.amount)
              _context2.next = 3
              return ctx.livepeer.rpc.estimateGas('BondingManager', 'bond', [
                amount,
                to,
              ])

            case 3:
              gas = _context2.sent
              _context2.next = 6
              return ctx.livepeer.rpc.bondApprovedTokenAmount(to, amount, {
                gas: gas,
              })

            case 6:
              return _context2.abrupt('return', _context2.sent)

            case 7:
            case 'end':
              return _context2.stop()
          }
        }
      }, _callee2)
    }),
  )
  return _bond.apply(this, arguments)
}

function claimEarnings(_x7, _x8, _x9) {
  return _claimEarnings.apply(this, arguments)
}
/**
 * Send a transaction object
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */

function _claimEarnings() {
  _claimEarnings = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee3(obj, args, ctx) {
      var _mockTx

      var _ctx$livepeer,
        utils,
        config,
        eth,
        endRound,
        gas,
        txHash,
        mockTx,
        receipt

      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch ((_context3.prev = _context3.next)) {
            case 0:
              ;(_ctx$livepeer = ctx.livepeer),
                (utils = _ctx$livepeer.utils),
                (config = _ctx$livepeer.config)
              eth = config.eth
              endRound = args.endRound
              _context3.next = 5
              return ctx.livepeer.rpc.estimateGas(
                'BondingManager',
                'claimEarnings',
                [endRound],
              )

            case 5:
              gas = _context3.sent
              _context3.next = 8
              return ctx.livepeer.rpc.claimEarnings(endRound, {
                gas: gas,
              })

            case 8:
              txHash = _context3.sent
              console.log(txHash)
              mockTx =
                ((_mockTx = {
                  blockNumber: '',
                  blockHash: '',
                  transactionIndex: '',
                  from: ctx.account,
                  to: '',
                  value: '',
                  isError: '0x0',
                  status: '',
                  input: '',
                  contractAddress: '',
                  cumulativeGasUsed: '',
                  confirmations: '0',
                  contract: 'BondingManager',
                  gas: gas,
                  gasUsed: '',
                  gasPrice: '',
                  id: txHash,
                  method: 'claimEarnings',
                  nonce: '',
                  params: {
                    _endRound: endRound,
                  },
                }),
                (0, _defineProperty2.default)(_mockTx, 'status', 'pending'),
                (0, _defineProperty2.default)(
                  _mockTx,
                  'timeStamp',
                  ''.concat(Math.floor(Date.now() / 1000)),
                ),
                _mockTx)
              ;(0, _Subscription.publish)(
                _Subscription.TransactionSubmitted,
                mockTx,
              )
              _context3.next = 14
              return utils.getTxReceipt(txHash, eth)

            case 14:
              receipt = _context3.sent
              ;(0, _Subscription.publish)(
                _Subscription.TransactionConfirmed,
                _objectSpread(
                  _objectSpread({}, mockTx),
                  {},
                  {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber.toString(10),
                    cumulativeGasUsed: receipt.cumulativeGasUsed.toString(10),
                    gasUsed: receipt.gasUsed.toString(10),
                    to: receipt.to,
                    transactionIndex: receipt.transactionIndex.toString(10),
                    status: receipt.status.substr(2),
                    confirmations: '1',
                  },
                ),
              )

            case 16:
            case 'end':
              return _context3.stop()
          }
        }
      }, _callee3)
    }),
  )
  return _claimEarnings.apply(this, arguments)
}

function sendTransaction(_x10, _x11, _x12) {
  return _sendTransaction.apply(this, arguments)
}
/**
 * Submits an unbond transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */

function _sendTransaction() {
  _sendTransaction = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee4(obj, args, ctx) {
      var _ctx$livepeer2, utils, config, eth, defaultTx

      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch ((_context4.prev = _context4.next)) {
            case 0:
              ;(_ctx$livepeer2 = ctx.livepeer),
                (utils = _ctx$livepeer2.utils),
                (config = _ctx$livepeer2.config)
              ;(eth = config.eth), (defaultTx = config.defaultTx)
              _context4.t0 = utils
              _context4.next = 5
              return eth.sendTransaction(
                _objectSpread(_objectSpread({}, defaultTx), args.options),
              )

            case 5:
              _context4.t1 = _context4.sent
              _context4.t2 = eth
              _context4.next = 9
              return _context4.t0.getTxReceipt.call(
                _context4.t0,
                _context4.t1,
                _context4.t2,
              )

            case 9:
              return _context4.abrupt('return', _context4.sent)

            case 10:
            case 'end':
              return _context4.stop()
          }
        }
      }, _callee4)
    }),
  )
  return _sendTransaction.apply(this, arguments)
}

function unbond(_x13, _x14, _x15) {
  return _unbond.apply(this, arguments)
}
/**
 * Submits a rebond transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */

function _unbond() {
  _unbond = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee5(obj, args, ctx) {
      var amount
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch ((_context5.prev = _context5.next)) {
            case 0:
              amount = args.amount
              _context5.next = 3
              return ctx.livepeer.rpc.unbond(
                amount,
                _objectSpread({}, ctx.livepeer.config.defaultTx),
              )

            case 3:
              return _context5.abrupt('return', _context5.sent)

            case 4:
            case 'end':
              return _context5.stop()
          }
        }
      }, _callee5)
    }),
  )
  return _unbond.apply(this, arguments)
}

function rebond(_x16, _x17, _x18) {
  return _rebond.apply(this, arguments)
}
/**
 * Submits a rebondFromUnbonded transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */

function _rebond() {
  _rebond = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee6(obj, args, ctx) {
      var unbondingLockId, gas
      return _regenerator.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch ((_context6.prev = _context6.next)) {
            case 0:
              unbondingLockId = args.unbondingLockId
              _context6.next = 3
              return ctx.livepeer.rpc.estimateGas('BondingManager', 'rebond', [
                unbondingLockId,
              ])

            case 3:
              gas = _context6.sent
              _context6.next = 6
              return ctx.livepeer.rpc.rebond(
                unbondingLockId,
                _objectSpread(
                  _objectSpread({}, ctx.livepeer.config.defaultTx),
                  {},
                  {
                    gas: gas,
                  },
                ),
              )

            case 6:
              return _context6.abrupt('return', _context6.sent)

            case 7:
            case 'end':
              return _context6.stop()
          }
        }
      }, _callee6)
    }),
  )
  return _rebond.apply(this, arguments)
}

function rebondFromUnbonded(_x19, _x20, _x21) {
  return _rebondFromUnbonded.apply(this, arguments)
}
/**
 * Submits a round initialization transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */

function _rebondFromUnbonded() {
  _rebondFromUnbonded = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee7(obj, args, ctx) {
      var delegate, unbondingLockId, gas
      return _regenerator.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch ((_context7.prev = _context7.next)) {
            case 0:
              ;(delegate = args.delegate),
                (unbondingLockId = args.unbondingLockId)
              _context7.next = 3
              return ctx.livepeer.rpc.estimateGas(
                'BondingManager',
                'rebondFromUnbonded',
                [delegate, unbondingLockId],
              )

            case 3:
              gas = _context7.sent
              _context7.next = 6
              return ctx.livepeer.rpc.rebondFromUnbonded(
                delegate,
                unbondingLockId,
                {
                  gas: gas,
                },
              )

            case 6:
              return _context7.abrupt('return', _context7.sent)

            case 7:
            case 'end':
              return _context7.stop()
          }
        }
      }, _callee7)
    }),
  )
  return _rebondFromUnbonded.apply(this, arguments)
}

function initializeRound(_x22, _x23, _x24) {
  return _initializeRound.apply(this, arguments)
}

function _initializeRound() {
  _initializeRound = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/ _regenerator.default.mark(function _callee8(obj, args, ctx) {
      var gas
      return _regenerator.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch ((_context8.prev = _context8.next)) {
            case 0:
              _context8.next = 2
              return ctx.livepeer.rpc.estimateGas(
                'RoundsManager',
                'initializeRound',
                [],
              )

            case 2:
              gas = _context8.sent
              _context8.next = 5
              return ctx.livepeer.rpc.initializeRound({
                gas: gas,
              })

            case 5:
              return _context8.abrupt('return', _context8.sent)

            case 6:
            case 'end':
              return _context8.stop()
          }
        }
      }, _callee8)
    }),
  )
  return _initializeRound.apply(this, arguments)
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXNvbHZlcnMvTXV0YXRpb24uanMiXSwibmFtZXMiOlsiQk4iLCJyZXF1aXJlIiwiYXBwcm92ZSIsIm9iaiIsImFyZ3MiLCJjdHgiLCJ0eXBlIiwiYW1vdW50IiwibGl2ZXBlZXIiLCJycGMiLCJlc3RpbWF0ZUdhcyIsImNvbmZpZyIsImNvbnRyYWN0cyIsIkJvbmRpbmdNYW5hZ2VyIiwiYWRkcmVzcyIsImdhcyIsImFwcHJvdmVUb2tlbkJvbmRBbW91bnQiLCJFcnJvciIsImJvbmQiLCJ0byIsImJvbmRBcHByb3ZlZFRva2VuQW1vdW50IiwiY2xhaW1FYXJuaW5ncyIsInV0aWxzIiwiZXRoIiwiZW5kUm91bmQiLCJ0eEhhc2giLCJjb25zb2xlIiwibG9nIiwibW9ja1R4IiwiYmxvY2tOdW1iZXIiLCJibG9ja0hhc2giLCJ0cmFuc2FjdGlvbkluZGV4IiwiZnJvbSIsImFjY291bnQiLCJ2YWx1ZSIsImlzRXJyb3IiLCJzdGF0dXMiLCJpbnB1dCIsImNvbnRyYWN0QWRkcmVzcyIsImN1bXVsYXRpdmVHYXNVc2VkIiwiY29uZmlybWF0aW9ucyIsImNvbnRyYWN0IiwiZ2FzVXNlZCIsImdhc1ByaWNlIiwiaWQiLCJtZXRob2QiLCJub25jZSIsInBhcmFtcyIsIl9lbmRSb3VuZCIsIk1hdGgiLCJmbG9vciIsIkRhdGUiLCJub3ciLCJUcmFuc2FjdGlvblN1Ym1pdHRlZCIsImdldFR4UmVjZWlwdCIsInJlY2VpcHQiLCJUcmFuc2FjdGlvbkNvbmZpcm1lZCIsInRvU3RyaW5nIiwic3Vic3RyIiwic2VuZFRyYW5zYWN0aW9uIiwiZGVmYXVsdFR4Iiwib3B0aW9ucyIsInVuYm9uZCIsInJlYm9uZCIsInVuYm9uZGluZ0xvY2tJZCIsInJlYm9uZEZyb21VbmJvbmRlZCIsImRlbGVnYXRlIiwiaW5pdGlhbGl6ZVJvdW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQU1BLElBQU1BLEVBQUUsR0FBR0MsT0FB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QUFBO0FBQUEsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHB1Ymxpc2gsXG4gIFRyYW5zYWN0aW9uQ29uZmlybWVkLFxuICBUcmFuc2FjdGlvblN1Ym1pdHRlZCxcbn0gZnJvbSAnLi9TdWJzY3JpcHRpb24nXG5cbmNvbnN0IEJOID0gcmVxdWlyZSgnYm4uanMnKVxuLyoqIFR5cGVkZWZzICovXG5cbnR5cGUgR1FMQ29udGV4dCA9IHtcbiAgbGl2ZXBlZXI6IE9iamVjdCxcbiAgYWNjb3VudD86IHN0cmluZyxcbn1cblxudHlwZSBNdXRhdGlvbk9iaiA9IHt9XG5cbi8qKiBSZXNvbHZlcnMgKi9cblxuLyoqXG4gKiBBcHByb3ZlIGFuIGFtb3VudCBmb3IgYW4gRVJDMjAgdG9rZW4gdHJhbnNmZXJcbiAqIEBwYXJhbSB7TXV0YXRpb25PYmp9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBUaGUgYXBwcm92YWwgdHlwZVxuICogQHBhcmFtIHtzdHJpbmd9IGFtb3VudCAtIFRoZSBhcHByb3ZhbCBhbW91bnRcbiAqIEByZXR1cm4ge1Byb21pc2U8VHhSZWNlaXB0Pn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFwcHJvdmUoXG4gIG9iajogTXV0YXRpb25PYmosXG4gIGFyZ3M6IHsgdHlwZTogc3RyaW5nLCBhbW91bnQ6IHN0cmluZyB9LFxuICBjdHg6IEdRTENvbnRleHQsXG4pOiBQcm9taXNlPFR4UmVjZWlwdD4ge1xuICBjb25zdCB7IHR5cGUsIGFtb3VudCB9ID0gYXJnc1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlICdib25kJzpcbiAgICAgIGNvbnN0IGdhcyA9IGF3YWl0IGN0eC5saXZlcGVlci5ycGMuZXN0aW1hdGVHYXMoXG4gICAgICAgICdMaXZlcGVlclRva2VuJyxcbiAgICAgICAgJ2FwcHJvdmUnLFxuICAgICAgICBbY3R4LmxpdmVwZWVyLmNvbmZpZy5jb250cmFjdHMuQm9uZGluZ01hbmFnZXIuYWRkcmVzcywgYW1vdW50XSxcbiAgICAgIClcbiAgICAgIHJldHVybiBhd2FpdCBjdHgubGl2ZXBlZXIucnBjLmFwcHJvdmVUb2tlbkJvbmRBbW91bnQoYW1vdW50LCB7XG4gICAgICAgIGdhczogZ2FzLFxuICAgICAgfSlcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXBwcm92YWwgdHlwZSBcIiR7dHlwZX1cIiBpcyBub3Qgc3VwcG9ydGVkLmApXG4gIH1cbn1cblxuLyoqXG4gKiBTdWJtaXRzIGEgYm9uZCB0cmFuc2FjdGlvbiBmb3IgYSBwcmV2aW91c2x5IGFwcHJvdmVkIGFtb3VudFxuICogQHBhcmFtIHtNdXRhdGlvbk9ian0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gdG8gLSBUaGUgRVRIIGFkZHJlc3Mgb2YgdGhlIGRlbGVnYXRlIHRvIGJvbmQgdG9cbiAqIEBwYXJhbSB7c3RyaW5nfSBhbW91bnQgLSBUaGUgYXBwcm92YWwgYW1vdW50XG4gKiBAcmV0dXJuIHtQcm9taXNlPFR4UmVjZWlwdD59XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBib25kKFxuICBvYmo6IE11dGF0aW9uT2JqLFxuICBhcmdzOiB7IHRvOiBzdHJpbmcsIGFtb3VudDogc3RyaW5nIH0sXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFByb21pc2U8VHhSZWNlaXB0PiB7XG4gIGNvbnN0IHsgdG8sIGFtb3VudCB9ID0gYXJnc1xuICBjb25zdCBnYXMgPSBhd2FpdCBjdHgubGl2ZXBlZXIucnBjLmVzdGltYXRlR2FzKCdCb25kaW5nTWFuYWdlcicsICdib25kJywgW1xuICAgIGFtb3VudCxcbiAgICB0byxcbiAgXSlcbiAgcmV0dXJuIGF3YWl0IGN0eC5saXZlcGVlci5ycGMuYm9uZEFwcHJvdmVkVG9rZW5BbW91bnQodG8sIGFtb3VudCwge1xuICAgIGdhczogZ2FzLFxuICB9KVxufVxuXG4vKipcbiAqIFN1Ym1pdHMgYSBjbGFpbUVhcm5pbmdzIHRyYW5zYWN0aW9uXG4gKiBAcGFyYW0ge011dGF0aW9uT2JqfSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRSb3VuZCAtIFRoZSByb3VuZCB0byBjbGFpbSBlYXJuaW5ncyB1bnRpbFxuICogQHJldHVybiB7UHJvbWlzZTxUeFJlY2VpcHQ+fVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xhaW1FYXJuaW5ncyhcbiAgb2JqOiBNdXRhdGlvbk9iaixcbiAgYXJnczogeyBlbmRSb3VuZDogc3RyaW5nIH0sXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFByb21pc2U8VHhSZWNlaXB0PiB7XG4gIGNvbnN0IHsgdXRpbHMsIGNvbmZpZyB9ID0gY3R4LmxpdmVwZWVyXG4gIGNvbnN0IHsgZXRoIH0gPSBjb25maWdcbiAgY29uc3QgeyBlbmRSb3VuZCB9ID0gYXJnc1xuICBjb25zdCBnYXMgPSBhd2FpdCBjdHgubGl2ZXBlZXIucnBjLmVzdGltYXRlR2FzKFxuICAgICdCb25kaW5nTWFuYWdlcicsXG4gICAgJ2NsYWltRWFybmluZ3MnLFxuICAgIFtlbmRSb3VuZF0sXG4gIClcbiAgY29uc3QgdHhIYXNoID0gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5jbGFpbUVhcm5pbmdzKGVuZFJvdW5kLCB7XG4gICAgZ2FzOiBnYXMsXG4gIH0pXG4gIGNvbnNvbGUubG9nKHR4SGFzaClcbiAgY29uc3QgbW9ja1R4ID0ge1xuICAgIGJsb2NrTnVtYmVyOiAnJyxcbiAgICBibG9ja0hhc2g6ICcnLFxuICAgIHRyYW5zYWN0aW9uSW5kZXg6ICcnLFxuICAgIGZyb206IGN0eC5hY2NvdW50LFxuICAgIHRvOiAnJyxcbiAgICB2YWx1ZTogJycsXG4gICAgaXNFcnJvcjogJzB4MCcsXG4gICAgc3RhdHVzOiAnJyxcbiAgICBpbnB1dDogJycsXG4gICAgY29udHJhY3RBZGRyZXNzOiAnJyxcbiAgICBjdW11bGF0aXZlR2FzVXNlZDogJycsXG4gICAgY29uZmlybWF0aW9uczogJzAnLFxuICAgIGNvbnRyYWN0OiAnQm9uZGluZ01hbmFnZXInLFxuICAgIGdhczogZ2FzLFxuICAgIGdhc1VzZWQ6ICcnLFxuICAgIGdhc1ByaWNlOiAnJyxcbiAgICBpZDogdHhIYXNoLFxuICAgIG1ldGhvZDogJ2NsYWltRWFybmluZ3MnLFxuICAgIG5vbmNlOiAnJyxcbiAgICBwYXJhbXM6IHsgX2VuZFJvdW5kOiBlbmRSb3VuZCB9LFxuICAgIHN0YXR1czogJ3BlbmRpbmcnLFxuICAgIHRpbWVTdGFtcDogYCR7TWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCl9YCxcbiAgfVxuICBwdWJsaXNoKFRyYW5zYWN0aW9uU3VibWl0dGVkLCBtb2NrVHgpXG4gIGNvbnN0IHJlY2VpcHQgPSBhd2FpdCB1dGlscy5nZXRUeFJlY2VpcHQodHhIYXNoLCBldGgpXG4gIHB1Ymxpc2goVHJhbnNhY3Rpb25Db25maXJtZWQsIHtcbiAgICAuLi5tb2NrVHgsXG4gICAgYmxvY2tIYXNoOiByZWNlaXB0LmJsb2NrSGFzaCxcbiAgICBibG9ja051bWJlcjogcmVjZWlwdC5ibG9ja051bWJlci50b1N0cmluZygxMCksXG4gICAgY3VtdWxhdGl2ZUdhc1VzZWQ6IHJlY2VpcHQuY3VtdWxhdGl2ZUdhc1VzZWQudG9TdHJpbmcoMTApLFxuICAgIGdhc1VzZWQ6IHJlY2VpcHQuZ2FzVXNlZC50b1N0cmluZygxMCksXG4gICAgdG86IHJlY2VpcHQudG8sXG4gICAgdHJhbnNhY3Rpb25JbmRleDogcmVjZWlwdC50cmFuc2FjdGlvbkluZGV4LnRvU3RyaW5nKDEwKSxcbiAgICBzdGF0dXM6IHJlY2VpcHQuc3RhdHVzLnN1YnN0cigyKSxcbiAgICBjb25maXJtYXRpb25zOiAnMScsXG4gIH0pXG59XG5cbi8qKlxuICogU2VuZCBhIHRyYW5zYWN0aW9uIG9iamVjdFxuICogQHBhcmFtIHtNdXRhdGlvbk9ian0gb2JqXG4gKiBAcmV0dXJuIHtQcm9taXNlPFR4UmVjZWlwdD59XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kVHJhbnNhY3Rpb24oXG4gIG9iajogTXV0YXRpb25PYmosXG4gIGFyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFByb21pc2U8VHhSZWNlaXB0PiB7XG4gIGNvbnN0IHsgdXRpbHMsIGNvbmZpZyB9ID0gY3R4LmxpdmVwZWVyXG4gIGNvbnN0IHsgZXRoLCBkZWZhdWx0VHggfSA9IGNvbmZpZ1xuICByZXR1cm4gYXdhaXQgdXRpbHMuZ2V0VHhSZWNlaXB0KFxuICAgIGF3YWl0IGV0aC5zZW5kVHJhbnNhY3Rpb24oe1xuICAgICAgLi4uZGVmYXVsdFR4LFxuICAgICAgLi4uYXJncy5vcHRpb25zLFxuICAgIH0pLFxuICAgIGV0aCxcbiAgKVxufVxuXG4vKipcbiAqIFN1Ym1pdHMgYW4gdW5ib25kIHRyYW5zYWN0aW9uXG4gKiBAcGFyYW0ge011dGF0aW9uT2JqfSBvYmpcbiAqIEByZXR1cm4ge1Byb21pc2U8VHhSZWNlaXB0Pn1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVuYm9uZChcbiAgb2JqOiBNdXRhdGlvbk9iaixcbiAgYXJncyxcbiAgY3R4OiBHUUxDb250ZXh0LFxuKTogUHJvbWlzZTxUeFJlY2VpcHQ+IHtcbiAgY29uc3QgeyBhbW91bnQgfSA9IGFyZ3NcblxuICByZXR1cm4gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy51bmJvbmQoYW1vdW50LCB7XG4gICAgLi4uY3R4LmxpdmVwZWVyLmNvbmZpZy5kZWZhdWx0VHgsXG4gIH0pXG59XG5cbi8qKlxuICogU3VibWl0cyBhIHJlYm9uZCB0cmFuc2FjdGlvblxuICogQHBhcmFtIHtNdXRhdGlvbk9ian0gb2JqXG4gKiBAcmV0dXJuIHtQcm9taXNlPFR4UmVjZWlwdD59XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWJvbmQoXG4gIG9iajogTXV0YXRpb25PYmosXG4gIGFyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFByb21pc2U8VHhSZWNlaXB0PiB7XG4gIGNvbnN0IHsgdW5ib25kaW5nTG9ja0lkIH0gPSBhcmdzXG5cbiAgY29uc3QgZ2FzID0gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5lc3RpbWF0ZUdhcygnQm9uZGluZ01hbmFnZXInLCAncmVib25kJywgW1xuICAgIHVuYm9uZGluZ0xvY2tJZCxcbiAgXSlcblxuICByZXR1cm4gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5yZWJvbmQodW5ib25kaW5nTG9ja0lkLCB7XG4gICAgLi4uY3R4LmxpdmVwZWVyLmNvbmZpZy5kZWZhdWx0VHgsXG4gICAgZ2FzOiBnYXMsXG4gIH0pXG59XG5cbi8qKlxuICogU3VibWl0cyBhIHJlYm9uZEZyb21VbmJvbmRlZCB0cmFuc2FjdGlvblxuICogQHBhcmFtIHtNdXRhdGlvbk9ian0gb2JqXG4gKiBAcmV0dXJuIHtQcm9taXNlPFR4UmVjZWlwdD59XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWJvbmRGcm9tVW5ib25kZWQoXG4gIG9iajogTXV0YXRpb25PYmosXG4gIGFyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFByb21pc2U8VHhSZWNlaXB0PiB7XG4gIGNvbnN0IHsgZGVsZWdhdGUsIHVuYm9uZGluZ0xvY2tJZCB9ID0gYXJnc1xuXG4gIGNvbnN0IGdhcyA9IGF3YWl0IGN0eC5saXZlcGVlci5ycGMuZXN0aW1hdGVHYXMoXG4gICAgJ0JvbmRpbmdNYW5hZ2VyJyxcbiAgICAncmVib25kRnJvbVVuYm9uZGVkJyxcbiAgICBbZGVsZWdhdGUsIHVuYm9uZGluZ0xvY2tJZF0sXG4gIClcblxuICByZXR1cm4gYXdhaXQgY3R4LmxpdmVwZWVyLnJwYy5yZWJvbmRGcm9tVW5ib25kZWQoZGVsZWdhdGUsIHVuYm9uZGluZ0xvY2tJZCwge1xuICAgIGdhczogZ2FzLFxuICB9KVxufVxuXG4vKipcbiAqIFN1Ym1pdHMgYSByb3VuZCBpbml0aWFsaXphdGlvbiB0cmFuc2FjdGlvblxuICogQHBhcmFtIHtNdXRhdGlvbk9ian0gb2JqXG4gKiBAcmV0dXJuIHtQcm9taXNlPFR4UmVjZWlwdD59XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbml0aWFsaXplUm91bmQoXG4gIG9iajogTXV0YXRpb25PYmosXG4gIGFyZ3MsXG4gIGN0eDogR1FMQ29udGV4dCxcbik6IFByb21pc2U8VHhSZWNlaXB0PiB7XG4gIGNvbnN0IGdhcyA9IGF3YWl0IGN0eC5saXZlcGVlci5ycGMuZXN0aW1hdGVHYXMoXG4gICAgJ1JvdW5kc01hbmFnZXInLFxuICAgICdpbml0aWFsaXplUm91bmQnLFxuICAgIFtdLFxuICApXG4gIHJldHVybiBhd2FpdCBjdHgubGl2ZXBlZXIucnBjLmluaXRpYWxpemVSb3VuZCh7XG4gICAgZ2FzLFxuICB9KVxufVxuIl19
