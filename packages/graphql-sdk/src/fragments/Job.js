export default `
fragment JobFragment on Job {
  id
  broadcaster
  broadcasterENSName
  streamId
  profiles {
    id
    name
    bitrate
    framerate
    resolution
  }
}`
