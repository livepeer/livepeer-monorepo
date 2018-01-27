export const Query = `
type Query {
  account(id: String!): Account
  broadcaster(id: String!): Broadcaster
  delegator(id: String!): Delegator
  job(id: String!): Job
  jobs(broadcaster: String, skip: Int, limit: Int): [Job!]!
  me: Account
  transcoder(id: String!): Transcoder
  transcoders(skip: Int, limit: Int): [Transcoder!]!
}
`

export default () => [Query]
