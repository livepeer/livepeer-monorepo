import test from 'ava'
import { graphql } from 'graphql'
import { EMPTY_ADDRESS } from '@livepeer/sdk'
// import { schema } from './index'
import schema from './schema'
import {
  AccountQuery,
  BroadcasterQuery,
  DelegatorQuery,
  JobQuery,
  JobsQuery,
  TranscoderQuery,
  TranscodersQuery,
} from './queries'
import livepeer from './mock-sdk'

// clears console
console.log('\x1Bc')

/**
 * Account
 */

test('AccountQuery', async t => {
  const args = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
  }
  const res = await graphql(schema, AccountQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

/**
 * Broadcaster
 */
test('BroadcasterQuery', async t => {
  const args = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
    jobs: false,
  }
  const res = await graphql(schema, BroadcasterQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('BroadcasterQuery (include jobs)', async t => {
  const args = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
    jobs: true,
  }
  const res = await graphql(schema, BroadcasterQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('BroadcasterQuery (include jobs using skip/limit args)', async t => {
  const args = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
    jobs: true,
    jobsSkip: 1,
    jobsLimit: 1,
  }
  const res = await graphql(schema, BroadcasterQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

/**
 * Delegator
 */
test('DelegatorQuery', async t => {
  const args = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
  }
  const res = await graphql(schema, DelegatorQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

/**
 * Job
 */
test('JobQuery', async t => {
  const args = {
    id: '0',
  }
  const res = await graphql(schema, JobQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

/**
 * Jobs
 */

test('JobsQuery', async t => {
  const args = {}
  const res = await graphql(schema, JobsQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('JobsQuery (broadcaster arg)', async t => {
  const args = {
    broadcaster: EMPTY_ADDRESS.replace(/00/g, '11'),
  }
  const res = await graphql(schema, JobsQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('JobsQuery (skip arg)', async t => {
  const args = {
    skip: 1,
  }
  const res = await graphql(schema, JobsQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('JobsQuery (limit arg)', async t => {
  const args = {
    limit: 1,
  }
  const res = await graphql(schema, JobsQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('JobsQuery (skip / limit args)', async t => {
  const args = {
    skip: 1,
    limit: 3,
  }
  const res = await graphql(schema, JobsQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

/**
 * Transcoder
 */

test('TranscoderQuery', async t => {
  const args = {
    id: EMPTY_ADDRESS.replace(/00/g, '22'),
  }
  const res = await graphql(schema, TranscoderQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('TranscodersQuery', async t => {
  const args = {}
  const res = await graphql(schema, TranscodersQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})
