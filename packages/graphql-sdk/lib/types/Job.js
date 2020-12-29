'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _JobProfile = _interopRequireDefault(require('./JobProfile'))

var Job =
  '\n\n"A transcode job, created by a broadcaster"\ntype Job {\n\n  "Unique identifer for job"\n  id: String!\n\n  "Address of broadcaster that requested the transcoding job"\n  broadcaster: String!\n\n  "The broadcaster\'s ENS name"\n  broadcasterENSName: String!\n\n  "Transcoding profiles associated with the job"\n  profiles: [JobProfile!]!\n\n  "Unique identifier for the stream"\n  streamId: String!\n\n}\n'

var _default = function _default() {
  return [Job, _JobProfile.default]
}

exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9Kb2IuanMiXSwibmFtZXMiOlsiSm9iIiwiSm9iUHJvZmlsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBRUEsSUFBTUEsR0FBRyx5YUFBVDs7ZUF1QmU7QUFBQSxTQUFNLENBQUNBLEdBQUQsRUFBTUMsbUJBQU4sQ0FBTjtBQUFBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSm9iUHJvZmlsZSBmcm9tICcuL0pvYlByb2ZpbGUnXG5cbmNvbnN0IEpvYiA9IGBcblxuXCJBIHRyYW5zY29kZSBqb2IsIGNyZWF0ZWQgYnkgYSBicm9hZGNhc3RlclwiXG50eXBlIEpvYiB7XG5cbiAgXCJVbmlxdWUgaWRlbnRpZmVyIGZvciBqb2JcIlxuICBpZDogU3RyaW5nIVxuXG4gIFwiQWRkcmVzcyBvZiBicm9hZGNhc3RlciB0aGF0IHJlcXVlc3RlZCB0aGUgdHJhbnNjb2Rpbmcgam9iXCJcbiAgYnJvYWRjYXN0ZXI6IFN0cmluZyFcblxuICBcIlRoZSBicm9hZGNhc3RlcidzIEVOUyBuYW1lXCJcbiAgYnJvYWRjYXN0ZXJFTlNOYW1lOiBTdHJpbmchXG5cbiAgXCJUcmFuc2NvZGluZyBwcm9maWxlcyBhc3NvY2lhdGVkIHdpdGggdGhlIGpvYlwiXG4gIHByb2ZpbGVzOiBbSm9iUHJvZmlsZSFdIVxuXG4gIFwiVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBzdHJlYW1cIlxuICBzdHJlYW1JZDogU3RyaW5nIVxuXG59XG5gXG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IFtKb2IsIEpvYlByb2ZpbGVdXG4iXX0=
