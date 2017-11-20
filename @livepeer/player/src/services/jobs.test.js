import { reducer, types } from './jobs'

it('should update a job properly', () => {
  const state = {
    '0': {
      jobId: 0,
      broadcaster: '0xdc7ea0746dc164fa42bfdaecdf24b8070d459b4a',
      channel: '1',
      live: true,
      streamId: 'x36xhzz',
      transcoder: '0xa6663807b5f972ec1459387397554a9384d25b66',
      poster: '',
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
  const action = {
    type: types.UPDATE_JOB,
    payload: {
      jobId: 0,
      poster: 'foo',
    },
  }
  const nextState = {
    ...state,
    '0': {
      ...state[0],
      poster: 'foo',
    },
  }
  expect(reducer(state, action)).toEqual(nextState)
})
