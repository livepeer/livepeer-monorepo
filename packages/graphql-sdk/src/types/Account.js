import Broadcaster from './Broadcaster'
import Delegator from './Delegator'
import Transcoder from './Transcoder'
import UnbondLock from './UnbondLock'

const Account = `
"A type that describes a Livepeer account"
type Account {

  "The ETH address for an account"
  id: String!

  "The ENS name for an account"
  ensName: String!

  "The ETH balance for an account"
  ethBalance: String!

  "The Livepeer Token (LPTU) balance for an account"
  tokenBalance: String!

  "The broadcaster info for an account"
  broadcaster: Broadcaster!

  "The delegator info for an account"
  delegator: Delegator!

  "The transcoder info for an account"
  transcoder: Transcoder!

  "The unbonding locks for an account "
  unbondlocks: [UnbondLock]!

  "An unbond lock for an account"
  unbondlock(lockId: String!): UnbondLock!
}`

export default () => [Account, Broadcaster, Delegator, Transcoder, UnbondLock]
