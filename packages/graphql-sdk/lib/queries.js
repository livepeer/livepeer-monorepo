'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.ProtocolQuery = exports.TranscodersQuery = exports.TranscoderQuery = exports.TransactionsQuery = exports.MeQuery = exports.JobsQuery = exports.JobQuery = exports.DelegatorQuery = exports.CurrentRoundQuery = exports.CurrentBlockQuery = exports.CoinbaseQuery = exports.BroadcasterQuery = exports.AccountBroadcasterQuery = exports.AccountQuery = void 0

var _Account = _interopRequireDefault(require('./fragments/Account'))

var _Block = _interopRequireDefault(require('./fragments/Block'))

var _Broadcaster = _interopRequireDefault(require('./fragments/Broadcaster'))

var _Delegator = _interopRequireDefault(require('./fragments/Delegator'))

var _Job = _interopRequireDefault(require('./fragments/Job'))

var _Round = _interopRequireDefault(require('./fragments/Round'))

var _Transaction = _interopRequireDefault(require('./fragments/Transaction'))

var _Transcoder = _interopRequireDefault(require('./fragments/Transcoder'))

var _Protocol = _interopRequireDefault(require('./fragments/Protocol'))

var _UnbondLock = _interopRequireDefault(require('./fragments/UnbondLock'))

var AccountQuery = '\n'
  .concat(_Account.default, '\n')
  .concat(_Broadcaster.default, '\n')
  .concat(_Delegator.default, '\n')
  .concat(_Transcoder.default, '\n')
  .concat(
    _UnbondLock.default,
    '\nquery AccountQuery($id: String, $lockId: String!) {\n  account(id: $id) {\n    ...AccountFragment\n  }\n}\n',
  )
exports.AccountQuery = AccountQuery
var AccountBroadcasterQuery = '\n'
  .concat(_Job.default, '\n')
  .concat(
    _Broadcaster.default,
    '\nquery AccountBroadcasterQuery($id: String, $jobs: Boolean!, $jobsSkip: Int, $jobsLimit: Int) {\n  account(id: $id) {\n    id\n    ensName\n    broadcaster {\n      ...BroadcasterFragment\n      jobs(skip: $jobsSkip, limit: $jobsLimit) @include(if: $jobs) {\n        ...JobFragment\n      }\n    }\n  }\n}\n',
  )
exports.AccountBroadcasterQuery = AccountBroadcasterQuery
var BroadcasterQuery = '\n'
  .concat(_Broadcaster.default, '\n')
  .concat(
    _Job.default,
    '\nquery BroadcasterQuery($id: String!, $jobs: Boolean!, $jobsSkip: Int, $jobsLimit: Int) {\n  broadcaster(id: $id) {\n    ...BroadcasterFragment\n    jobs(skip: $jobsSkip, limit: $jobsLimit) @include(if: $jobs) {\n      ...JobFragment\n    }\n  }\n}\n',
  )
exports.BroadcasterQuery = BroadcasterQuery
var CoinbaseQuery = '\nquery CoinbaseQuery {\n  coinbase\n}\n'
exports.CoinbaseQuery = CoinbaseQuery
var CurrentBlockQuery = '\n'.concat(
  _Block.default,
  '\nquery CurrentBlockQuery {\n  currentBlock {\n    ...BlockFragment\n  }\n}\n',
)
exports.CurrentBlockQuery = CurrentBlockQuery
var CurrentRoundQuery = '\n'.concat(
  _Round.default,
  '\nquery CurrentRoundQuery {\n  currentRound {\n    ...RoundFragment\n  }\n}\n',
)
exports.CurrentRoundQuery = CurrentRoundQuery
var DelegatorQuery = '\n'.concat(
  _Delegator.default,
  '\nquery DelegatorQuery($id: String!) {\n  delegator(id: $id) {\n    ...DelegatorFragment\n  }\n}\n',
)
exports.DelegatorQuery = DelegatorQuery
var JobQuery = '\n'.concat(
  _Job.default,
  '\nquery JobQuery($id: String!) {\n  job(id: $id) {\n    ...JobFragment\n  }\n}\n',
)
exports.JobQuery = JobQuery
var JobsQuery = '\n'.concat(
  _Job.default,
  '\nquery JobsQuery($broadcaster: String, $skip: Int, $limit: Int) {\n  jobs(broadcaster: $broadcaster, skip: $skip, limit: $limit) {\n    ...JobFragment\n  }\n}\n',
)
exports.JobsQuery = JobsQuery
var MeQuery = '\n'
  .concat(_Account.default, '\n')
  .concat(_Broadcaster.default, '\n')
  .concat(_Delegator.default, '\n')
  .concat(
    _Transcoder.default,
    '\nquery MeQuery {\n  me {\n    ...AccountFragment\n  }\n}\n',
  )
