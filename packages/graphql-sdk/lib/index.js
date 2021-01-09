'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
Object.defineProperty(exports, 'schema', {
  enumerable: true,
  get: function get() {
    return _schema.default
  },
})
exports.mockTranscoder = exports.mockProtocol = exports.mockRound = exports.mockDelegator = exports.mockBroadcaster = exports.mockBlock = exports.mockAccount = exports.introspectionQueryResultData = void 0

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty'),
)

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutProperties'),
)

var _graphql = require('graphql')

var _schema = _interopRequireDefault(require('./schema'))

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

var introspectionQueryResultData = {
  __schema: {
    types: [
      {
        kind: 'INTERFACE',
        name: 'Account',
        possibleTypes: [
          {
            name: 'AccountType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Broadcaster',
        possibleTypes: [
          {
            name: 'BroadcasterType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Delegator',
        possibleTypes: [
          {
            name: 'DelegatorType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Transcoder',
        possibleTypes: [
          {
            name: 'TranscoderType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Job',
        possibleTypes: [
          {
            name: 'JobType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Protocol',
        possibleTypes: [
          {
            name: 'ProtocolType',
          },
        ],
      },
    ],
  },
}
exports.introspectionQueryResultData = introspectionQueryResultData

var mockAccount = function mockAccount() {
  var _ref =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var _ref$id = _ref.id,
    id = _ref$id === void 0 ? '' : _ref$id,
    account = (0, _objectWithoutProperties2.default)(_ref, ['id'])
  return _objectSpread(
    _objectSpread(
      {
        id: id,
        ensName: '',
        ethBalance: '0',
        tokenBalance: '0',
      },
      account,
    ),
    {},
    {
      broadcaster: mockBroadcaster(
        _objectSpread(
          {
            id: id,
          },
          account.broadcaster,
        ),
      ),
      delegator: mockDelegator(
        _objectSpread(
          {
            id: id,
          },
          account.delegator,
        ),
      ),
      transcoder: mockTranscoder(
        _objectSpread(
          {
            id: id,
          },
          account.transcoder,
        ),
      ),
    },
  )
}

exports.mockAccount = mockAccount

var mockBlock = function mockBlock() {
  var _ref2 =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref2$id = _ref2.id,
    id = _ref2$id === void 0 ? '' : _ref2$id

  return {
    id: id,
  }
}

exports.mockBlock = mockBlock

var mockBroadcaster = function mockBroadcaster() {
  var _ref3 =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var _ref3$id = _ref3.id,
    id = _ref3$id === void 0 ? '' : _ref3$id,
    broadcaster = (0, _objectWithoutProperties2.default)(_ref3, ['id'])
  return _objectSpread(
    {
      deposit: '0',
      id: id,
      jobs: [],
      withdrawBlock: '0',
    },
    broadcaster,
  )
}

exports.mockBroadcaster = mockBroadcaster

var mockDelegator = function mockDelegator() {
  var _ref4 =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var _ref4$id = _ref4.id,
    id = _ref4$id === void 0 ? '' : _ref4$id,
    delegator = (0, _objectWithoutProperties2.default)(_ref4, ['id'])
  return _objectSpread(
    {
      allowance: '0',
      bondedAmount: '0',
      id: id,
      delegateAddress: '',
      delegatedAmount: '0',
      fees: '0',
      lastClaimRound: '0',
      pendingFees: '0',
      pendingStake: '0',
      startRound: '0',
      status: 'Unbonded',
      withdrawAmount: '0',
      withdrawRound: '0',
      nextUnbondingLockId: '0',
    },
    delegator,
  )
}

exports.mockDelegator = mockDelegator

var mockRound = function mockRound() {
  var _ref5 =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var _ref5$id = _ref5.id,
    id = _ref5$id === void 0 ? '' : _ref5$id,
    round = (0, _objectWithoutProperties2.default)(_ref5, ['id'])
  return _objectSpread(
    {
      id: id,
      initialized: false,
      lastInitializedRound: '0',
      length: '0',
      startBlock: '0',
    },
    round,
  )
}

exports.mockRound = mockRound

var mockProtocol = function mockProtocol() {
  var _ref6 =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var _ref6$id = _ref6.id,
    id = _ref6$id === void 0 ? '' : _ref6$id,
    protocol = (0, _objectWithoutProperties2.default)(_ref6, ['id'])
  return _objectSpread(
    {
      paused: false,
      totalTokenSupply: '0',
      totalBondedToken: '0',
      targetBondingRate: '0',
      transcoderPoolMaxSize: '0',
      maxEarningsClaimsRounds: '0',
    },
    protocol,
  )
}

exports.mockProtocol = mockProtocol

var mockTranscoder = function mockTranscoder() {
  var _ref7 =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var _ref7$id = _ref7.id,
    id = _ref7$id === void 0 ? '' : _ref7$id,
    transcoder = (0, _objectWithoutProperties2.default)(_ref7, ['id'])
  return _objectSpread(
    {
      active: false,
      feeShare: '0',
      id: id,
      lastRewardRound: '0',
      pricePerSegment: '0',
      pendingRewardCut: '0',
      pendingFeeShare: '0',
      pendingPricePerSegment: '0',
      rewardCut: '0',
      status: '',
      totalStake: '0',
    },
    transcoder,
  )
}

exports.mockTranscoder = mockTranscoder
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnRyb3NwZWN0aW9uUXVlcnlSZXN1bHREYXRhIiwiX19zY2hlbWEiLCJ0eXBlcyIsImtpbmQiLCJuYW1lIiwicG9zc2libGVUeXBlcyIsIm1vY2tBY2NvdW50IiwiaWQiLCJhY2NvdW50IiwiZW5zTmFtZSIsImV0aEJhbGFuY2UiLCJ0b2tlbkJhbGFuY2UiLCJicm9hZGNhc3RlciIsIm1vY2tCcm9hZGNhc3RlciIsImRlbGVnYXRvciIsIm1vY2tEZWxlZ2F0b3IiLCJ0cmFuc2NvZGVyIiwibW9ja1RyYW5zY29kZXIiLCJtb2NrQmxvY2siLCJkZXBvc2l0Iiwiam9icyIsIndpdGhkcmF3QmxvY2siLCJhbGxvd2FuY2UiLCJib25kZWRBbW91bnQiLCJkZWxlZ2F0ZUFkZHJlc3MiLCJkZWxlZ2F0ZWRBbW91bnQiLCJmZWVzIiwibGFzdENsYWltUm91bmQiLCJwZW5kaW5nRmVlcyIsInBlbmRpbmdTdGFrZSIsInN0YXJ0Um91bmQiLCJzdGF0dXMiLCJ3aXRoZHJhd0Ftb3VudCIsIndpdGhkcmF3Um91bmQiLCJuZXh0VW5ib25kaW5nTG9ja0lkIiwibW9ja1JvdW5kIiwicm91bmQiLCJpbml0aWFsaXplZCIsImxhc3RJbml0aWFsaXplZFJvdW5kIiwibGVuZ3RoIiwic3RhcnRCbG9jayIsIm1vY2tQcm90b2NvbCIsInByb3RvY29sIiwicGF1c2VkIiwidG90YWxUb2tlblN1cHBseSIsInRvdGFsQm9uZGVkVG9rZW4iLCJ0YXJnZXRCb25kaW5nUmF0ZSIsInRyYW5zY29kZXJQb29sTWF4U2l6ZSIsIm1heEVhcm5pbmdzQ2xhaW1zUm91bmRzIiwiYWN0aXZlIiwiZmVlU2hhcmUiLCJsYXN0UmV3YXJkUm91bmQiLCJwcmljZVBlclNlZ21lbnQiLCJwZW5kaW5nUmV3YXJkQ3V0IiwicGVuZGluZ0ZlZVNoYXJlIiwicGVuZGluZ1ByaWNlUGVyU2VnbWVudCIsInJld2FyZEN1dCIsInRvdGFsU3Rha2UiXSwibWFwcGlu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LEdBQUcsU0FBZkEsWUFBZTtBQUFBLGtGQUE0QixFQUE1Qjs7QUFBQSx1QkFBR2xDLEVBQUg7QUFBQSxNQUFHQSxFQUFILHlCQUFRLEVBQVI7QUFBQSxNQUFlbUMsUUFBZjtBQUFBO0FBQzFCQyxJQUFBQSxNQUFNLEVBQUUsS0FEa0I7QUFFMUJDLElBQUFBLGdCQUFnQixFQUFFLEdBRlE7QUFHMUJDLElBQUFBLGdCQUFnQixFQUFFLEdBSFE7QUFJMUJDLElBQUFBLGlCQUFpQixFQUFFLEdBSk87QUFLMUJDLElBQUFBLHFCQUFxQixFQUFFLEdBTEc7QUFNMUJDLElBQUFBLHVCQUF1QixFQUFFO0FBTkMsS0FPdkJOLFFBUHVCO0FBQUEsQ0FBckI7Ozs7QUFVQSxJQUFNekIsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQjtBQUFBLGtGQUE4QixFQUE5Qjs7QUFBQSx1QkFBR1YsRUFBSDtBQUFBLE1BQUdBLEVBQUgseUJBQVEsRUFBUjtBQUFBLE1BQWVTLFVBQWY7QUFBQTtBQUM1QmlDLElBQUFBLE1BQU0sRUFBRSxLQURvQjtBQUU1QkMsSUFBQUEsUUFBUSxFQUFFLEdBRmtCO0FBRzVCM0MsSUFBQUEsRUFBRSxFQUFGQSxFQUg0QjtBQUk1QjRDLElBQUFBLGVBQWUsRUFBRSxHQUpXO0FBSzVCQyxJQUFBQSxlQUFlLEVBQUUsR0FMVztBQU01QkMsSUFBQUEsZ0JBQWdCLEVBQUUsR0FOVTtBQU81QkMsSUFBQUEsZUFBZSxFQUFFLEdBUFc7QUFRNUJDLElBQUFBLHNCQUFzQixFQUFFLEdBUkk7QUFTNUJDLElBQUFBLFNBQVMsRUFBRSxHQVRpQjtBQVU1QnpCLElBQUFBLE1BQU0sRUFBRSxFQVZvQjtBQVc1QjBCLElBQUFBLFVBQVUsRUFBRTtBQVhnQixLQVl6QnpDLFVBWnlCO0FBQUEsQ0FBdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHcmFwaFFMU2NoZW1hIH0gZnJvbSAnZ3JhcGhxbCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgc2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnXG5leHBvcnQgY29uc3QgaW50cm9zcGVjdGlvblF1ZXJ5UmVzdWx0RGF0YSA9IHtcbiAgX19zY2hlbWE6IHtcbiAgICB0eXBlczogW1xuICAgICAge1xuICAgICAgICBraW5kOiAnSU5URVJGQUNFJyxcbiAgICAgICAgbmFtZTogJ0FjY291bnQnLFxuICAgICAgICBwb3NzaWJsZVR5cGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ0FjY291bnRUeXBlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2luZDogJ0lOVEVSRkFDRScsXG4gICAgICAgIG5hbWU6ICdCcm9hZGNhc3RlcicsXG4gICAgICAgIHBvc3NpYmxlVHlwZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnQnJvYWRjYXN0ZXJUeXBlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2luZDogJ0lOVEVSRkFDRScsXG4gICAgICAgIG5hbWU6ICdEZWxlZ2F0b3InLFxuICAgICAgICBwb3NzaWJsZVR5cGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ0RlbGVnYXRvclR5cGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBraW5kOiAnSU5URVJGQUNFJyxcbiAgICAgICAgbmFtZTogJ1RyYW5zY29kZXInLFxuICAgICAgICBwb3NzaWJsZVR5cGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1RyYW5zY29kZXJUeXBlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAga2luZDogJ0lOVEVSRkFDRScsXG4gICAgICAgIG5hbWU6ICdKb2InLFxuICAgICAgICBwb3NzaWJsZVR5cGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ0pvYlR5cGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBraW5kOiAnSU5URVJGQUNFJyxcbiAgICAgICAgbmFtZTogJ1Byb3RvY29sJyxcbiAgICAgICAgcG9zc2libGVUeXBlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdQcm90b2NvbFR5cGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBtb2NrQWNjb3VudCA9ICh7IGlkID0gJycsIC4uLmFjY291bnQgfSA9IHt9KSA9PiAoe1xuICBpZCxcbiAgZW5zTmFtZTogJycsXG4gIGV0aEJhbGFuY2U6ICcwJyxcbiAgdG9rZW5CYWxhbmNlOiAnMCcsXG4gIC4uLmFjY291bnQsXG4gIGJyb2FkY2FzdGVyOiBtb2NrQnJvYWRjYXN0ZXIoe1xuICAgIGlkLFxuICAgIC4uLmFjY291bnQuYnJvYWRjYXN0ZXIsXG4gIH0pLFxuICBkZWxlZ2F0b3I6IG1vY2tEZWxlZ2F0b3Ioe1xuICAgIGlkLFxuICAgIC4uLmFjY291bnQuZGVsZWdhdG9yLFxuICB9KSxcbiAgdHJhbnNjb2RlcjogbW9ja1RyYW5zY29kZXIoe1xuICAgIGlkLFxuICAgIC4uLmFjY291bnQudHJhbnNjb2RlcixcbiAgfSksXG59KVxuXG5leHBvcnQgY29uc3QgbW9ja0Jsb2NrID0gKHsgaWQgPSAnJyB9ID0ge30pID0+ICh7XG4gIGlkLFxufSlcblxuZXhwb3J0IGNvbnN0IG1vY2tCcm9hZGNhc3RlciA9ICh7IGlkID0gJycsIC4uLmJyb2FkY2FzdGVyIH0gPSB7fSkgPT4gKHtcbiAgZGVwb3NpdDogJzAnLFxuICBpZCxcbiAgam9iczogW10sXG4gIHdpdGhkcmF3QmxvY2s6ICcwJyxcbiAgLi4uYnJvYWRjYXN0ZXIsXG59KVxuXG5leHBvcnQgY29uc3QgbW9ja0RlbGVnYXRvciA9ICh7IGlkID0gJycsIC4uLmRlbGVnYXRvciB9ID0ge30pID0+ICh7XG4gIGFsbG93YW5jZTogJzAnLFxuICBib25kZWRBbW91bnQ6ICcwJyxcbiAgaWQsXG4gIGRlbGVnYXRlQWRkcmVzczogJycsXG4gIGRlbGVnYXRlZEFtb3VudDogJzAnLFxuICBmZWVzOiAnMCcsXG4gIGxhc3RDbGFpbVJvdW5kOiAnMCcsXG4gIHBlbmRpbmdGZWVzOiAnMCcsXG4gIHBlbmRpbmdTdGFrZTogJzAnLFxuICBzdGFydFJvdW5kOiAnMCcsXG4gIHN0YXR1czogJ1VuYm9uZGVkJyxcbiAgd2l0aGRyYXdBbW91bnQ6ICcwJyxcbiAgd2l0aGRyYXdSb3VuZDogJzAnLFxuICBuZXh0VW5ib25kaW5nTG9ja0lkOiAnMCcsXG4gIC4uLmRlbGVnYXRvcixcbn0pXG5cbmV4cG9ydCBjb25zdCBtb2NrUm91bmQgPSAoeyBpZCA9ICcnLCAuLi5yb3VuZCB9ID0ge30pID0+ICh7XG4gIGlkLFxuICBpbml0aWFsaXplZDogZmFsc2UsXG4gIGxhc3RJbml0aWFsaXplZFJvdW5kOiAnMCcsXG4gIGxlbmd0aDogJzAnLFxuICBzdGFydEJsb2NrOiAnMCcsXG4gIC4uLnJvdW5kLFxufSlcblxuZXhwb3J0IGNvbnN0IG1vY2tQcm90b2NvbCA9ICh7IGlkID0gJycsIC4uLnByb3RvY29sIH0gPSB7fSkgPT4gKHtcbiAgcGF1c2VkOiBmYWxzZSxcbiAgdG90YWxUb2tlblN1cHBseTogJzAnLFxuICB0b3RhbEJvbmRlZFRva2VuOiAnMCcsXG4gIHRhcmdldEJvbmRpbmdSYXRlOiAnMCcsXG4gIHRyYW5zY29kZXJQb29sTWF4U2l6ZTogJzAnLFxuICBtYXhFYXJuaW5nc0NsYWltc1JvdW5kczogJzAnLFxuICAuLi5wcm90b2NvbCxcbn0pXG5cbmV4cG9ydCBjb25zdCBtb2NrVHJhbnNjb2RlciA9ICh7IGlkID0gJycsIC4uLnRyYW5zY29kZXIgfSA9IHt9KSA9PiAoe1xuICBhY3RpdmU6IGZhbHNlLFxuICBmZWVTaGFyZTogJzAnLFxuICBpZCxcbiAgbGFzdFJld2FyZFJvdW5kOiAnMCcsXG4gIHByaWNlUGVyU2VnbWVudDogJzAnLFxuICBwZW5kaW5nUmV3YXJkQ3V0OiAnMCcsXG4gIHBlbmRpbmdGZWVTaGFyZTogJzAnLFxuICBwZW5kaW5nUHJpY2VQZXJTZWdtZW50OiAnMCcsXG4gIHJld2FyZEN1dDogJzAnLFxuICBzdGF0dXM6ICcnLFxuICB0b3RhbFN0YWtlOiAnMCcsXG4gIC4uLnRyYW5zY29kZXIsXG59KVxuIl19
