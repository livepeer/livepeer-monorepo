import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { integer } from "@protofire/subgraph-toolkit";
import {
  Day,
  Delegator,
  Protocol,
  Round,
  Transcoder,
  TranscoderDay,
} from "../src/types/schema";

let x = BigInt.fromI32(2);
let y = <u8>255;
let z = BigInt.fromI32(1);

export let MAXIMUM_VALUE_UINT256: BigInt = x.pow(y).minus(z);
export let EMPTY_ADDRESS = Address.fromString(
  "0000000000000000000000000000000000000000"
);
export let PERC_DIVISOR = 1000000;

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

// Make a number the specified number of digits
export function leftPad(str: string, size: i32): string {
  while (str.length < size) {
    str = "0" + str;
  }
  return str;
}

// Make a derived pool ID from a transcoder address
export function makePoolId(transcoderAddress: string, roundId: string): string {
  return leftPad(roundId, 10) + "-" + transcoderAddress;
}

// Make a derived share ID from a delegator address
export function makeShareId(delegatorAddress: string, roundId: string): string {
  return leftPad(roundId, 10) + "-" + delegatorAddress;
}

// Make a vote id
export function makeVoteId(
  delegatorAddress: string,
  pollAddress: string
): string {
  return delegatorAddress + "-" + pollAddress;
}

// Make a derived unlocking ID from a delegator address
export function makeUnbondingLockId(
  delegatorAddress: Address,
  unbondingLockId: BigInt
): string {
  return (
    leftPad(unbondingLockId.toString(), 10) + "-" + delegatorAddress.toHex()
  );
}

export function makeEventId(hash: Bytes, index: BigInt): string {
  return hash.toHex() + "-" + index.toString();
}

export function percOfWithDenom(
  _amount: BigInt,
  _fracNum: BigInt,
  _fracDenom: BigInt
): BigInt {
  return _amount
    .times(percPoints(_fracNum, _fracDenom))
    .div(BigInt.fromI32(PERC_DIVISOR));
}

export function percOf(_amount: BigInt, _fracNum: BigInt): BigInt {
  return _amount.times(_fracNum).div(BigInt.fromI32(PERC_DIVISOR));
}

export function percPoints(_fracNum: BigInt, _fracDenom: BigInt): BigInt {
  return _fracNum.times(BigInt.fromI32(PERC_DIVISOR)).div(_fracDenom);
}

export function getBondingManagerAddress(network: string): string {
  if (network == "mainnet") {
    return "511bc4556d823ae99630ae8de28b9b80df90ea2e";
  } else if (network == "rinkeby") {
    return "e75a5DccfFe8939F7f16CC7f63EB252bB542FE95";
  } else {
    return "A94B7f0465E98609391C623d0560C5720a3f2D33";
  }
}

export function getLivepeerTokenAddress(network: string): string {
  if (network == "mainnet") {
    return "58b6a8a3302369daec383334672404ee733ab239";
  } else if (network == "rinkeby") {
    return "23b814a57D53b1a7A860194F53401D0D639abED7";
  } else {
    return "D833215cBcc3f914bD1C9ece3EE7BF8B14f841bb";
  }
}

export function getUniswapV1DaiEthExchangeAddress(): string {
  return "2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667";
}

export function getUniswapV2DaiEthPairAddress(): string {
  return "a478c2975ab1ea89e8196811f51a7b7ade33eb11";
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function convertToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(BI_18));
}

export function createOrLoadProtocol(): Protocol {
  let protocol = Protocol.load("0");
  if (protocol == null) {
    protocol = new Protocol("0");
    protocol.currentRound = ZERO_BI.toString();
    protocol.lastInitializedRound = ZERO_BI.toString();
    protocol.lastRoundLengthUpdateRound = ZERO_BI.toString();
    protocol.inflation = ZERO_BI;
    protocol.inflationChange = ZERO_BI;
    protocol.lastRoundLengthUpdateStartBlock = ZERO_BI;
    protocol.lockPeriod = ZERO_BI;
    protocol.maxEarningsClaimsRounds = ZERO_BI;
    protocol.numActiveTranscoders = ZERO_BI;
    protocol.paused = false;
    protocol.roundCount = ZERO_BI;
    protocol.roundLength = ZERO_BI;
    protocol.roundLockAmount = ZERO_BI;
    protocol.targetBondingRate = ZERO_BI;
    protocol.totalActiveStake = ZERO_BD;
    protocol.totalSupply = ZERO_BD;
    protocol.participationRate = ZERO_BD;
    protocol.totalVolumeETH = ZERO_BD;
    protocol.totalVolumeUSD = ZERO_BD;
    protocol.totalWinningTickets = ZERO_BI;
    protocol.unbondingPeriod = ZERO_BI;
    protocol.save();
  }
  return protocol as Protocol;
}

