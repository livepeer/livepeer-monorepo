import test from 'ava'
import { VIDEO_PROFILES } from '@livepeer/sdk'
import JobProfile from './index'

test('JobProfile resolves fields', async t => {
  const { hash, ...obj } = VIDEO_PROFILES.P144p30fps16x9
  obj.id = hash
  obj.name = 'P144p30fps16x9'
  const args = null
  const ctx = {}
  const fields = JobProfile._typeConfig.fields()
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await fields[key].resolve(obj, args, ctx)
    t.deepEqual(val, result)
  }
})
