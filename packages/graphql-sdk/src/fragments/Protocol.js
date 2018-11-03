export default `
  fragment ProtocolFragment on Protocol {
    paused
    totalTokenSupply
    totalBondedToken
    targetBondingRate
    transcoderPoolMaxSize
    maxEarningsClaimsRounds
  }
`
