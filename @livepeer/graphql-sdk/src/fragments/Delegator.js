export default `
fragment DelegatorFragment on Delegator {
  id
  status
  delegateAddress
  bondedAmount
  fees
  delegatedAmount
  lastClaimRound
  startRound
  withdrawRound
}`