exports.MeQuery = MeQuery
var TransactionsQuery = '\n'.concat(
  _Transaction.default,
  '\nquery TransactionQuery(\n  $address: String!,\n  $startBlock: String,\n  $endBlock: String,\n  $skip: String,\n  $limit: String,\n  $sort: String\n) {\n  transactions(\n    address: $address,\n    startBlock: $startBlock,\n    endBlock: $endBlock,\n    skip: $skip,\n    limit: $limit,\n    sort: $sort,\n  ) {\n    ...TransactionFragment\n  }\n}\n',
)
exports.TransactionsQuery = TransactionsQuery
var TranscoderQuery = '\n'.concat(
  _Transcoder.default,
  '\nquery TranscoderQuery($id: String!) {\n  transcoder(id: $id) {\n    ...TranscoderFragment\n  }\n}\n',
)
exports.TranscoderQuery = TranscoderQuery
var TranscodersQuery = '\n'.concat(
  _Transcoder.default,
  '\nquery TranscodersQuery($skip: Int, $first: Int) {\n  transcoders(skip: $skip, first: $first) {\n    ...TranscoderFragment\n  }\n}\n',
)
exports.TranscodersQuery = TranscodersQuery
var ProtocolQuery = '\n'.concat(
  _Protocol.default,
  '\nquery ProtocolQuery {\n  protocol {\n    ...ProtocolFragment\n  }\n}',
)
exports.ProtocolQuery = ProtocolQuery
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyaWVzLmpzIl0sIm5hbWVzIjpbIkFjY291bnRRdWVyeSIsIkFjY291bnRGcmFnbWVudCIsIkJyb2FkY2FzdGVyRnJhZ21lbnQiLCJEZWxlZ2F0b3JGcmFnbWVudCIsIlRyYW5zY29kZXJGcmFnbWVudCIsIlVuYm9uZExvY2tzRnJhZ21lbnQiLCJBY2NvdW50QnJvYWRjYXN0ZXJRdWVyeSIsIkpvYkZyYWdtZW50IiwiQnJvYWRjYXN0ZXJRdWVyeSIsIkNvaW5iYXNlUXVlcnkiLCJDdXJyZW50QmxvY2tRdWVyeSIsIkJsb2NrRnJhZ21lbnQiLCJDdXJyZW50Um91bmRRdWVyeSIsIlJvdW5kRnJhZ21lbnQiLCJEZWxlZ2F0b3JRdWVyeSIsIkpvYlF1ZXJ5IiwiSm9ic1F1ZXJ5IiwiTWVRdWVyeSIsIlRyYW5zYWN0aW9uc1F1ZXJ5IiwiVHJhbnNhY3Rpb25GcmFnbWVudCIsIlRyYW5zY29kZXJRdWVyeSIsIlRyYW5zY29kZXJzUXVlcnkiLCJQcm90b2NvbFF1ZXJ5IiwiUHJvdG9jb2xGcmFnbWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRU8sSUFBTUEsWUFBWSxlQUN2QkMsZ0JBRHVCLGVBRXZCQyxvQkFGdUIsZUFHdkJDLGtCQUh1QixlQUl2QkMsbUJBSnVCLGVBS3ZCQyxtQkFMdUIsa0hBQWxCOztBQWFBLElBQU1DLHVCQUF1QixlQUNsQ0MsWUFEa0MsZUFFbENMLG9CQUZrQyx5VEFBN0I7O0FBaUJBLElBQU1NLGdCQUFnQixlQUMzQk4sb0JBRDJCLGVBRTNCSyxZQUYyQixnUUFBdEI7O0FBYUEsSUFBTUUsYUFBYSw2Q0FBbkI7O0FBTUEsSUFBTUMsaUJBQWlCLGVBQzVCQyxjQUQ0QixrRkFBdkI7O0FBU0EsSUFBTUMsaUJBQWlCLGVBQzVCQyxjQUQ0QixrRkFBdkI7O0FBU0EsSUFBTUMsY0FBYyxlQUN6Qlgsa0JBRHlCLHVHQUFwQjs7QUFTQSxJQUFNWSxRQUFRLGVBQ25CUixZQURtQixxRkFBZDs7QUFTQSxJQUFNUyxTQUFTLGVBQ3BCVCxZQURvQixzS0FBZjs7QUFTQSxJQUFNVSxPQUFPLGVBQ2xCaEIsZ0JBRGtCLGVBRWxCQyxvQkFGa0IsZUFHbEJDLGtCQUhrQixlQUlsQkMsbUJBSmtCLGdFQUFiOztBQVlBLElBQU1jLGlCQUFpQixlQUM1QkMsb0JBRDRCLG1XQUF2Qjs7QUF1QkEsSUFBTUMsZUFBZSxlQUMxQmhCLG1CQUQwQiwwR0FBckI7O0FBU0EsSUFBTWlCLGdCQUFnQixlQUMzQmpCLG1CQUQyQiwwSUFBdEI7O0FBU0EsSUFBTWtCLGFBQWEsZUFDeEJDLGlCQUR3QiwyRUFBbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZhdWx0IGFzIEFjY291bnRGcmFnbWVudCB9IGZyb20gJy4vZnJhZ21lbnRzL0FjY291bnQnXG5pbXBvcnQgeyBkZWZhdWx0IGFzIEJsb2NrRnJhZ21lbnQgfSBmcm9tICcuL2ZyYWdtZW50cy9CbG9jaydcbmltcG9ydCB7IGRlZmF1bHQgYXMgQnJvYWRjYXN0ZXJGcmFnbWVudCB9IGZyb20gJy4vZnJhZ21lbnRzL0Jyb2FkY2FzdGVyJ1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBEZWxlZ2F0b3JGcmFnbWVudCB9IGZyb20gJy4vZnJhZ21lbnRzL0RlbGVnYXRvcidcbmltcG9ydCB7IGRlZmF1bHQgYXMgSm9iRnJhZ21lbnQgfSBmcm9tICcuL2ZyYWdtZW50cy9Kb2InXG5pbXBvcnQgeyBkZWZhdWx0IGFzIFJvdW5kRnJhZ21lbnQgfSBmcm9tICcuL2ZyYWdtZW50cy9Sb3VuZCdcbmltcG9ydCB7IGRlZmF1bHQgYXMgVHJhbnNhY3Rpb25GcmFnbWVudCB9IGZyb20gJy4vZnJhZ21lbnRzL1RyYW5zYWN0aW9uJ1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBUcmFuc2NvZGVyRnJhZ21lbnQgfSBmcm9tICcuL2ZyYWdtZW50cy9UcmFuc2NvZGVyJ1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBQcm90b2NvbEZyYWdtZW50IH0gZnJvbSAnLi9mcmFnbWVudHMvUHJvdG9jb2wnXG5pbXBvcnQgeyBkZWZhdWx0IGFzIFVuYm9uZExvY2tzRnJhZ21lbnQgfSBmcm9tICcuL2ZyYWdtZW50cy9VbmJvbmRMb2NrJ1xuXG5leHBvcnQgY29uc3QgQWNjb3VudFF1ZXJ5ID0gYFxuJHtBY2NvdW50RnJhZ21lbnR9XG4ke0Jyb2FkY2FzdGVyRnJhZ21lbnR9XG4ke0RlbGVnYXRvckZyYWdtZW50fVxuJHtUcmFuc2NvZGVyRnJhZ21lbnR9XG4ke1VuYm9uZExvY2tzRnJhZ21lbnR9XG5xdWVyeSBBY2NvdW50UXVlcnkoJGlkOiBTdHJpbmcsICRsb2NrSWQ6IFN0cmluZyEpIHtcbiAgYWNjb3VudChpZDogJGlkKSB7XG4gICAgLi4uQWNjb3VudEZyYWdtZW50XG4gIH1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IEFjY291bnRCcm9hZGNhc3RlclF1ZXJ5ID0gYFxuJHtKb2JGcmFnbWVudH1cbiR7QnJvYWRjYXN0ZXJGcmFnbWVudH1cbnF1ZXJ5IEFjY291bnRCcm9hZGNhc3RlclF1ZXJ5KCRpZDogU3RyaW5nLCAkam9iczogQm9vbGVhbiEsICRqb2JzU2tpcDogSW50LCAkam9ic0xpbWl0OiBJbnQpIHtcbiAgYWNjb3VudChpZDogJGlkKSB7XG4gICAgaWRcbiAgICBlbnNOYW1lXG4gICAgYnJvYWRjYXN0ZXIge1xuICAgICAgLi4uQnJvYWRjYXN0ZXJGcmFnbWVudFxuICAgICAgam9icyhza2lwOiAkam9ic1NraXAsIGxpbWl0OiAkam9ic0xpbWl0KSBAaW5jbHVkZShpZjogJGpvYnMpIHtcbiAgICAgICAgLi4uSm9iRnJhZ21lbnRcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IEJyb2FkY2FzdGVyUXVlcnkgPSBgXG4ke0Jyb2FkY2FzdGVyRnJhZ21lbnR9XG4ke0pvYkZyYWdtZW50fVxucXVlcnkgQnJvYWRjYXN0ZXJRdWVyeSgkaWQ6IFN0cmluZyEsICRqb2JzOiBCb29sZWFuISwgJGpvYnNTa2lwOiBJbnQsICRqb2JzTGltaXQ6IEludCkge1xuICBicm9hZGNhc3RlcihpZDogJGlkKSB7XG4gICAgLi4uQnJvYWRjYXN0ZXJGcmFnbWVudFxuICAgIGpvYnMoc2tpcDogJGpvYnNTa2lwLCBsaW1pdDogJGpvYnNMaW1pdCkgQGluY2x1ZGUoaWY6ICRqb2JzKSB7XG4gICAgICAuLi5Kb2JGcmFnbWVudFxuICAgIH1cbiAgfVxufVxuYFxuXG5leHBvcnQgY29uc3QgQ29pbmJhc2VRdWVyeSA9IGBcbnF1ZXJ5IENvaW5iYXNlUXVlcnkge1xuICBjb2luYmFzZVxufVxuYFxuXG5leHBvcnQgY29uc3QgQ3VycmVudEJsb2NrUXVlcnkgPSBgXG4ke0Jsb2NrRnJhZ21lbnR9XG5xdWVyeSBDdXJyZW50QmxvY2tRdWVyeSB7XG4gIGN1cnJlbnRCbG9jayB7XG4gICAgLi4uQmxvY2tGcmFnbWVudFxuICB9XG59XG5gXG5cbmV4cG9ydCBjb25zdCBDdXJyZW50Um91bmRRdWVyeSA9IGBcbiR7Um91bmRGcmFnbWVudH1cbnF1ZXJ5IEN1cnJlbnRSb3VuZFF1ZXJ5IHtcbiAgY3VycmVudFJvdW5kIHtcbiAgICAuLi5Sb3VuZEZyYWdtZW50XG4gIH1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IERlbGVnYXRvclF1ZXJ5ID0gYFxuJHtEZWxlZ2F0b3JGcmFnbWVudH1cbnF1ZXJ5IERlbGVnYXRvclF1ZXJ5KCRpZDogU3RyaW5nISkge1xuICBkZWxlZ2F0b3IoaWQ6ICRpZCkge1xuICAgIC4uLkRlbGVnYXRvckZyYWdtZW50XG4gIH1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IEpvYlF1ZXJ5ID0gYFxuJHtKb2JGcmFnbWVudH1cbnF1ZXJ5IEpvYlF1ZXJ5KCRpZDogU3RyaW5nISkge1xuICBqb2IoaWQ6ICRpZCkge1xuICAgIC4uLkpvYkZyYWdtZW50XG4gIH1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IEpvYnNRdWVyeSA9IGBcbiR7Sm9iRnJhZ21lbnR9XG5xdWVyeSBKb2JzUXVlcnkoJGJyb2FkY2FzdGVyOiBTdHJpbmcsICRza2lwOiBJbnQsICRsaW1pdDogSW50KSB7XG4gIGpvYnMoYnJvYWRjYXN0ZXI6ICRicm9hZGNhc3Rlciwgc2tpcDogJHNraXAsIGxpbWl0OiAkbGltaXQpIHtcbiAgICAuLi5Kb2JGcmFnbWVudFxuICB9XG59XG5gXG5cbmV4cG9ydCBjb25zdCBNZVF1ZXJ5ID0gYFxuJHtBY2NvdW50RnJhZ21lbnR9XG4ke0Jyb2FkY2FzdGVyRnJhZ21lbnR9XG4ke0RlbGVnYXRvckZyYWdtZW50fVxuJHtUcmFuc2NvZGVyRnJhZ21lbnR9XG5xdWVyeSBNZVF1ZXJ5IHtcbiAgbWUge1xuICAgIC4uLkFjY291bnRGcmFnbWVudFxuICB9XG59XG5gXG5cbmV4cG9ydCBjb25zdCBUcmFuc2FjdGlvbnNRdWVyeSA9IGBcbiR7VHJhbnNhY3Rpb25GcmFnbWVudH1cbnF1ZXJ5IFRyYW5zYWN0aW9uUXVlcnkoXG4gICRhZGRyZXNzOiBTdHJpbmchLFxuICAkc3RhcnRCbG9jazogU3RyaW5nLFxuICAkZW5kQmxvY2s6IFN0cmluZyxcbiAgJHNraXA6IFN0cmluZyxcbiAgJGxpbWl0OiBTdHJpbmcsXG4gICRzb3J0OiBTdHJpbmdcbikge1xuICB0cmFuc2FjdGlvbnMoXG4gICAgYWRkcmVzczogJGFkZHJlc3MsXG4gICAgc3RhcnRCbG9jazogJHN0YXJ0QmxvY2ssXG4gICAgZW5kQmxvY2s6ICRlbmRCbG9jayxcbiAgICBza2lwOiAkc2tpcCxcbiAgICBsaW1pdDogJGxpbWl0LFxuICAgIHNvcnQ6ICRzb3J0LFxuICApIHtcbiAgICAuLi5UcmFuc2FjdGlvbkZyYWdtZW50XG4gIH1cbn1cbmBcblxuZXhwb3J0IGNvbnN0IFRyYW5zY29kZXJRdWVyeSA9IGBcbiR7VHJhbnNjb2RlckZyYWdtZW50fVxucXVlcnkgVHJhbnNjb2RlclF1ZXJ5KCRpZDogU3RyaW5nISkge1xuICB0cmFuc2NvZGVyKGlkOiAkaWQpIHtcbiAgICAuLi5UcmFuc2NvZGVyRnJhZ21lbnRcbiAgfVxufVxuYFxuXG5leHBvcnQgY29uc3QgVHJhbnNjb2RlcnNRdWVyeSA9IGBcbiR7VHJhbnNjb2RlckZyYWdtZW50fVxucXVlcnkgVHJhbnNjb2RlcnNRdWVyeSgkc2tpcDogSW50LCAkZmlyc3Q6IEludCkge1xuICB0cmFuc2NvZGVycyhza2lwOiAkc2tpcCwgZmlyc3Q6ICRmaXJzdCkge1xuICAgIC4uLlRyYW5zY29kZXJGcmFnbWVudFxuICB9XG59XG5gXG5cbmV4cG9ydCBjb25zdCBQcm90b2NvbFF1ZXJ5ID0gYFxuJHtQcm90b2NvbEZyYWdtZW50fVxucXVlcnkgUHJvdG9jb2xRdWVyeSB7XG4gIHByb3RvY29sIHtcbiAgICAuLi5Qcm90b2NvbEZyYWdtZW50XG4gIH1cbn1gXG4iXX0=
