import TranscoderStatus from './TranscoderStatus'

const Transcoder = `
type Transcoder {
  id: String!
  active: Boolean!
  status: TranscoderStatus!
  lastRewardRound: String!
  blockRewardCut: String!
  feeShare: String!
  pricePerSegment: String!
  pendingBlockRewardCut: String!
  pendingFeeShare: String!
  pendingPricePerSegment: String!
  # tokenPoolsPerRound: [TokenPool]
}
`

export default () => [Transcoder, TranscoderStatus]
