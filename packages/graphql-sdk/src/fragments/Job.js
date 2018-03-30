export default `
fragment JobFragment on Job {
  id
  broadcaster
  streamId
  profiles {
    id
    name
    bitrate
    framerate
    resolution
  }
}`
