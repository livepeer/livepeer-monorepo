import JobProfile from './JobProfile'

const Job = `

"A transcode job, created by a broadcaster"
type Job {

  "Unique identifer for job"
  id: String!

  "Address of broadcaster that requested the transcoding job"
  broadcaster: String!

  "Transcoding profiles associated with the job"
  profiles: [JobProfile!]!

  "Unique identifier for the stream"
  streamId: String!

}
`

export default () => [Job, JobProfile]
