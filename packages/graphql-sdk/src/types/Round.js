const Round = `

"Submit transcode jobs for live video streams."
type Round {

  "The round number"
  id: String!

  "Whether the round was initialized"
  initialized: Boolean!
  
  "The last previously initialized round"
  lastInitializedRound: String!
  
  "The number of blocks this round lasts for"
  length: String!

  "When the round starts"
  startBlock: String!

}`

export default () => [Round]
