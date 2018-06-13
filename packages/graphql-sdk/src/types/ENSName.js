import Account from './Account'

const ENSName = `

"A type that describes an ENS name for a Livepeer account"
type ENSName {

    "The ENS name for a Livepeer account"
    id: String!

    "The info for a Livepeer account"
    account: Account

}`

export default () => [ENSName, Account]
