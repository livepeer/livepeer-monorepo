import 'babel-polyfill'
import test from 'ava'
import yup from 'yup'
import Livepeer, { utils, initContracts } from './index'

// clears console
console.log('\x1Bc')

// yup's integer validation is broken
// see https://github.com/jquense/yup/issues/50
class Int extends yup.number {
  _typeCheck(value) {
    return Number.isInteger(value)
  }
}

const int256 = new Int().positive()

let livepeer

test.before(async t => {
  livepeer = await Livepeer()
})

test('should serialize profiles', t => {
  const a = utils.serializeTranscodingProfiles(['P720p60fps16x9'])
  const b = utils.serializeTranscodingProfiles(['foo'])
  t.is('a7ac137a', a)
  t.is('d435c53a', b)
})

test('should initialize contracts', async t => {
  const { contracts } = await initContracts()
  const snap = Object.keys(contracts).reduce((a, b) => {
    const c = { ...a }
    // constantly changes, so set to 0 for snapshot purposes
    c[b].query.rpc.idCounter = 0
    return c
  }, contracts)
  t.skip.snapshot(snap)
})

test('should initialize SDK', async t => {
  const { rpc } = await Livepeer()
  // @TODO - unskip next line once SDK rpc is fully implemented
  t.skip.snapshot(rpc)
})

// Token

test('should return a number from getTokenTotalSupply()', async t => {
  const x = await livepeer.rpc.getTokenTotalSupply()
  t.true(Number.isInteger(x))
})

test('should return a number from getTokenBalance()', async t => {
  const { from } = livepeer.config.defaultTx
  const x = await livepeer.rpc.getTokenBalance(from)
  t.true(Number.isInteger(x))
})

test('should return object with correct shape from getTokenInfo()', async t => {
  const { from } = livepeer.config.defaultTx
  const { totalSupply, balance } = await livepeer.rpc.getTokenInfo(from)
  t.true(Number.isInteger(totalSupply))
  t.true(Number.isInteger(balance))
})

// Faucet

test('should return object with correct shape from getFaucetInfo()', async t => {
  const schema = yup.object().shape({
    amount: int256.required(),
    tapRate: int256.required(),
    tapAt: int256.required(),
    tapIn: int256.required(),
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getFaucetInfo(from)
  schema.validateSync(res)
  t.pass()
})

// Broadcaster

test('should return object with correct shape from getBroadcaster()', async t => {
  const schema = yup.object().shape({
    deposit: int256.required(),
    withdrawBlock: int256.nullable(),
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getBroadcaster(from)
  schema.validateSync(res)
  t.pass()
})

// Delgator

test('should return object with correct shape from getDelegator()', async t => {
  const schema = yup.object().shape({
    address: yup.string(),
    status: yup.string().oneOf(livepeer.constants.DELEGATOR_STATUS),
    delegateAddress: yup.string(),
    bondedAmount: int256.required(),
    unbondedAmount: int256.required(),
    delegateStake: int256.nullable(),
    lastClaimRound: int256.nullable(),
    startRound: int256.nullable(),
    withdrawRound: int256.nullable(),
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getDelegator(from)
  schema.validateSync(res)
  t.pass()
})

// Transcoder

test('should return object with correct shape from getTranscoder()', async t => {
  const schema = yup.object().shape({
    active: yup.boolean(),
    address: yup.string(),
    status: yup.string().oneOf(livepeer.constants.TRANSCODER_STATUS),
    delegateStake: int256.nullable(),
    lastRewardRound: int256.nullable(),
    blockRewardCut: int256.nullable(), // %
    feeShare: int256.nullable(), // %
    pricePerSegment: int256.nullable(),
    pendingBlockRewardCut: int256.nullable(), // %
    pendingFeeShare: int256.nullable(), // %
    pendingPricePerSegment: int256.nullable(),
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getTranscoder(from)
  schema.validateSync(res)
  t.pass()
})

// Rounds

test('should return object with correct shape from getRoundInfo()', async t => {
  const schema = yup.object().shape({
    currentRound: int256.nullable(),
    currentRoundInitialized: yup.boolean(),
    currentRoundStartBlock: int256.nullable(),
    lastInitializedRound: int256.nullable(),
    roundLength: int256.nullable(),
    roundsPerYear: int256.nullable(),
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getRoundInfo(from)
  schema.validateSync(res)
  t.pass()
})

// Jobs

test('should return object with correct shape from getJobsInfo()', async t => {
  const schema = yup.object().shape({
    totalJobs: int256.required(),
    verificationRate: int256.nullable(),
    verificationPeriod: int256.nullable(),
    slashingPeriod: int256.nullable(),
    finderFee: int256.nullable(),
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getJobsInfo(from)
  schema.validateSync(res)
  t.pass()
})

test('should get many jobs from getJobs()', async t => {
  const schema = yup.object().shape({
    jobId: int256.required(),
    streamId: yup.string().required(),
    transcodingOptions: yup.array().of(
      yup.object().shape({
        name: yup.string(),
        bitrate: yup.string(),
        framerate: int256.positive().required(),
        resolution: yup.string(),
      }),
    ),
    transcoder: yup.string().required(),
    broadcaster: yup.string().required(),
  })
  const { from } = livepeer.config.defaultTx
  const res = await livepeer.rpc.getJobs()
  res.forEach(x => schema.validateSync(x))
  t.pass()
})
