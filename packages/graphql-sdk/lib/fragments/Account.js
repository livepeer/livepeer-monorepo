'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0
var _default =
  '\nfragment AccountFragment on Account {\n  id\n  ensName\n  ethBalance\n  tokenBalance\n  broadcaster {\n    ...BroadcasterFragment\n  }\n  delegator {\n    ...DelegatorFragment\n  }\n  transcoder {\n    ...TranscoderFragment\n  }\n  unbondlocks {\n    ...UnbondLocksFragment\n  }\n  unbondlock(lockId: $lockId) {\n    ...UnbondLocksFragment\n  }\n}'
exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=
