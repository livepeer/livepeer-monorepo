import test from 'ava'
import Broadcaster from './index'

test('Broadcaster resolves fields', async t => {
  const obj = {
    id: 'foo',
    deposit: '0',
    withdrawBlock: '0',
  }
  const args = null
  const ctx = {}
  const fields = Broadcaster._typeConfig.fields()
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await fields[key].resolve(obj, args, ctx)
    t.deepEqual(val, result)
  }
})
