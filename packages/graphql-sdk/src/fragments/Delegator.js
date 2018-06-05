export default `
fragment DelegatorFragment on Delegator {
  id
  allowance
  delegateAddress
  bondedAmount
  fees
  delegatedAmount
  lastClaimRound
  pendingFees
  pendingStake
  startRound
  status
  withdrawRound
}`
