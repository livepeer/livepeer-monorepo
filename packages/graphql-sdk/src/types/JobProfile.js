const JobProfile = `

"A job's transcoding profile"
type JobProfile {

  "The hashcode for the transcoding profile"
  id: String!

  "The name of the profile"
  name: String!

  "The profile bitrate"
  bitrate: String!

  "The profile framerate"
  framerate: Int!

  "The screen resolution of the profile"
  resolution: String!

}`

export default () => [JobProfile]
