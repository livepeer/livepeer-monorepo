'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _Account = _interopRequireDefault(require('./Account'))

var _Block = _interopRequireDefault(require('./Block'))

var _Broadcaster = _interopRequireDefault(require('./Broadcaster'))

var _Delegator = _interopRequireDefault(require('./Delegator'))

var _Job = _interopRequireDefault(require('./Job'))

var _Round = _interopRequireDefault(require('./Round'))

var _Transaction = _interopRequireDefault(require('./Transaction'))

var _Transcoder = _interopRequireDefault(require('./Transcoder'))

var _Protocol = _interopRequireDefault(require('./Protocol'))

var Query =
  '\n\n"Contains all protocol data-fetching queries"\ntype Query {\n\n  "An Account by ETH address or ENS name"\n  account(id: String): Account!\n  \n  "A Broadcaster by ETH address"\n  broadcaster(id: String!): Broadcaster!\n  \n  "The currently authenticated user\'s ETH address"\n  coinbase: String!\n\n  "The current Ethereum block"\n  currentBlock: Block!\n\n  "The current round in the Livepeer protocol"\n  currentRound: Round!\n\n  "A Delegator by ETH address"\n  delegator(id: String!): Delegator!\n\n  "A Job by id"\n  job(id: String!): Job!\n\n  "A list of Jobs"\n  jobs(broadcaster: String, skip: Int, limit: Int): [Job!]!\n\n  "The currently selected account (usually set by something like MetaMask)"\n  me: Account!\n\n  "All transactions to or from an account between the given start block and end block"\n  transactions(\n    address: String!,\n    startBlock: String,\n    endBlock: String,\n    skip: String,\n    limit: String,\n    sort: String\n  ): [Transaction!]!\n\n  "A Transcoder by ETH address"\n  transcoder(id: String!): Transcoder!\n\n  "A list of Transcoders"\n  transcoders(skip: Int, first: Int): [Transcoder!]!\n\n  "The protocol as a whole"\n  protocol: Protocol\n\n  "The unbonding locks for an account "\n  unbondlocks(id: String!): [UnbondLock]!\n\n  "An unbond lock for an account"\n  unbondlock(id: String!, lockId: String!): UnbondLock!\n}'

var _default = function _default() {
  return [
    Query,
    _Account.default,
    _Block.default,
    _Broadcaster.default,
    _Delegator.default,
    _Job.default,
    _Round.default,
    _Transaction.default,
    _Transcoder.default,
    _Protocol.default,
  ]
}

exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9RdWVyeS5qcyJdLCJuYW1lcyI6WyJRdWVyeSIsIkFjY291bnQiLCJCbG9jayIsIkJyb2FkY2FzdGVyIiwiRGVsZWdhdG9yIiwiSm9iIiwiUm91bmQiLCJUcmFuc2FjdGlvbiIsIlRyYW5zY29kZXIiLCJQcm90b2NvbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsSUFBTUEsS0FBSyxxNENBQVg7O2VBMERlO0FBQUEsU0FBTSxDQUNuQkEsS0FEbUIsRUFFbkJDLGdCQUZtQixFQUduQkMsY0FIbUIsRUFJbkJDLG9CQUptQixFQUtuQkMsa0JBTG1CLEVBTW5CQyxZQU5tQixFQU9uQkMsY0FQbUIsRUFRbkJDLG9CQVJtQixFQVNuQkMsbUJBVG1CLEVBVW5CQyxpQkFWbUIsQ0FBTjtBQUFBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWNjb3VudCBmcm9tICcuL0FjY291bnQnXG5pbXBvcnQgQmxvY2sgZnJvbSAnLi9CbG9jaydcbmltcG9ydCBCcm9hZGNhc3RlciBmcm9tICcuL0Jyb2FkY2FzdGVyJ1xuaW1wb3J0IERlbGVnYXRvciBmcm9tICcuL0RlbGVnYXRvcidcbmltcG9ydCBKb2IgZnJvbSAnLi9Kb2InXG5pbXBvcnQgUm91bmQgZnJvbSAnLi9Sb3VuZCdcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL1RyYW5zYWN0aW9uJ1xuaW1wb3J0IFRyYW5zY29kZXIgZnJvbSAnLi9UcmFuc2NvZGVyJ1xuaW1wb3J0IFByb3RvY29sIGZyb20gJy4vUHJvdG9jb2wnXG5cbmNvbnN0IFF1ZXJ5ID0gYFxuXG5cIkNvbnRhaW5zIGFsbCBwcm90b2NvbCBkYXRhLWZldGNoaW5nIHF1ZXJpZXNcIlxudHlwZSBRdWVyeSB7XG5cbiAgXCJBbiBBY2NvdW50IGJ5IEVUSCBhZGRyZXNzIG9yIEVOUyBuYW1lXCJcbiAgYWNjb3VudChpZDogU3RyaW5nKTogQWNjb3VudCFcbiAgXG4gIFwiQSBCcm9hZGNhc3RlciBieSBFVEggYWRkcmVzc1wiXG4gIGJyb2FkY2FzdGVyKGlkOiBTdHJpbmchKTogQnJvYWRjYXN0ZXIhXG4gIFxuICBcIlRoZSBjdXJyZW50bHkgYXV0aGVudGljYXRlZCB1c2VyJ3MgRVRIIGFkZHJlc3NcIlxuICBjb2luYmFzZTogU3RyaW5nIVxuXG4gIFwiVGhlIGN1cnJlbnQgRXRoZXJldW0gYmxvY2tcIlxuICBjdXJyZW50QmxvY2s6IEJsb2NrIVxuXG4gIFwiVGhlIGN1cnJlbnQgcm91bmQgaW4gdGhlIExpdmVwZWVyIHByb3RvY29sXCJcbiAgY3VycmVudFJvdW5kOiBSb3VuZCFcblxuICBcIkEgRGVsZWdhdG9yIGJ5IEVUSCBhZGRyZXNzXCJcbiAgZGVsZWdhdG9yKGlkOiBTdHJpbmchKTogRGVsZWdhdG9yIVxuXG4gIFwiQSBKb2IgYnkgaWRcIlxuICBqb2IoaWQ6IFN0cmluZyEpOiBKb2IhXG5cbiAgXCJBIGxpc3Qgb2YgSm9ic1wiXG4gIGpvYnMoYnJvYWRjYXN0ZXI6IFN0cmluZywgc2tpcDogSW50LCBsaW1pdDogSW50KTogW0pvYiFdIVxuXG4gIFwiVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBhY2NvdW50ICh1c3VhbGx5IHNldCBieSBzb21ldGhpbmcgbGlrZSBNZXRhTWFzaylcIlxuICBtZTogQWNjb3VudCFcblxuICBcIkFsbCB0cmFuc2FjdGlvbnMgdG8gb3IgZnJvbSBhbiBhY2NvdW50IGJldHdlZW4gdGhlIGdpdmVuIHN0YXJ0IGJsb2NrIGFuZCBlbmQgYmxvY2tcIlxuICB0cmFuc2FjdGlvbnMoXG4gICAgYWRkcmVzczogU3RyaW5nISxcbiAgICBzdGFydEJsb2NrOiBTdHJpbmcsXG4gICAgZW5kQmxvY2s6IFN0cmluZyxcbiAgICBza2lwOiBTdHJpbmcsXG4gICAgbGltaXQ6IFN0cmluZyxcbiAgICBzb3J0OiBTdHJpbmdcbiAgKTogW1RyYW5zYWN0aW9uIV0hXG5cbiAgXCJBIFRyYW5zY29kZXIgYnkgRVRIIGFkZHJlc3NcIlxuICB0cmFuc2NvZGVyKGlkOiBTdHJpbmchKTogVHJhbnNjb2RlciFcblxuICBcIkEgbGlzdCBvZiBUcmFuc2NvZGVyc1wiXG4gIHRyYW5zY29kZXJzKHNraXA6IEludCwgZmlyc3Q6IEludCk6IFtUcmFuc2NvZGVyIV0hXG5cbiAgXCJUaGUgcHJvdG9jb2wgYXMgYSB3aG9sZVwiXG4gIHByb3RvY29sOiBQcm90b2NvbFxuXG4gIFwiVGhlIHVuYm9uZGluZyBsb2NrcyBmb3IgYW4gYWNjb3VudCBcIlxuICB1bmJvbmRsb2NrcyhpZDogU3RyaW5nISk6IFtVbmJvbmRMb2NrXSFcblxuICBcIkFuIHVuYm9uZCBsb2NrIGZvciBhbiBhY2NvdW50XCJcbiAgdW5ib25kbG9jayhpZDogU3RyaW5nISwgbG9ja0lkOiBTdHJpbmchKTogVW5ib25kTG9jayFcbn1gXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IFtcbiAgUXVlcnksXG4gIEFjY291bnQsXG4gIEJsb2NrLFxuICBCcm9hZGNhc3RlcixcbiAgRGVsZWdhdG9yLFxuICBKb2IsXG4gIFJvdW5kLFxuICBUcmFuc2FjdGlvbixcbiAgVHJhbnNjb2RlcixcbiAgUHJvdG9jb2wsXG5dXG4iXX0=
