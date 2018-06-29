export default `
  fragment ProtocolFragment on Protocol {
    id
    paused
    totalTokenSupply
    totalBondedToken
    targetBondingRate
    transcoderPoolMaxSize
  }
`
