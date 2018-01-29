import test from 'ava'
import { VIDEO_PROFILES } from '@livepeer/sdk'
import * as resolvers from './JobProfile'

test('JobProfile resolves fields', async t => {
  const { hash, ...obj } = VIDEO_PROFILES.P144p30fps16x9
  obj.id = hash
  obj.name = 'P144p30fps16x9'
  const args = null
  const ctx = {}
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
