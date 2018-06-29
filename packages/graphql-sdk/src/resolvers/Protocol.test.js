import test from 'ava'
import * as resolvers from './Protocol'

test('Protocol resolved fields', async t => {
  const obj = {
    id: '1',
    paused: true,
    totalTokenSupply: '0',
    totalBondedToken: '0',
    targetBondingRate: '0',
    transcoderPoolMaxSize: '0',
  }
  const args = {}
  const ctx = {}
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
