import Account from './Account'
import Block from './Block'
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

  "An Account by ETH address or ENS name"
  account(id: String): Account!
  
  "A Broadcaster by ETH address"
  broadcaster(id: String!): Broadcaster!
  
  "The currently authenticated user's ETH address"
  coinbase: String!

  "The current Ethereum block"
  currentBlock: Block!

  "The current round in the Livepeer protocol"
  currentRound: Round!

  "A Delegator by ETH address"
  delegator(id: String!): Delegator!

  "A Job by id"
  job(id: String!): Job!

  "A list of Jobs"
  jobs(broadcaster: String, skip: Int, limit: Int): [Job!]!

  "The currently selected account (usually set by something like MetaMask)"
  me: Account!

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
  transcoder(id: String!): Transcoder!

  "A list of Transcoders"
  transcoders(skip: Int, limit: Int): [Transcoder!]!

  "The protocol as a whole"
  protocol: Protocol!
}`

export default () => [
  Query,
  Account,
  Block,
  Broadcaster,
  Delegator,
  Job,
  Round,
  Transaction,
  Transcoder,
  Protocol,
]
