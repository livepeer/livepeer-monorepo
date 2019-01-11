const UnbondLock = `

"Get an unbonding lock for a delegator"
type UnbondLock {

    "unbonding lock id"
    id: String!,

    "The address of delegator unbonding from"
    delegator: String!,

    "The amount being unbonded"
    amount: String!,

    "When the unbonding amount will be available for withdrawal"
    withdrawRound: String!
}
`

export default () => [UnbondLock]