export function createOrLoadTranscoder(id: string): Transcoder {
  let transcoder = Transcoder.load(id);
  if (transcoder == null) {
    transcoder = new Transcoder(id);
    transcoder.activationRound = ZERO_BI;
    transcoder.deactivationRound = ZERO_BI;
    transcoder.lastActiveStakeUpdateRound = ZERO_BI;
    transcoder.active = false;
    transcoder.status = "NotRegistered";
    transcoder.lastRewardRound = ZERO_BI.toString();
    transcoder.rewardCut = ZERO_BI;
    transcoder.feeShare = ZERO_BI;
    transcoder.pricePerSegment = ZERO_BI;
    transcoder.pendingPricePerSegment = ZERO_BI;
    transcoder.pendingRewardCut = ZERO_BI;
    transcoder.pendingFeeShare = ZERO_BI;
    transcoder.totalStake = ZERO_BD;
    transcoder.totalVolumeETH = ZERO_BD;
    transcoder.totalVolumeUSD = ZERO_BD;
    transcoder.save();
  }
  return transcoder as Transcoder;
}

export function createOrLoadDelegator(id: string): Delegator {
  let delegator = Delegator.load(id);
  if (delegator == null) {
    delegator = new Delegator(id);
    delegator.startRound = ZERO_BI;
    delegator.lastClaimRound = ZERO_BI.toString();
    delegator.bondedAmount = ZERO_BD;
    delegator.principal = ZERO_BD;
    delegator.unbonded = ZERO_BD;
    delegator.fees = ZERO_BD;
    delegator.withdrawnFees = ZERO_BD;
    delegator.delegatedAmount = ZERO_BD;
    delegator.save();
  }
  return delegator as Delegator;
}

export function createOrLoadDay(timestamp: i32): Day {
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let day = Day.load(dayID.toString());

  if (day == null) {
    day = new Day(dayID.toString());
    day.date = dayStartTimestamp;
    day.volumeUSD = ZERO_BD;
    day.volumeETH = ZERO_BD;
    day.totalSupply = ZERO_BD;
    day.totalActiveStake = ZERO_BD;
    day.participationRate = ZERO_BD;
    day.save();
  }
  return day as Day;
}

export function createOrLoadTranscoderDay(
  timestamp: i32,
  transcoderAddress: string
): TranscoderDay {
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let transcoderDayID = transcoderAddress
    .concat("-")
    .concat(BigInt.fromI32(dayID).toString());
  let transcoderDay = TranscoderDay.load(transcoderDayID);

  if (transcoderDay == null) {
    transcoderDay = new TranscoderDay(transcoderDayID);
    transcoderDay.date = dayStartTimestamp;
    transcoderDay.transcoder = transcoderAddress;
    transcoderDay.volumeUSD = ZERO_BD;
    transcoderDay.volumeETH = ZERO_BD;
    transcoderDay.save();
  }
  return transcoderDay as TranscoderDay;
}

export function createOrLoadRound(blockNumber: BigInt): Round {
  let protocol = Protocol.load("0");
  let roundsSinceLastUpdate = blockNumber
    .minus(protocol.lastRoundLengthUpdateStartBlock)
    .div(protocol.roundLength);
  let round: Round;

  // true if we need to create
  // it is checking if at least 1 round has passed since the last creation
  let needsCreating = roundsSinceLastUpdate.gt(
    integer
      .fromString(protocol.currentRound)
      .minus(integer.fromString(protocol.lastRoundLengthUpdateRound))
  );

  if (needsCreating) {
    let newRound = integer
      .fromString(protocol.lastRoundLengthUpdateRound)
      .plus(roundsSinceLastUpdate);

    // Need to get the start block according to the contracts, not just the start block this
    // entity was created in the subgraph
    let startBlock = protocol.lastRoundLengthUpdateStartBlock.plus(
      roundsSinceLastUpdate.times(protocol.roundLength)
    );
    round = createRound(startBlock, protocol.roundLength, newRound);
    protocol.roundCount = protocol.roundCount.plus(BigInt.fromI32(1));
    protocol.currentRound = newRound.toString();
    protocol.save();

    // If there is no need to create a new round, just return the current one
  } else {
    round = Round.load(protocol.currentRound) as Round;
  }
  return round;
}

export function createRound(
  startBlock: BigInt,
  roundLength: BigInt,
  roundNumber: BigInt
): Round {
  let protocol = Protocol.load("0");
  let round = new Round(roundNumber.toString());
  round.startBlock = startBlock;
  round.endBlock = startBlock.plus(roundLength);
  round.initialized = false;
  round.length = roundLength;
  round.startBlock = startBlock;
  round.totalActiveStake = protocol.totalActiveStake;
  round.totalSupply = protocol.totalSupply;
  round.participationRate = protocol.participationRate;
  round.mintableTokens = ZERO_BD;
  round.volumeETH = ZERO_BD;
  round.volumeUSD = ZERO_BD;
  round.movedStake = ZERO_BD;
  round.newStake = ZERO_BD;
  round.save();
  return round;
}
