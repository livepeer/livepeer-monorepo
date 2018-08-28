// @flow
export type TranscoderCardProps = {|
  active: boolean,
  bonded: boolean,
  ensName: string,
  feeShare: string,
  id: string,
  lastRewardRound: string,
  onBond?: any => void,
  onUnbond?: any => void,
  pendingRewardCut: string,
  pendingFeeShare: string,
  pendingPricePerSegment: string,
  pricePerSegment: string,
  rewardCut: string,
  status: string,
  totalStake: string,
|}
