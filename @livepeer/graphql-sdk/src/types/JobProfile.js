const JobProfile = `
type JobProfile {
  id: String!
  name: String!
  bitrate: String!
  framerate: Int!
  resolution: String!
}
`

export default () => [JobProfile]
