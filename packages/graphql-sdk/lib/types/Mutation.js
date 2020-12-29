'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0
var Mutation =
  '\n\n"Contains all protocol transaction queries"\ntype Mutation {\n\n  "Approve an amount for an ERC20 token transfer"\n  approve(type: String!, amount: String!): Boolean\n\n  "Submits a bond transaction for a previously approved amount"\n  bond(to: String!, amount: String!): JSON\n\n  "Claims earnings from your last claim round through specified round"\n  claimEarnings(endRound: String!): Boolean\n\n  "Sends a transaction based on an input object"\n  sendTransaction(options: JSON!): Boolean\n\n  "Submits a bond transaction for a previously approved amount"\n  unbond(amount: String!): JSON\n\n  "Rebond tokens for an unbonding lock to a delegator\'s current delegate while a delegator is in the Bonded or Pending states"\n  rebond(unbondingLockId: Int!): JSON\n\n  "Rebond tokens for an unbonding lock to a delegate while a delegator is in the Unbonded state "\n  rebondFromUnbonded(delegate: String!, unbondingLockId: Int!): JSON\n\n  "Submits a round initialization transaction"\n  initializeRound: JSON\n\n}'

var _default = function _default() {
  return [Mutation]
}

exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9NdXRhdGlvbi5qcyJdLCJuYW1lcyI6WyJNdXRhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTUEsUUFBUSw4Z0NBQWQ7O2VBK0JlO0FBQUEsU0FBTSxDQUFDQSxRQUFELENBQU47QUFBQSxDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgTXV0YXRpb24gPSBgXG5cblwiQ29udGFpbnMgYWxsIHByb3RvY29sIHRyYW5zYWN0aW9uIHF1ZXJpZXNcIlxudHlwZSBNdXRhdGlvbiB7XG5cbiAgXCJBcHByb3ZlIGFuIGFtb3VudCBmb3IgYW4gRVJDMjAgdG9rZW4gdHJhbnNmZXJcIlxuICBhcHByb3ZlKHR5cGU6IFN0cmluZyEsIGFtb3VudDogU3RyaW5nISk6IEJvb2xlYW5cblxuICBcIlN1Ym1pdHMgYSBib25kIHRyYW5zYWN0aW9uIGZvciBhIHByZXZpb3VzbHkgYXBwcm92ZWQgYW1vdW50XCJcbiAgYm9uZCh0bzogU3RyaW5nISwgYW1vdW50OiBTdHJpbmchKTogSlNPTlxuXG4gIFwiQ2xhaW1zIGVhcm5pbmdzIGZyb20geW91ciBsYXN0IGNsYWltIHJvdW5kIHRocm91Z2ggc3BlY2lmaWVkIHJvdW5kXCJcbiAgY2xhaW1FYXJuaW5ncyhlbmRSb3VuZDogU3RyaW5nISk6IEJvb2xlYW5cblxuICBcIlNlbmRzIGEgdHJhbnNhY3Rpb24gYmFzZWQgb24gYW4gaW5wdXQgb2JqZWN0XCJcbiAgc2VuZFRyYW5zYWN0aW9uKG9wdGlvbnM6IEpTT04hKTogQm9vbGVhblxuXG4gIFwiU3VibWl0cyBhIGJvbmQgdHJhbnNhY3Rpb24gZm9yIGEgcHJldmlvdXNseSBhcHByb3ZlZCBhbW91bnRcIlxuICB1bmJvbmQoYW1vdW50OiBTdHJpbmchKTogSlNPTlxuXG4gIFwiUmVib25kIHRva2VucyBmb3IgYW4gdW5ib25kaW5nIGxvY2sgdG8gYSBkZWxlZ2F0b3IncyBjdXJyZW50IGRlbGVnYXRlIHdoaWxlIGEgZGVsZWdhdG9yIGlzIGluIHRoZSBCb25kZWQgb3IgUGVuZGluZyBzdGF0ZXNcIlxuICByZWJvbmQodW5ib25kaW5nTG9ja0lkOiBJbnQhKTogSlNPTlxuXG4gIFwiUmVib25kIHRva2VucyBmb3IgYW4gdW5ib25kaW5nIGxvY2sgdG8gYSBkZWxlZ2F0ZSB3aGlsZSBhIGRlbGVnYXRvciBpcyBpbiB0aGUgVW5ib25kZWQgc3RhdGUgXCJcbiAgcmVib25kRnJvbVVuYm9uZGVkKGRlbGVnYXRlOiBTdHJpbmchLCB1bmJvbmRpbmdMb2NrSWQ6IEludCEpOiBKU09OXG5cbiAgXCJTdWJtaXRzIGEgcm91bmQgaW5pdGlhbGl6YXRpb24gdHJhbnNhY3Rpb25cIlxuICBpbml0aWFsaXplUm91bmQ6IEpTT05cblxufWBcblxuZXhwb3J0IGRlZmF1bHQgKCkgPT4gW011dGF0aW9uXVxuIl19
