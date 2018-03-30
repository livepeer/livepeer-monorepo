export default `
fragment AccountFragment on Account {
  id
  ethBalance
  tokenBalance
  broadcaster {
    ...BroadcasterFragment
  }
  delegator {
    ...DelegatorFragment
  }
  transcoder {
    ...TranscoderFragment
  }
}`
