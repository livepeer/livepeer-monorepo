import test from 'ava'
import { EMPTY_ADDRESS, DELEGATOR_STATUS } from '@livepeer/sdk'
import * as resolvers from './Delegator'

test('Delegator resolves fields', async t => {
  const obj = {
    id: EMPTY_ADDRESS.replace(/00/g, '11'),
    status: DELEGATOR_STATUS.Unbonded,
    bondedAmount: '0',
    fees: '0',
    delegateAddress: EMPTY_ADDRESS.replace(/00/g, '22'),
    delegatedAmount: '0',
    lastClaimRound: '0',
    startRound: '0',
    withdrawRound: '0',
  }
  const args = null
  const ctx = {}
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
