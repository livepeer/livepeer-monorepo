import test from 'ava'
import {
  DELEGATOR_STATUS,
  EMPTY_ADDRESS,
  TRANSCODER_STATUS,
  VIDEO_PROFILES,
} from '@livepeer/sdk'
import * as resolvers from './Query'
import { transformJob } from '../utils'

test('Query resolves `ensName` field', async t => {
  const obj = {
    id: 'foo',
  }
  const args = {
    id: obj.id,
  }
  const ctx = {}
  const result = await resolvers.ensName(obj, args, ctx)
  t.deepEqual(obj, result)
})

test('Query resolves `account` field', async t => {
  const obj = {
    id: 'foo',
  }
  const args = {
    id: obj.id,
  }
  const ctx = {}
  const result = await resolvers.account(obj, args, ctx)
  t.deepEqual(obj, result)
})

test('Query resolves `broadcaster` field', async t => {
  const obj = {
    id: 'foo',
    deposit: '0',
    withdrawBlock: '0',
  }
  const args = {
    id: obj.id,
  }
  const ctx = {
    livepeer: {
      rpc: {
        getBroadcaster: () => obj,
      },
    },
  }
  const result = await resolvers.broadcaster(obj, args, ctx)
  t.deepEqual(obj, result)
})

test('Query resolves `delegator` field', async t => {
  const obj = {
    id: EMPTY_ADDRESS.replace(/00/g, '11'),
    status: DELEGATOR_STATUS.Unbonded,
    stake: '0',
    bondedAmount: '0',
    unbondedAmount: '0',
    delegateAddress: EMPTY_ADDRESS.replace(/00/g, '22'),
    delegatedAmount: '0',
    lastClaimRound: '0',
    startRound: '0',
    withdrawRound: '0',
    delegate: {},
  }
  const args = {
    id: obj.id,
  }
  const ctx = {
    livepeer: {
      rpc: {
        getDelegator: () => obj,
      },
    },
  }
  const result = await resolvers.delegator(obj, args, ctx)
  t.deepEqual(obj, result)
})

test('Query resolves `job` field', async t => {
  const job = {
    jobId: '0',
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '11'),
    transcodingOptions: [VIDEO_PROFILES.P144p30fps16x9],
    streamId: 'bar',
  }
  const obj = {
    id: job.id,
  }
  const args = {
    id: obj.id,
  }
  const ctx = {
    livepeer: {
      rpc: {
        getJob: () => job,
      },
    },
  }
  const result = await resolvers.job(obj, args, ctx)
  t.deepEqual(transformJob(job), result)
})

test('Query resolves `jobs` field', async t => {
  const jobs = Array(3)
    .fill({
      jobId: '0',
      broadcaster: EMPTY_ADDRESS,
      transcodingOptions: [VIDEO_PROFILES.P144p30fps16x9],
      streamId: 'bar',
    })
    .map((x, i) => ({
      ...x,
      jobId: i,
      broadcaster: x.broadcaster.replace(/00/g, `${i + 1}${i + 1}`),
    }))
    .reverse()
  const ctx = {
    livepeer: {
      rpc: {
        getJobs: ({ broadcaster, skip, limit }) => {
          return jobs.filter(x => {
            return !broadcaster || x.broadcaster === broadcaster
          })
        },
      },
    },
  }
  // gets all jobs
  {
    const obj = {}
    const args = {}
    const result = await resolvers.jobs(obj, args, ctx)
    const expected = jobs.map(transformJob)
    t.deepEqual(expected, result)
  }
  // gets jobs by broadcaster
  {
    const obj = {}
    const args = {
      broadcaster: EMPTY_ADDRESS.replace(/00/g, '33'),
    }
    const result = await resolvers.jobs(obj, args, ctx)
    const expected = [jobs[0]].map(transformJob)
    t.deepEqual(expected, result)
  }
  // gets jobs with skip arg
  {
    const obj = {}
    const args = {
      skip: 1,
    }
    const result = await resolvers.jobs(obj, args, ctx)
    const expected = [jobs[1], jobs[2]].map(transformJob)
    t.deepEqual(expected, result)
  }
  // gets jobs with limit arg
  {
    const obj = {}
    const args = {
      limit: 1,
    }
    const result = await resolvers.jobs(obj, args, ctx)
    const expected = [jobs[0]].map(transformJob)
    t.deepEqual(expected, result)
  }
  // gets jobs with skip and limit args
  {
    const obj = {}
    const args = {
      skip: 1,
      limit: 1,
    }
    const result = await resolvers.jobs(obj, args, ctx)
    const expected = [jobs[1]].map(transformJob)
    t.deepEqual(expected, result)
  }
})

test('Query resolves `me` field', async t => {
  const obj = {
    id: 'foo',
  }
  const args = {
    id: obj.id,
  }
  const ctx = {
    account: obj.id,
  }
  const result = await resolvers.me(obj, args, ctx)
  t.deepEqual(obj, result)
})

test('Query resolves `currentRound` field', async t => {
  const obj = {
    id: '100',
    initialized: false,
    lastInitializedRound: '99',
    length: '50',
  }
  const args = {}
  const ctx = {
    livepeer: {
      rpc: {
        getCurrentRoundInfo: () => obj,
      },
    },
  }
  const result = await resolvers.currentRound(obj, args, ctx)
  t.deepEqual(obj, result)
})

test('Query resolves `transcoder` field', async t => {
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
  const args = {
    id: obj.id,
  }
  const ctx = {
    livepeer: {
      rpc: {
        getTranscoder: () => obj,
      },
    },
  }
  const result = await resolvers.transcoder(obj, args, ctx)
  t.deepEqual(obj, result)
})

test.todo('Query resolves `transcoders` field')
