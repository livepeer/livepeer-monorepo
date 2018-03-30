export default `
fragment TranscoderFragment on Transcoder {
  id
  active
  status
  lastRewardRound
  rewardCut
  feeShare
  pricePerSegment
  pendingFeeShare
  pendingPricePerSegment
  pendingRewardCut
  totalStake
}`
