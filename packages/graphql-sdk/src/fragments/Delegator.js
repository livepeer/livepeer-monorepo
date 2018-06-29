export default `
fragment DelegatorFragment on Delegator {
  id
  allowance
  delegateAddress
  ensName
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
