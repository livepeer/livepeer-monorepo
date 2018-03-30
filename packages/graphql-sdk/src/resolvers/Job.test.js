import test from 'ava'
import { EMPTY_ADDRESS, VIDEO_PROFILES } from '@livepeer/sdk'
import * as resolvers from './Job'

test('Job resolves fields', async t => {
  const obj = {
    id: '0',
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '11'),
    profiles: [VIDEO_PROFILES.P144p30fps16x9],
    streamId: 'bar',
  }
  const args = null
  const ctx = {}
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
