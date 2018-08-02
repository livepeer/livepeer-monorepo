const DelegatorStatus = `

"The possible statuses of a delegator"
enum DelegatorStatus {
  Pending
  Bonded
  Unbonded
  Unbonding
}`

export default () => [DelegatorStatus]
