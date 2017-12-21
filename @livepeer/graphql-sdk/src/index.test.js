import test from 'ava'
import { graphql } from 'graphql'
import {
  utils,
  ADDRESS_PAD,
  EMPTY_ADDRESS,
  DELEGATOR_STATUS,
  TRANSCODER_STATUS,
  VIDEO_PROFILE_ID_SIZE,
  VIDEO_PROFILES,
} from '@livepeer/sdk'
import createSchema from './index'
import livepeer from './mock-sdk'

// clears console
console.log('\x1Bc')

// Livepeer graphql schema

const LivepeerSchema = createSchema({ livepeer })

// Fragments

const AccountFragment = `
fragment AccountFragment on Account {
  id
  ethBalance
  tokenBalance
  broadcaster {
    ...BroadcasterFragment
    jobs(dead: $dead, streamRootUrl: $streamRootUrl) {
      ...JobFragment
    }
  }
  delegator {
    ...DelegatorFragment
    delegate {
      # GraphQL disallows recursive fragments
      # so, we have to inline an AccountFragment manually
      id
      broadcaster {
        ...BroadcasterFragment
        jobs(dead: $dead, streamRootUrl: $streamRootUrl) {
          ...JobFragment
        }
      }
      delegator {
        ...DelegatorFragment
      }
      transcoder {
      	...TranscoderFragment
      }
    }
  }
  transcoder {
    ...TranscoderFragment
  }
}
`

const BroadcasterFragment = `
fragment BroadcasterFragment on Broadcaster {
  id
  deposit
  withdrawBlock
}
`

const DelegatorFragment = `
fragment DelegatorFragment on Delegator {
  status
  delegateAddress
  bondedAmount
  unbondedAmount
  delegatedAmount
  lastClaimRound
  startRound
  withdrawRound
}
`

const JobFragment = `
fragment JobFragment on Job {
  id
  broadcaster
  stream
  profiles {
    id
    name
    bitrate
    framerate
    resolution
  }
  ... on VideoJob {
    live
    url
  }
}
`

const TranscoderFragment = `
fragment TranscoderFragment on Transcoder {
  active
  status
  lastRewardRound
  blockRewardCut
  feeShare
  pricePerSegment
  pendingBlockRewardCut
  pendingFeeShare
  pendingPricePerSegment
}
`

// Queries

const AccountQuery = `
${AccountFragment}
${BroadcasterFragment}
${DelegatorFragment}
${JobFragment}
${TranscoderFragment}
query AccountQuery($id: String!, $dead: Boolean, $streamRootUrl: String) {
  account(id: $id) {
    ...AccountFragment
  }
}
`

const BroadcasterQuery = `
${BroadcasterFragment}
query BroadcasterQuery($id: String!) {
  broadcaster(id: $id) {
    ...BroadcasterFragment
  }
}
`

const BroadcasterWithJobsQuery = `
${BroadcasterFragment}
${JobFragment}
query BroadcasterWithJobsQuery($id: String!, $dead: Boolean, $streamRootUrl: String) {
  broadcaster(id: $id) {
    ...BroadcasterFragment
    jobs(dead: $dead, streamRootUrl: $streamRootUrl) {
      ...JobFragment
    }
  }
}
`

const DelegatorQuery = `
${DelegatorFragment}
query DelegatorQuery($id: String!) {
  delegator(id: $id) {
    ...DelegatorFragment
  }
}
`

const JobQuery = `
${JobFragment}
query JobQuery($id: Int!, $streamRootUrl: String) {
  job(id: $id, streamRootUrl: $streamRootUrl) {
    ...JobFragment
  }
}
`

const JobsQuery = `
${JobFragment}
query JobsQuery($dead: Boolean, $streamRootUrl: String, $broadcaster: String, $broadcasterWhereJobId: Int) {
  jobs(dead: $dead, streamRootUrl: $streamRootUrl, broadcaster: $broadcaster, broadcasterWhereJobId: $broadcasterWhereJobId) {
    ...JobFragment
  }
}
`

const TranscoderQuery = `
${TranscoderFragment}
query TranscoderQuery($id: String!) {
  transcoder(id: $id) {
    ...TranscoderFragment
  }
}
`

// account(...) query
test('should get a single account by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
    dead: true,
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
  }
  const res = await graphql(LivepeerSchema, AccountQuery, null, null, params)
  // console.log(res)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

// broadcaster(...) query
test('should get a single broadcaster by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
  }
  const res = await graphql(
    LivepeerSchema,
    BroadcasterQuery,
    null,
    null,
    params,
  )
  // console.log(res)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('should get a single broadcaster and their jobs by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
    dead: true,
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
  }
  const res = await graphql(
    LivepeerSchema,
    BroadcasterWithJobsQuery,
    null,
    null,
    params,
  )
  // console.log(res)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

// delegator(...) query
test('should get a single delegator by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '11'),
  }
  const res = await graphql(LivepeerSchema, DelegatorQuery, null, null, params)
  // console.log(res)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

// job(...) query
test('should get a single job by id', async t => {
  const params = {
    id: 0,
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
  }
  const res = await graphql(LivepeerSchema, JobQuery, null, null, params)
  // console.log(res)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

// jobs(...) query
test('should get many jobs', async t => {
  const res0 = await graphql(LivepeerSchema, JobsQuery, null, null, {
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  })
  // console.log(res0)
  // console.log(JSON.stringify(res0, null, 2))
  t.snapshot(res0)
  const res1 = await graphql(LivepeerSchema, JobsQuery, null, null, {
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
    broadcasterWhereJobId: 2,
  })
  // console.log(res1)
  // console.log(JSON.stringify(res1, null, 2))
  t.snapshot(res1)
})

// transcoder(...) query
test('should get a single transcoder by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '11'),
  }
  const res = await graphql(LivepeerSchema, TranscoderQuery, null, null, params)
  // console.log(res)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('possible types', async t => {
  const query = `{
    __schema {
      types {
        kind
        name
        possibleTypes {
          name
        }
      }
    }
  }`
  const res = await graphql(LivepeerSchema, query, null, null, {})
  // console.log(JSON.stringify(res, null, 2))
  t.pass()
})
