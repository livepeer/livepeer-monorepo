import Job from './Job'

const Broadcaster = `

"Submit transcode jobs for live video streams."
type Broadcaster {

  "The broadcaster's ETH address"
  id: String!

  "The ENS name for an account"
  ensName: String!

  "The broadcaster's ETH deposit (required to create a Job)"
  deposit: String!

  "The earliest ETH block at which the broadcaster is eligible to withdraw their deposited ETH"
  withdrawBlock: String!

  "The jobs created by a broadcaster"
  jobs(skip: Int, limit: Int): [Job!]!

}`

export default () => [Broadcaster, Job]
