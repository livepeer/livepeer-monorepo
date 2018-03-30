const DelegatorStatus = `

"The possible statuses of a delegator"
enum DelegatorStatus {
  Pending
  Bonded
  Unbonding
  Unbonded
}`

export default () => [DelegatorStatus]
