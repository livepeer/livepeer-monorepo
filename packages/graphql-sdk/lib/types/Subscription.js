'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

var _Transaction = _interopRequireDefault(require('./Transaction'))

var Subscription =
  '\n\ntype Subscription {\n\n  "A newly submitted transaction"\n  transactionSubmitted: Transaction!\n\n  "A newly confirmed transaction"\n  transactionConfirmed: Transaction!\n\n}\n'

var _default = function _default() {
  return [Subscription, _Transaction.default]
}

exports.default = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90eXBlcy9TdWJzY3JpcHRpb24uanMiXSwibmFtZXMiOlsiU3Vic2NyaXB0aW9uIiwiVHJhbnNhY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUVBLElBQU1BLFlBQVksNkxBQWxCOztlQWFlO0FBQUEsU0FBTSxDQUFDQSxZQUFELEVBQWVDLG9CQUFmLENBQU47QUFBQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRyYW5zYWN0aW9uIGZyb20gJy4vVHJhbnNhY3Rpb24nXG5cbmNvbnN0IFN1YnNjcmlwdGlvbiA9IGBcblxudHlwZSBTdWJzY3JpcHRpb24ge1xuXG4gIFwiQSBuZXdseSBzdWJtaXR0ZWQgdHJhbnNhY3Rpb25cIlxuICB0cmFuc2FjdGlvblN1Ym1pdHRlZDogVHJhbnNhY3Rpb24hXG5cbiAgXCJBIG5ld2x5IGNvbmZpcm1lZCB0cmFuc2FjdGlvblwiXG4gIHRyYW5zYWN0aW9uQ29uZmlybWVkOiBUcmFuc2FjdGlvbiFcblxufVxuYFxuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiBbU3Vic2NyaXB0aW9uLCBUcmFuc2FjdGlvbl1cbiJdfQ==
