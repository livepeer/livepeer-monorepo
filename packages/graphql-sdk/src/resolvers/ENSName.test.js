import test from 'ava'
import * as resolvers from './ENSName'

test('ENSName resolves fields', async t => {
  const obj = {
    id: 'foo.test',
    account: {
      id: '0xf00',
    },
  }
  const args = null
  const ctx = {
    livepeer: {
      rpc: {
        getENSNameAddress: () => obj.account.id,
      },
    },
  }

  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
