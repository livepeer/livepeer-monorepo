import JobProfile from './JobProfile'

const Job = `
type Job {
  id: String!
  broadcaster: String!
  profiles: [JobProfile!]!
  streamId: String!
}
`

export default () => [Job, JobProfile]
