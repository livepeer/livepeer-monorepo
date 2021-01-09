'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _Job = _interopRequireDefault(require('./Job'))

var Broadcaster =
  '\n\n"Submit transcode jobs for live video streams."\ntype Broadcaster {\n\n  "The broadcaster\'s ETH address"\n  id: String!\n\n  "The ENS name for an account"\n  ensName: String!\n\n  "The broadcaster\'s ETH deposit (required to create a Job)"\n  deposit: String!\n\n  "The earliest ETH block at which the broadcaster is eligible to withdraw their deposited ETH"\n  withdrawBlock: String!\n\n  "The jobs created by a broadcaster"\n  jobs(skip: Int, limit: Int): [Job!]!\n\n}'

var _default = function _default() {
  return [Broadcaster, _Job.default]
}

exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9Ccm9hZGNhc3Rlci5qcyJdLCJuYW1lcyI6WyJCcm9hZGNhc3RlciIsIkpvYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUEsSUFBTUEsV0FBVywwZUFBakI7O2VBc0JlO0FBQUEsU0FBTSxDQUFDQSxXQUFELEVBQWNDLFlBQWQsQ0FBTjtBQUFBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSm9iIGZyb20gJy4vSm9iJ1xuXG5jb25zdCBCcm9hZGNhc3RlciA9IGBcblxuXCJTdWJtaXQgdHJhbnNjb2RlIGpvYnMgZm9yIGxpdmUgdmlkZW8gc3RyZWFtcy5cIlxudHlwZSBCcm9hZGNhc3RlciB7XG5cbiAgXCJUaGUgYnJvYWRjYXN0ZXIncyBFVEggYWRkcmVzc1wiXG4gIGlkOiBTdHJpbmchXG5cbiAgXCJUaGUgRU5TIG5hbWUgZm9yIGFuIGFjY291bnRcIlxuICBlbnNOYW1lOiBTdHJpbmchXG5cbiAgXCJUaGUgYnJvYWRjYXN0ZXIncyBFVEggZGVwb3NpdCAocmVxdWlyZWQgdG8gY3JlYXRlIGEgSm9iKVwiXG4gIGRlcG9zaXQ6IFN0cmluZyFcblxuICBcIlRoZSBlYXJsaWVzdCBFVEggYmxvY2sgYXQgd2hpY2ggdGhlIGJyb2FkY2FzdGVyIGlzIGVsaWdpYmxlIHRvIHdpdGhkcmF3IHRoZWlyIGRlcG9zaXRlZCBFVEhcIlxuICB3aXRoZHJhd0Jsb2NrOiBTdHJpbmchXG5cbiAgXCJUaGUgam9icyBjcmVhdGVkIGJ5IGEgYnJvYWRjYXN0ZXJcIlxuICBqb2JzKHNraXA6IEludCwgbGltaXQ6IEludCk6IFtKb2IhXSFcblxufWBcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4gW0Jyb2FkY2FzdGVyLCBKb2JdXG4iXX0=
