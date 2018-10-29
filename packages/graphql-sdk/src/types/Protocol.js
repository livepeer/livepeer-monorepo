const Protocol = `
  type Protocol {
    "Protocol id"
    id: String!

    "Protocol paused"
    paused: Boolean!

    "Protocol totalTokenSupply"
    totalTokenSupply: String!

    "Protocol totalBondedToken"
    totalBondedToken: String!

    "Protocol targetBondingRate"
    targetBondingRate: String!

    "Protocol transcoderPoolMaxSize"
    transcoderPoolMaxSize: String!

    "Protocol maxEarningsClaimsRounds"
    maxEarningsClaimsRounds: String!
  }
`

export default () => [Protocol]
