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
    transcoder: EMPTY_ADDRESS,
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '11'),
  },
  {
    jobId: 1,
    streamId: 'x36xhzz',
    transcodingOptions: [
      VIDEO_PROFILES.P144p30fps16x9,
      VIDEO_PROFILES.P240p30fps16x9,
    ],
    transcoder: EMPTY_ADDRESS,
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
    transcoder: EMPTY_ADDRESS,
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  },
  {
    jobId: 3,
    streamId: 'baz',
    transcodingOptions: [],
    transcoder: EMPTY_ADDRESS,
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

// job(...) query
test.skip('should get a single job by id', async t => {
  const query = `
    query JobQuery($id: Int!, $streamRootUrl: String) {
      job(id: $id) {
        id
        broadcaster
        stream
        transcoder
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
  const params = {
    id: 0,
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
  }
  const res = await graphql(LivepeerSchema, query, null, null, params)
  // console.log(JSON.stringify(res, null, 2))
  t.pass()
})

// jobs(...) query
test('should get many jobs', async t => {
  const query = `
    query JobsQuery($dead: Boolean, $streamRootUrl: String, $broadcaster: String) {
      jobs(dead: $dead, streamRootUrl: $streamRootUrl, broadcaster: $broadcaster) {
        id
        broadcaster
        stream
        transcoder
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
  const params = {
    streamRootUrl: 'http://www.streambox.fr/playlists/x36xhzz/',
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '22'),
  }
  const res = await graphql(LivepeerSchema, query, null, null, params)
  console.log(JSON.stringify(res, null, 2))
  t.pass()
})
