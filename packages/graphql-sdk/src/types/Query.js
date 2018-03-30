import Account from './Account'
import Broadcaster from './Broadcaster'
import Delegator from './Delegator'
import Job from './Job'
import Round from './Round'
import Transcoder from './Transcoder'

const Query = `

"Contains all protocol data-fetching queries"
type Query {

  "An Account by ETH address"
  account(id: String!): Account

  "A Broadcaster by ETH address"
  broadcaster(id: String!): Broadcaster

  "A Delegator by ETH address"
  delegator(id: String!): Delegator

  "A Job by id"
  job(id: String!): Job

  "A list of Jobs"
  jobs(broadcaster: String, skip: Int, limit: Int): [Job!]!

  "The currently selected account (usually set by something like MetaMask)"
  me: Account

  "Gets the current round"
  currentRound: Round

  "A Transcoder by ETH address"
  transcoder(id: String!): Transcoder

  "A list of Transcoders"
  transcoders(skip: Int, limit: Int): [Transcoder!]!

}`

export default () => [Query, Account, Broadcaster, Delegator, Job, Round, Transcoder]
