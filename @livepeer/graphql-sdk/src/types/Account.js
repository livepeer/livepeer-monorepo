import Broadcaster from './Broadcaster'
import Delegator from './Delegator'
import Transcoder from './Transcoder'

const Account = `
type Account {
  id: String!
  ethBalance: String!
  tokenBalance: String!
  broadcaster: Broadcaster!
  delegator: Delegator!
  transcoder: Transcoder!
}
`

export default () => [Account, Broadcaster, Delegator, Transcoder]
