import test from 'ava'
import { EMPTY_ADDRESS, TRANSCODER_STATUS } from '@livepeer/sdk'
import * as resolvers from './Transcoder'

test('Transcoder resolves fields', async t => {
  const obj = {
    id: EMPTY_ADDRESS.replace(/00/g, '11'),
    active: false,
    status: TRANSCODER_STATUS.NotRegistered,
    lastRewardRound: '0',
    blockRewardCut: '0',
    feeShare: '0',
    pricePerSegment: '0',
    pendingBlockRewardCut: '0',
    pendingFeeShare: '0',
    pendingPricePerSegment: '0',
    totalStake: '0',
  }
  const args = null
  const ctx = {}
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await resolvers[key](obj, args, ctx)
    t.deepEqual(val, result)
  }
})
