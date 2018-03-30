import test from 'ava'
import * as resolvers from './Broadcaster'

test('Broadcaster resolves fields', async t => {
  const obj = {
    id: 'foo',
    deposit: '0',
    withdrawBlock: '0',
  }
  const args = null
  const ctx = {}
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
