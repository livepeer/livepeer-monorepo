const DelegatorStatus = `
enum DelegatorStatus {
  Pending
  Bonded
  Unbonding
  Unbonded
}
`

export default () => [DelegatorStatus]
