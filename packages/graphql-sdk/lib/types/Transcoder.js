'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _TranscoderStatus = _interopRequireDefault(require('./TranscoderStatus'))

var Transcoder =
  '\n\n"Perform transcoding work for the network. The transcoders with the most delegated stake are elected as active transcoders that process transcode jobs for the network."\ntype Transcoder {\n\n  "The transcoder\'s ETH address"\n  id: String!\n\n  "Whether or not the transcoder is active"\n  active: Boolean!\n\n  "The ENS name for an account"\n  ensName: String!\n\n  "The status of the transcoder"\n  status: TranscoderStatus!\n\n  "Last round that the transcoder called reward"\n  lastRewardRound: String!\n\n  "% of block reward cut paid to transcoder by a delegator"\n  rewardCut: String!\n\n  "% of fees paid to delegators by transcoder"\n  feeShare: String!\n\n  "Price per segment for a stream (LPTU)"\n  pricePerSegment: String!\n\n  "Pending block reward cut for next round if the transcoder is active"\n  pendingRewardCut: String!\n\n  "Pending fee share for next round if the transcoder is active"\n  pendingFeeShare: String!\n\n  "Pending price per segment for next round if the transcoder is active"\n  pendingPricePerSegment: String!\n\n  "Total tokens delegated toward a transcoder (including their own)"\n  totalStake: String!\n\n  # "Token pools for each round"\n  # tokenPoolsPerRound: [TokenPool]\n\n}'

var _default = function _default() {
  return [Transcoder, _TranscoderStatus.default]
}

exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9UcmFuc2NvZGVyLmpzIl0sIm5hbWVzIjpbIlRyYW5zY29kZXIiLCJUcmFuc2NvZGVyU3RhdHVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFFQSxJQUFNQSxVQUFVLHV1Q0FBaEI7O2VBOENlO0FBQUEsU0FBTSxDQUFDQSxVQUFELEVBQWFDLHlCQUFiLENBQU47QUFBQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRyYW5zY29kZXJTdGF0dXMgZnJvbSAnLi9UcmFuc2NvZGVyU3RhdHVzJ1xuXG5jb25zdCBUcmFuc2NvZGVyID0gYFxuXG5cIlBlcmZvcm0gdHJhbnNjb2Rpbmcgd29yayBmb3IgdGhlIG5ldHdvcmsuIFRoZSB0cmFuc2NvZGVycyB3aXRoIHRoZSBtb3N0IGRlbGVnYXRlZCBzdGFrZSBhcmUgZWxlY3RlZCBhcyBhY3RpdmUgdHJhbnNjb2RlcnMgdGhhdCBwcm9jZXNzIHRyYW5zY29kZSBqb2JzIGZvciB0aGUgbmV0d29yay5cIlxudHlwZSBUcmFuc2NvZGVyIHtcblxuICBcIlRoZSB0cmFuc2NvZGVyJ3MgRVRIIGFkZHJlc3NcIlxuICBpZDogU3RyaW5nIVxuXG4gIFwiV2hldGhlciBvciBub3QgdGhlIHRyYW5zY29kZXIgaXMgYWN0aXZlXCJcbiAgYWN0aXZlOiBCb29sZWFuIVxuXG4gIFwiVGhlIEVOUyBuYW1lIGZvciBhbiBhY2NvdW50XCJcbiAgZW5zTmFtZTogU3RyaW5nIVxuXG4gIFwiVGhlIHN0YXR1cyBvZiB0aGUgdHJhbnNjb2RlclwiXG4gIHN0YXR1czogVHJhbnNjb2RlclN0YXR1cyFcblxuICBcIkxhc3Qgcm91bmQgdGhhdCB0aGUgdHJhbnNjb2RlciBjYWxsZWQgcmV3YXJkXCJcbiAgbGFzdFJld2FyZFJvdW5kOiBTdHJpbmchXG5cbiAgXCIlIG9mIGJsb2NrIHJld2FyZCBjdXQgcGFpZCB0byB0cmFuc2NvZGVyIGJ5IGEgZGVsZWdhdG9yXCJcbiAgcmV3YXJkQ3V0OiBTdHJpbmchXG5cbiAgXCIlIG9mIGZlZXMgcGFpZCB0byBkZWxlZ2F0b3JzIGJ5IHRyYW5zY29kZXJcIlxuICBmZWVTaGFyZTogU3RyaW5nIVxuXG4gIFwiUHJpY2UgcGVyIHNlZ21lbnQgZm9yIGEgc3RyZWFtIChMUFRVKVwiXG4gIHByaWNlUGVyU2VnbWVudDogU3RyaW5nIVxuXG4gIFwiUGVuZGluZyBibG9jayByZXdhcmQgY3V0IGZvciBuZXh0IHJvdW5kIGlmIHRoZSB0cmFuc2NvZGVyIGlzIGFjdGl2ZVwiXG4gIHBlbmRpbmdSZXdhcmRDdXQ6IFN0cmluZyFcblxuICBcIlBlbmRpbmcgZmVlIHNoYXJlIGZvciBuZXh0IHJvdW5kIGlmIHRoZSB0cmFuc2NvZGVyIGlzIGFjdGl2ZVwiXG4gIHBlbmRpbmdGZWVTaGFyZTogU3RyaW5nIVxuXG4gIFwiUGVuZGluZyBwcmljZSBwZXIgc2VnbWVudCBmb3IgbmV4dCByb3VuZCBpZiB0aGUgdHJhbnNjb2RlciBpcyBhY3RpdmVcIlxuICBwZW5kaW5nUHJpY2VQZXJTZWdtZW50OiBTdHJpbmchXG5cbiAgXCJUb3RhbCB0b2tlbnMgZGVsZWdhdGVkIHRvd2FyZCBhIHRyYW5zY29kZXIgKGluY2x1ZGluZyB0aGVpciBvd24pXCJcbiAgdG90YWxTdGFrZTogU3RyaW5nIVxuXG4gICMgXCJUb2tlbiBwb29scyBmb3IgZWFjaCByb3VuZFwiXG4gICMgdG9rZW5Qb29sc1BlclJvdW5kOiBbVG9rZW5Qb29sXVxuXG59YFxuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiBbVHJhbnNjb2RlciwgVHJhbnNjb2RlclN0YXR1c11cbiJdfQ==
