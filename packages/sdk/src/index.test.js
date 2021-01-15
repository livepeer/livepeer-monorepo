import test from "ava";
import * as yup from "yup";
import Livepeer, { utils, initContracts } from "./index";
import { AsyncSubject } from "rxjs";

// clears console
// console.log('\x1Bc')

/**
 * Type validators
 */

const boolean = yup.boolean();
const number = yup.number().required().required();
const string = yup.string().strict().required();
const object = (x) => yup.object().shape(x);
const array = (x) => yup.array().of(x);
const oneOf = (x) => yup.mixed().oneOf(x);

/**
 * Pre-test
 */

let livepeer;

test.beforeEach(async (t) => {
  // create new sdk instance before each test
  livepeer = await Livepeer();
});

/**
 * Run tests
 */

// utils

test("should serialize profiles", (t) => {
  const a = utils.serializeTranscodingProfiles(["P720p60fps16x9"]);
  const b = utils.serializeTranscodingProfiles(["foo"]);
  t.is("a7ac137a", a);
  t.is("d435c53a", b);
});

// sdk snapshots

test("should initialize contracts", async (t) => {
  const { contracts } = await initContracts();
  const snap = Object.keys(contracts).reduce((a, b) => {
    const c = {
      ...a,
    };
    // constantly changes, so set to 0 for snapshot purposes
    c[b].query.rpc.idCounter = 0;
    return c;
  }, contracts);
  // TODO: unskip once contract schema is stable
  // t.skip.snapshot(snap)
  t.pass();
});

test("should initialize SDK", async (t) => {
  const { rpc } = await Livepeer();
  // TODO: unskip once sdk rpc is stable
  // t.skip.snapshot(rpc)
  t.pass();
});

// Bonding Manager

test("should get unbonding period", async (t) => {
  const res = await livepeer.rpc.getUnbondingPeriod();
  t.true(string.isValidSync(res));
});

test("should get maximum earning for claims rounds", async (t) => {
  const res = await livepeer.rpc.getMaxEarningsClaimsRounds();
  t.true(string.isValidSync(res));
});

test("should get total bonded", async (t) => {
  const res = await livepeer.rpc.getTotalBonded();
  t.true(string.isValidSync(res));
});

test("should get transcoder pool max size", async (t) => {
  const res = await livepeer.rpc.getTranscoderPoolMaxSize();
  t.true(string.isValidSync(res));
});

// ENS

test("should get ENS for ETH address", async (t) => {
  const res = await livepeer.rpc.getENSName(
    "0x96b20f67309a0750b3fc3dcbe989f347167482ff"
  );
  t.true(string.isValidSync(res));
});

test("should get empty string when no ENS name address", async (t) => {
  const res = await livepeer.rpc.getENSName(
    "0x0000000000000000000000000000000000000000"
  );
  t.true("" === res);
});

test("should get ETH address for ENS name", async (t) => {
  const res = await livepeer.rpc.getENSAddress("please.buymecoffee.eth");
  t.true(string.isValidSync(res));
});

test("should get empty string for nonexistent ENS name", async (t) => {
  const res = await livepeer.rpc.getENSAddress("donot.buymecoffee.eth");
  t.true("" === res);
});

// ETH

test("should get ETH balance", async (t) => {
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getEthBalance(from);
  t.true(string.isValidSync(res));
});

// Minter

test("should return a number from getInflation()", async (t) => {
  const res = await livepeer.rpc.getInflation();
  t.true(string.isValidSync(res));
});

test("should return a number from getInflationChange()", async (t) => {
  const res = await livepeer.rpc.getInflationChange();
  t.true(string.isValidSync(res));
});

// Token

test("should return a number from getTokenTotalSupply()", async (t) => {
  const res = await livepeer.rpc.getTokenTotalSupply();
  t.true(string.isValidSync(res));
});

test("should return a number from getTokenBalance()", async (t) => {
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getTokenBalance(from);
  t.true(string.isValidSync(res));
});

