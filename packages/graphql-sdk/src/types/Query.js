import ENSName from './ENSName'
import Account from './Account'
import Broadcaster from './Broadcaster'
import Delegator from './Delegator'
import Job from './Job'
import Round from './Round'
import Transaction from './Transaction'
import Transcoder from './Transcoder'
import Protocol from './Protocol'

const Query = `

"Contains all protocol data-fetching queries"
type Query {

  "A ENSName with associated Account"
  ensName(id: String!): ENSName

  "An Account by ETH address"
  account(id: String!): Account

  "A Broadcaster by ETH address"
  broadcaster(id: String!): Broadcaster

  "The currently authenticated user's ETH address"
  coinbase: String!

  "Gets the current round"
  currentRound: Round

  "A Delegator by ETH address"
  delegator(id: String!): Delegator

  "A Job by id"
  job(id: String!): Job

  "A list of Jobs"
  jobs(broadcaster: String, skip: Int, limit: Int): [Job!]!

  "The currently selected account (usually set by something like MetaMask)"
  me: Account

  "All transactions to or from an account between the given start block and end block"
  transactions(
    address: String!,
    startBlock: String,
    endBlock: String,
    skip: String,
    limit: String,
    sort: String
  ): [Transaction!]!

  "A Transcoder by ETH address"
  transcoder(id: String!): Transcoder

  "A list of Transcoders"
  transcoders(skip: Int, limit: Int): [Transcoder!]!

  "The protocol as a whole"
  protocol: Protocol
}`

export default () => [
  Query,
  ENSName,
  Account,
  Broadcaster,
  Delegator,
  Job,
  Round,
  Transaction,
  Transcoder,
  Protocol,
]
