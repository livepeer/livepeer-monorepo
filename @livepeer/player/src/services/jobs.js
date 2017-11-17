export const name = 'jobs'

export const types = {
  GET_JOBS_BY_CHANNEL_REQUEST: `@@${name}/GET_JOBS_BY_CHANNEL_REQUEST`,
  GET_JOBS_BY_CHANNEL_SUCCESS: `@@${name}/GET_JOBS_BY_CHANNEL_SUCCESS`,
  GET_JOBS_BY_CHANNEL_FAILURE: `@@${name}/GET_JOBS_BY_CHANNEL_FAILURE`,
  GET_JOBS_BY_BROADCASTER_REQUEST: `@@${name}/GET_JOBS_BY_BROADCASTER_REQUEST`,
  GET_JOBS_BY_BROADCASTER_SUCCESS: `@@${name}/GET_JOBS_BY_BROADCASTER_SUCCESS`,
  GET_JOBS_BY_BROADCASTER_FAILURE: `@@${name}/GET_JOBS_BY_BROADCASTER_FAILURE`,
}

export const actions = {
  getJobsByChannel: channel => {
    if (!channel) throw new Error('Missing required param channel (string)')
    return {
      type: types.GET_JOBS_BY_CHANNEL_REQUEST,
      payload: {
        channel,
      },
    }
  },
  getJobsByBroadcaster: broadcaster => {
    if (!broadcaster)
      throw new Error('Missing required param broadcaster (string)')
    return {
      type: types.GET_JOBS_BY_BROADCASTER_REQUEST,
      payload: {
        broadcaster,
      },
    }
  },
}

export const initialState = {
  '0': {
    jobId: 0,
    broadcaster: '0xdc7ea0746dc164fa42bfdaecdf24b8070d459b4a',
    channel: '1',
    live: true,
    snapshots: ['http://placehold.it/1024x576'],
    streamId: 'x36xhzz',
    transcoder: '0xa6663807b5f972ec1459387397554a9384d25b66',
    transcodingOptions: [
      {
        name: 'P720p60fps16x9',
        bitrate: '600k',
        framerate: 60,
        resolution: '1280x720',
        hash: 'a7ac137a',
      },
    ],
  },
  '1': {
    jobId: 1,
    broadcaster: '0xdc7ea0746dc164fa42bfdaecdf24b8070d459b4a',
    channel: '2',
    live: true,
    snapshots: ['http://placehold.it/1024x576'],
    streamId: 'aaaaaaaaa',
    transcoder: '0xa6663807b5f972ec1459387397554a9384d25b66',
    transcodingOptions: [
      {
        name: 'P720p60fps16x9',
        bitrate: '600k',
        framerate: 60,
        resolution: '1280x720',
        hash: 'a7ac137a',
      },
    ],
  },
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const selectors = {
  getJobs: state => Object.values(state.jobs),
  getLiveJobs: state => Object.values(state.jobs).filter(x => x.live),
  getLiveJobsByChannel: channel => state =>
    Object.values(state.jobs).filter(x => x.live && x.channel === `${channel}`), // Job[]
  getLiveJobsByBroadcaster: broadcaster => state =>
    Object.values(state.jobs).filter(
      x => x.live && x.broadcaster === broadcaster,
    ), // Job[]
}

export default reducers => ({ ...reducers, [name]: reducer })
