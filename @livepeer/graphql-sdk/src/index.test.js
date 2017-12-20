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

// Queries
const BroadcasterQuery = `
query BroadcasterQuery($id: String!, $dead: Boolean, $streamRootUrl: String) {
  broadcaster(id: $id) {
    id
    deposit
    type
    withdrawBlock
    jobs(dead: $dead, streamRootUrl: $streamRootUrl) {
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
  }
}
`

const DelegatorQuery = `
query DelegatorQuery($id: String!) {
  delegator(id: $id) {
    id
    status
    delegateAddress
    bondedAmount
    unbondedAmount
    delegatedAmount
    lastClaimRound
    startRound
    withdrawRound
  }
}
`

const JobQuery = `
query JobQuery($id: Int!, $streamRootUrl: String) {
  job(id: $id) {
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
      live(streamRootUrl: $streamRootUrl)
      url(streamRootUrl: $streamRootUrl)
    }
  }
}
`

const JobsQuery = `
query JobsQuery($dead: Boolean, $streamRootUrl: String, $broadcaster: String, $broadcasterWhereJobId: Int) {
  jobs(dead: $dead, streamRootUrl: $streamRootUrl, broadcaster: $broadcaster, broadcasterWhereJobId: $broadcasterWhereJobId) {
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
}
`

const TranscoderQuery = `
query TranscoderQuery($id: String!) {
  transcoder(id: $id) {
    id
    type
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
}
`

const UserQuery = `
query UserQuery($id: String!, $dead: Boolean, $streamRootUrl: String) {
  user(id: $id) {
    id
    broadcaster {
      id
      deposit
      withdrawBlock
      jobs(dead: $dead, streamRootUrl: $streamRootUrl) {
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
    }
    delegator {
      status
      delegateAddress
      bondedAmount
      unbondedAmount
      delegatedAmount
      lastClaimRound
      startRound
      withdrawRound
    }
    transcoder {
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
  }
}
`

// broadcaster(...) query
test('should get a single broadcaster by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
    dead: true,
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/'
  }
  const res = await graphql(LivepeerSchema, BroadcasterQuery, null, null, params)
  // console.log(res)
  // console.log(JSON.stringify(res, null, 2))
  t.skip.snapshot(res)
})

// delegator(...) query
test('should get a single delegator by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '11'),
  }
  const res = await graphql(LivepeerSchema, DelegatorQuery, null, null, params)
  t.snapshot(res)
})

// job(...) query
test('should get a single job by id', async t => {
  const params = {
    id: 0,
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
  }
  const res = await graphql(LivepeerSchema, JobQuery, null, null, params)
  t.snapshot(res)
})

// jobs(...) query
test('should get many jobs', async t => {
  const res0 = await graphql(LivepeerSchema, JobsQuery, null, null, {
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  })
  t.snapshot(res0)
  const res1 = await graphql(LivepeerSchema, JobsQuery, null, null, {
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
    broadcasterWhereJobId: 2,
  })
  t.snapshot(res1)
})

// transcoder(...) query
test('should get a single transcoder by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '11'),
  }
  const res = await graphql(LivepeerSchema, TranscoderQuery, null, null, params)
  // console.log(res)
  t.skip.snapshot(res)
})

// user(...) query
test('should get a single user by id', async t => {
  const params = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
    dead: true,
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/'
  }
  const res = await graphql(LivepeerSchema, UserQuery, null, null, params)
  // console.log(res)
  console.log(JSON.stringify(res, null, 2))
  t.skip.snapshot(res)
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
