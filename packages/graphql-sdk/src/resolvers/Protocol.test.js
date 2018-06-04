import test from 'ava'
import * as resolvers from './Protocol'

test('Query resolves `paused` field', async t => {
  const obj = {
    id: 'protocol',
    paused: true,
  }
  const args = {}
  const ctx = {}

  const result = await resolvers.paused(obj, args, ctx)
  t.true(result)
})
