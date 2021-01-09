'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _Broadcaster = _interopRequireDefault(require('./Broadcaster'))

var _Delegator = _interopRequireDefault(require('./Delegator'))

var _Transcoder = _interopRequireDefault(require('./Transcoder'))

var _UnbondLock = _interopRequireDefault(require('./UnbondLock'))

var Account =
  '\n"A type that describes a Livepeer account"\ntype Account {\n\n  "The ETH address for an account"\n  id: String!\n\n  "The ENS name for an account"\n  ensName: String!\n\n  "The ETH balance for an account"\n  ethBalance: String!\n\n  "The Livepeer Token (LPTU) balance for an account"\n  tokenBalance: String!\n\n  "The broadcaster info for an account"\n  broadcaster: Broadcaster!\n\n  "The delegator info for an account"\n  delegator: Delegator!\n\n  "The transcoder info for an account"\n  transcoder: Transcoder!\n\n  "The unbonding locks for an account "\n  unbondlocks: [UnbondLock]!\n\n  "An unbond lock for an account"\n  unbondlock(lockId: String!): UnbondLock!\n}'

var _default = function _default() {
  return [
    Account,
    _Broadcaster.default,
    _Delegator.default,
    _Transcoder.default,
    _UnbondLock.default,
  ]
}

exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9BY2NvdW50LmpzIl0sIm5hbWVzIjpbIkFjY291bnQiLCJCcm9hZGNhc3RlciIsIkRlbGVnYXRvciIsIlRyYW5zY29kZXIiLCJVbmJvbmRMb2NrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNQSxPQUFPLDJyQkFBYjs7ZUFnQ2U7QUFBQSxTQUFNLENBQUNBLE9BQUQsRUFBVUMsb0JBQVYsRUFBdUJDLGtCQUF2QixFQUFrQ0MsbUJBQWxDLEVBQThDQyxtQkFBOUMsQ0FBTjtBQUFBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnJvYWRjYXN0ZXIgZnJvbSAnLi9Ccm9hZGNhc3RlcidcbmltcG9ydCBEZWxlZ2F0b3IgZnJvbSAnLi9EZWxlZ2F0b3InXG5pbXBvcnQgVHJhbnNjb2RlciBmcm9tICcuL1RyYW5zY29kZXInXG5pbXBvcnQgVW5ib25kTG9jayBmcm9tICcuL1VuYm9uZExvY2snXG5cbmNvbnN0IEFjY291bnQgPSBgXG5cIkEgdHlwZSB0aGF0IGRlc2NyaWJlcyBhIExpdmVwZWVyIGFjY291bnRcIlxudHlwZSBBY2NvdW50IHtcblxuICBcIlRoZSBFVEggYWRkcmVzcyBmb3IgYW4gYWNjb3VudFwiXG4gIGlkOiBTdHJpbmchXG5cbiAgXCJUaGUgRU5TIG5hbWUgZm9yIGFuIGFjY291bnRcIlxuICBlbnNOYW1lOiBTdHJpbmchXG5cbiAgXCJUaGUgRVRIIGJhbGFuY2UgZm9yIGFuIGFjY291bnRcIlxuICBldGhCYWxhbmNlOiBTdHJpbmchXG5cbiAgXCJUaGUgTGl2ZXBlZXIgVG9rZW4gKExQVFUpIGJhbGFuY2UgZm9yIGFuIGFjY291bnRcIlxuICB0b2tlbkJhbGFuY2U6IFN0cmluZyFcblxuICBcIlRoZSBicm9hZGNhc3RlciBpbmZvIGZvciBhbiBhY2NvdW50XCJcbiAgYnJvYWRjYXN0ZXI6IEJyb2FkY2FzdGVyIVxuXG4gIFwiVGhlIGRlbGVnYXRvciBpbmZvIGZvciBhbiBhY2NvdW50XCJcbiAgZGVsZWdhdG9yOiBEZWxlZ2F0b3IhXG5cbiAgXCJUaGUgdHJhbnNjb2RlciBpbmZvIGZvciBhbiBhY2NvdW50XCJcbiAgdHJhbnNjb2RlcjogVHJhbnNjb2RlciFcblxuICBcIlRoZSB1bmJvbmRpbmcgbG9ja3MgZm9yIGFuIGFjY291bnQgXCJcbiAgdW5ib25kbG9ja3M6IFtVbmJvbmRMb2NrXSFcblxuICBcIkFuIHVuYm9uZCBsb2NrIGZvciBhbiBhY2NvdW50XCJcbiAgdW5ib25kbG9jayhsb2NrSWQ6IFN0cmluZyEpOiBVbmJvbmRMb2NrIVxufWBcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4gW0FjY291bnQsIEJyb2FkY2FzdGVyLCBEZWxlZ2F0b3IsIFRyYW5zY29kZXIsIFVuYm9uZExvY2tdXG4iXX0=
