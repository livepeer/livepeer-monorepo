import Job from './Job'

const Broadcaster = `
type Broadcaster {
  id: String!
  deposit: String!
  withdrawBlock: String!
  jobs(skip: Int, limit: Int): [Job!]!
}
`

export default () => [Broadcaster, Job]
