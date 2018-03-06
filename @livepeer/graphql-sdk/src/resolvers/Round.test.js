import test from 'ava'
import * as resolvers from './Round'

test('Round resolves fields', async t => {
  const obj = {
    id: '100',
    initialized: false,
    lastInitializedRound: '99',
    length: '50',
    startBlock: '12345',
  }
  const args = null
  const ctx = {}
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
