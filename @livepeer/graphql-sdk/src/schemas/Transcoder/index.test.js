import test from 'ava'
import { EMPTY_ADDRESS, TRANSCODER_STATUS } from '@livepeer/sdk'
import Transcoder from './index'

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
  }
  const args = null
  const ctx = {}
  const fields = Transcoder._typeConfig.fields()
  const entries = Object.entries(obj)
  for (const [key, val] of entries) {
    const result = await fields[key].resolve(obj, args, ctx)
    t.deepEqual(val, result)
  }
})
