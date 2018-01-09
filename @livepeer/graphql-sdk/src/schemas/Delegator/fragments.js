export default `
fragment DelegatorFragment on Delegator {
  id
  status
  delegateAddress
  bondedAmount
  unbondedAmount
  delegatedAmount
  lastClaimRound
  startRound
  withdrawRound
}
`
