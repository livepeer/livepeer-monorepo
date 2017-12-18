import test from 'ava'
import { graphql } from 'graphql'
import {
  utils,
  EMPTY_ADDRESS,
  VIDEO_PROFILE_ID_SIZE,
  VIDEO_PROFILES,
} from '@livepeer/sdk'
import createSchema from './index'

// clears console
console.log('\x1Bc')

// mock chain
const ALL_JOBS = [
  {
    jobId: 0,
    streamId: 'x36xhzz',
    transcodingOptions: [VIDEO_PROFILES.P144p30fps16x9],
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '11'),
  },
  {
    jobId: 1,
    streamId: 'x36xhzz',
    transcodingOptions: [
      VIDEO_PROFILES.P144p30fps16x9,
      VIDEO_PROFILES.P240p30fps16x9,
    ],
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  },
  {
    jobId: 2,
    streamId: 'baz',
    transcodingOptions: [
      VIDEO_PROFILES.P360p30fps16x9,
      VIDEO_PROFILES.P720p30fps4x3,
      VIDEO_PROFILES.P576p30fps16x9,
    ],
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  },
  {
    jobId: 3,
    streamId: 'baz',
    transcodingOptions: [],
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  },
]

// mock sdk
const livepeer = {
  constants: {
    VIDEO_PROFILE_ID_SIZE,
    VIDEO_PROFILES,
  },
  rpc: {
    getJob: async id => ALL_JOBS[id],
    getJobs: async ({ broadcaster } = {}) =>
      broadcaster
        ? ALL_JOBS.filter(x => x.broadcaster === broadcaster)
        : ALL_JOBS,
  },
  utils,
}

// Livepeer graphql schema
const LivepeerSchema = createSchema({ livepeer })

// Queries
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

// job(...) query
test.skip('should get a single job by id', async t => {
  const params = {
    id: 0,
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
  }
  const res = await graphql(LivepeerSchema, JobQuery, null, null, params)
  // console.log(JSON.stringify(res, null, 2))
  t.pass()
})

// jobs(...) query
test('should get many jobs', async t => {
  const res0 = await graphql(LivepeerSchema, JobsQuery, null, null, {
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  })
  // console.log(JSON.stringify(res0, null, 2))
  const res1 = await graphql(LivepeerSchema, JobsQuery, null, null, {
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
    broadcasterWhereJobId: 2,
  })
  // console.log(JSON.stringify(res1, null, 2))
  t.pass()
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
