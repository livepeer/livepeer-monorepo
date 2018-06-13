import 'cross-fetch/polyfill'
import test from 'ava'
import { graphql, introspectionQuery, parse, subscribe } from 'graphql'
import { EMPTY_ADDRESS } from '@livepeer/sdk'
// import { schema } from './index'
import schema from './schema'
import {
  ENSNameQuery,
  AccountQuery,
  BroadcasterQuery,
  CoinbaseQuery,
  CurrentRoundQuery,
  DelegatorQuery,
  JobQuery,
  JobsQuery,
  TransactionsQuery,
  TranscoderQuery,
  TranscodersQuery,
  ProtocolQuery,
} from './queries'
import livepeer from './mock-sdk'
import { publish, TransactionSubmitted } from './resolvers/Subscription'

// clears console
// console.log('\x1Bc')

test(async t => {
  const res = await graphql(schema, introspectionQuery, null, { livepeer }, {})
  // console.log(res)
  t.pass()
})

test('Subscription', async t => {
  const query = `
    subscription {
      transactionSubmitted {
        id
        contract
        gas
        gasUsed
        gasPrice
        id
        method
        nonce
        params
        status
        timeStamp
      }
    }
  `
  const ast = parse(query)
  const subscription = await subscribe(schema, ast)
  publish(TransactionSubmitted, {
    contract: 'BondingManager',
    gas: '',
    gasUsed: '',
    gasPrice: '',
    id: `${Date.now()}`,
    method: 'claimEarnings',
    nonce: '',
    params: { endRound: 0 },
    status: 'pending',
    timeStamp: `${Math.floor(Date.now() / 1000)}`,
  })
  const res = await subscription.next()
  t.pass()
})

/**
 * ENSName
 */
test('ENSNameQuery', async t => {
  const args = {
    id: 'foo.test',
  }
  const res = await graphql(schema, ENSNameQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
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
test('CoinbaseQuery (not authenticated)', async t => {
  const args = null
  const res = await graphql(schema, CoinbaseQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

test('CoinbaseQuery (authenticated)', async t => {
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
test('CurrentRoundQuery', async t => {
  const args = {}
  const res = await graphql(schema, CurrentRoundQuery, null, { livepeer }, args)
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})

/**
 * Transactions
 */
test('TransactionsQuery', async t => {
  const args = {
    address: '0x0000000000000000000000000000000000000000',
    limit: 2,
    sort: 'desc',
    // this address has 3 txns in this range
    // (1 on 46423, 1 on 46421, and 1 on 46420)
    // this query should return the txns from the two more recent blocks
    startBlock: 46420,
    endBlock: 46423,
  }
  const res = await graphql(
    schema,
    TransactionsQuery,
    null,
    {
      persistor: {
        cache: {
          cache: {
            data: {
              data: {
                ROOT_QUERY: {},
              },
            },
          },
        },
      },
      livepeer: {
        utils: {
          decodeContractInput: x => ({
            ...x,
            contract: '',
            method: '',
            params: {},
          }),
        },
        config: {
          eth: {
            async net_version() {
              return '1'
            },
          },
          contracts: {},
        },
      },
      etherscanApiKey: 'REYGA15N2SCUKVFQKG3C24USKSR8WZB29B',
    },
    args,
  )
  // remove "confirmations" field since it changes frequently
  const transactions = res.data.transactions.map(
    ({ confirmations, ...tx }) => tx,
  )
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot({
    ...res,
    data: {
      ...res.data,
      transactions,
    },
  })
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

/**
 * Protocol
 */
test('ProtocolQuery', async t => {
  const res = await graphql(schema, ProtocolQuery, null, { livepeer }, {})
  // console.log(JSON.stringify(res, null, 2))
  t.snapshot(res)
})
