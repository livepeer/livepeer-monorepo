import test from 'ava'
import AccountType from './index'

test('AccountType resolves fields', async t => {
  const obj = {
    id: '0xf00',
    ethBalance: '0',
    tokenBalance: '0',
    broadcaster: {
      id: '0xf00',
    },
    delegator: {
      id: '0xf00',
    },
    transcoder: {
      id: '0xf00',
    },
  }
  const args = null
  const ctx = {
    livepeer: {
      rpc: {
        getEthBalance: () => '0',
        getTokenBalance: () => '0',
        getBroadcaster: () => ({
          id: obj.id,
        }),
        getDelegator: () => ({
          id: obj.id,
        }),
        getTranscoder: () => ({
          id: obj.id,
        }),
      },
    },
  }
  const fields = AccountType._typeConfig.fields()
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await fields[key].resolve(obj, args, ctx)
    t.deepEqual(val, result)
  }
})