test("should return object with correct shape from getTokenInfo()", async (t) => {
  const schema = object({
    totalSupply: string,
    balance: string,
  });
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getTokenInfo(from);
  schema.validateSync(res);
  t.pass();
});

// Faucet

test("should return object with correct shape from getFaucetInfo()", async (t) => {
  const schema = object({
    amount: string,
    wait: string,
    next: string,
  });
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getFaucetInfo(from);
  schema.validateSync(res);
  t.pass();
});

// Block

test("should return object with correct shape from getBlock()", async (t) => {
  const schema = object({
    number: string,
    hash: string,
    parentHash: string,
    nonce: string,
    sha3Uncles: string,
    logsBloom: string,
    transactionsRoot: string,
    stateRoot: string,
    receiptsRoot: string,
    miner: string,
    mixHash: string,
    difficulty: string,
    totalDifficulty: string,
    extraData: string,
    size: string,
    gasLimit: string,
    gasUsed: string,
    timestamp: number,
    transactions: array(object({})),
    transactionsRoot: string,
    uncles: array(string),
  });
  const res = await livepeer.rpc.getBlock("latest");
  schema.validateSync(res);
  t.pass();
});

// Delgator

test("should return object with correct shape from getDelegator()", async (t) => {
  const schema = object({
    allowance: string,
    address: string,
    bondedAmount: string,
    delegateAddress: yup.string(), // can be empty ('')
    delegatedAmount: string,
    fees: string,
    lastClaimRound: string,
    pendingStake: string,
    pendingFees: string,
    startRound: string,
    status: oneOf(livepeer.constants.DELEGATOR_STATUS),
    withdrawAmount: string,
    withdrawRound: string,
    nextUnbondingLockId: string,
  });
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getDelegator("please.buymecoffee.eth");
  schema.validateSync(res);
  t.pass();
});

test("should return object with correct shape from getDelegatorUnbondingLock()", async (t) => {
  const schema = object({
    id: string,
    delegator: string,
    amount: string,
    withdrawRound: string,
  });
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getDelegatorUnbondingLock(from, "0");
  schema.validateSync(res);
  t.pass();
});

test("should return object with correct shape from getDelegatorUnbondingLocks()", async (t) => {
  const schema = array(
    object({
      id: string,
      delegator: string,
      amount: string,
      withdrawRound: string,
    })
  );
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getDelegatorUnbondingLocks(from);
  schema.validateSync(res);
  t.pass();
});

// Transcoder

test("should return object with correct shape from getTranscoder()", async (t) => {
  const schema = object({
    address: string,
    feeShare: string, // %
    lastRewardRound: string,
    lastActiveStakeUpdateRound: string,
    activationRound: string,
    deactivationRound: string,
    totalStake: string,
    rewardCut: string, // %
  });
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getTranscoder(from);
  schema.validateSync(res);
  t.pass();
});

// Rounds

test("should return object with correct shape from getCurrentRoundInfo()", async (t) => {
  const schema = object({
    id: string,
    initialized: boolean,
    startBlock: string,
    lastInitializedRound: string,
    length: string,
  });
  const { from } = livepeer.config.defaultTx;
  const res = await livepeer.rpc.getCurrentRoundInfo(from);
  schema.validateSync(res);
  t.pass();
});

// Protocol

test("should return object with correct shape from getProtocol()", async (t) => {
  const schema = object({
    paused: boolean,
    totalTokenSupply: string,
    totalBondedToken: string,
    targetBondingRate: string,
    transcoderPoolMaxSize: string,
    maxEarningsClaimsRounds: string,
  });
  const res = await livepeer.rpc.getProtocol();
  schema.validateSync(res);
  t.pass();
});

// Minter

test("should return target bonding rate", async (t) => {
  const res = await livepeer.rpc.getTargetBondingRate();
  t.true(string.isValidSync(res));
});
