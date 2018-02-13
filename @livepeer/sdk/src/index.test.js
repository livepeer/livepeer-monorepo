import 'babel-polyfill'
import test from 'ava'
import yup from 'yup'
import Livepeer, { utils, initContracts } from './index'

// clears console
// console.log('\x1Bc')

/**
 * Type validators
 */

const boolean = yup.boolean()
const number = yup
  .number()
  .required()
  .required()
const string = yup
  .string()
  .strict()
  .required()
const object = x => yup.object().shape(x)
const array = x => yup.array().of(x)
const oneOf = x => yup.mixed().oneOf(x)

/**
 * Pre-test
 */

let livepeer

test.before(async t => {
  // create new sdk instance before each test
  livepeer = await Livepeer()
})

/**
 * Run tests
 */

// utils

test('should serialize profiles', t => {
  const a = utils.serializeTranscodingProfiles(['P720p60fps16x9'])
  const b = utils.serializeTranscodingProfiles(['foo'])
  t.is('a7ac137a', a)
  t.is('d435c53a', b)
})

// sdk snapshots

test('should initialize contracts', async t => {
  const { contracts } = await initContracts()
  const snap = Object.keys(contracts).reduce((a, b) => {
    const c = { ...a }
    // constantly changes, so set to 0 for snapshot purposes
    c[b].query.rpc.idCounter = 0
    return c
  }, contracts)
  // @TODO - unskip once contract schema is stable
  t.skip.snapshot(snap)
})

test('should initialize SDK', async t => {
  const { rpc } = await Livepeer()
  // @TODO - unskip once sdk rpc is stable
  t.skip.snapshot(rpc)
})

// ETH

test('should get ETH balance', async t => {
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getEthBalance(from)
  t.true(string.isValidSync(res))
})

// Token

test('should return a number from getTokenTotalSupply()', async t => {
  const res = await livepeer.rpc.getTokenTotalSupply()
  t.true(string.isValidSync(res))
})

test('should return a number from getTokenBalance()', async t => {
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getTokenBalance(from)
  t.true(string.isValidSync(res))
})

test('should return object with correct shape from getTokenInfo()', async t => {
  const schema = object({
    totalSupply: string,
    balance: string,
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getTokenInfo(from)
  schema.validateSync(res)
  t.pass()
})

// Faucet

test('should return object with correct shape from getFaucetInfo()', async t => {
  const schema = object({
    amount: string,
    wait: string,
    next: string,
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getFaucetInfo(from)
  schema.validateSync(res)
  t.pass()
})

// Broadcaster

test('should return object with correct shape from getBroadcaster()', async t => {
  const schema = object({
    deposit: string,
    withdrawBlock: string,
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getBroadcaster(from)
  schema.validateSync(res)
  t.pass()
})

// Delgator

test('should return object with correct shape from getDelegator()', async t => {
  const schema = object({
    address: string,
    bondedAmount: string,
    delegateAddress: yup.string(), // can be empty ('')
    delegatedAmount: string,
    fees: string,
    lastClaimRound: string,
    startRound: string,
    status: oneOf(livepeer.constants.DELEGATOR_STATUS),
    withdrawRound: string,
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getDelegator(from)
  schema.validateSync(res)
  t.pass()
})

// Transcoder

test('should return object with correct shape from getTranscoder()', async t => {
  const schema = object({
    active: boolean,
    address: string,
    status: oneOf(livepeer.constants.TRANSCODER_STATUS),
    lastRewardRound: string,
    blockRewardCut: string, // %
    feeShare: string, // %
    pricePerSegment: string,
    pendingBlockRewardCut: string, // %
    pendingFeeShare: string, // %
    pendingPricePerSegment: string,
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getTranscoder(from)
  schema.validateSync(res)
  t.pass()
})

// Rounds

test('should return object with correct shape from getCurrentRoundInfo()', async t => {
  const schema = object({
    number: string,
    initialized: boolean,
    startBlock: string,
    lastInitializedRound: string,
    length: string,
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getCurrentRoundInfo(from)
  schema.validateSync(res)
  t.pass()
})

// Jobs

test('should return object with correct shape from getJobsInfo()', async t => {
  const schema = object({
    total: string,
    verificationRate: string,
    verificationPeriod: string,
    slashingPeriod: string,
    finderFee: string,
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getJobsInfo(from)
  schema.validateSync(res)
  t.pass()
})

test('should get many jobs from getJobs()', async t => {
  const schema = object({
    id: string,
    streamId: string,
    transcodingOptions: array(
      object({
        name: string,
        bitrate: string,
        framerate: yup
          .number()
          .positive()
          .required(),
        resolution: string,
      }),
    ),
    broadcaster: string,
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getJobs()
  res.forEach(x => schema.validateSync(x))
  t.pass()
})
