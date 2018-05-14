import test from 'ava'
import { graphql, introspectionQuery } from 'graphql'
import { EMPTY_ADDRESS } from '@livepeer/sdk'
// import { schema } from './index'
import schema from './schema'
import {
  AccountQuery,
  BroadcasterQuery,
  CoinbaseQuery,
  CurrentRoundQuery,
  DelegatorQuery,
  JobQuery,
  JobsQuery,
  TranscoderQuery,
  TranscodersQuery,
} from './queries'
import livepeer from './mock-sdk'

// clears console
// console.log('\x1Bc')

test(async t => {
  const res = await graphql(schema, introspectionQuery, null, { livepeer }, {})
  // console.log(res)
  t.pass()
})

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
 * Coinbase
 */
test.only('CoinbaseQuery (not authenticated)', async t => {
  const args = null
  const res = await graphql(schema, CoinbaseQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test.only('CoinbaseQuery (authenticated)', async t => {
  const args = null
  const res = await graphql(
    schema,
    CoinbaseQuery,
    null,
    { account: '0x0ddb225031ccb58ff42866f82d907f7766899014', livepeer },
    args,
  )
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
 * Round
 */
test.only('CurrentRoundQuery', async t => {
  const args = {}
  const res = await graphql(schema, CurrentRoundQuery, null, { livepeer }, args)
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
