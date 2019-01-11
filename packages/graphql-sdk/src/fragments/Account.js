export default `
fragment AccountFragment on Account {
  id
  ensName
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
  unbondlocks {
    ...UnbondLocksFragment
  }
  unbondlock(lockId: $lockId) {
    ...UnbondLocksFragment
  }
}`
