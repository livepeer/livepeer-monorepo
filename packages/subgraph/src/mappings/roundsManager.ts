// Import types and APIs from graph-ts
import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import {
  NewRound,
  ParameterUpdate,
  RoundsManager,
} from "../types/RoundsManager/RoundsManager";

// Import entity types generated from the GraphQL schema
import {
  Transaction,
  Transcoder,
  Pool,
  NewRoundEvent,
  Protocol,
  ParameterUpdateEvent,
} from "../types/schema";

import {
  makePoolId,
  getBondingManagerAddress,
  makeEventId,
  EMPTY_ADDRESS,
  convertToDecimal,
  ZERO_BD,
  createOrLoadDay,
  createOrLoadRound,
  PERC_DIVISOR,
  createRound,
} from "../../utils/helpers";
import { BondingManager } from "../types/BondingManager/BondingManager";

// Handler for NewRound events
export function newRound(event: NewRound): void {
  let bondingManagerAddress = getBondingManagerAddress(dataSource.network());
  let bondingManager = BondingManager.bind(
    Address.fromString(bondingManagerAddress)
  );
  let round = createOrLoadRound(event.block.number);
  let day = createOrLoadDay(event.block.timestamp.toI32());
  let currentTranscoder = bondingManager.getFirstTranscoderInPool();
  let transcoder = Transcoder.load(currentTranscoder.toHex());
  let totalActiveStake = convertToDecimal(bondingManager.getTotalBonded());

  round.initialized = true;
  round.totalActiveStake = totalActiveStake;
  round.save();

  let poolId: string;
  let pool: Pool;

  // Iterate over all active transcoders
  while (EMPTY_ADDRESS.toHex() != currentTranscoder.toHex()) {
    // create a unique "pool" for each active transcoder. If a transcoder calls
    // reward() for a given round, we store its reward tokens inside this Pool
    // entry in a field called "rewardTokens". If "rewardTokens" is null for a
    // given transcoder and round then we know the transcoder failed to call reward()
    poolId = makePoolId(
      currentTranscoder.toHex(),
      event.params.round.toString()
    );
    pool = new Pool(poolId);
    pool.round = event.params.round.toString();
    pool.delegate = currentTranscoder.toHex();
    pool.totalStake = transcoder.totalStake;
    pool.rewardCut = transcoder.rewardCut as BigInt;
    pool.feeShare = transcoder.feeShare as BigInt;

    // Apply store updates
    pool.save();

    currentTranscoder = bondingManager.getNextTranscoderInPool(
      currentTranscoder
    );

    transcoder = Transcoder.load(currentTranscoder.toHex());
  }

  let protocol = Protocol.load("0");
  protocol.lastInitializedRound = event.params.round.toString();
  protocol.totalActiveStake = totalActiveStake;

  day.totalActiveStake = totalActiveStake;
  day.totalSupply = protocol.totalSupply;

  if (protocol.totalActiveStake.gt(ZERO_BD)) {
    protocol.participationRate = protocol.totalActiveStake.div(
      protocol.totalSupply
    );
    round.participationRate = protocol.participationRate;
    day.participationRate = protocol.participationRate;
  }

  protocol.save();
  day.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let newRound = new NewRoundEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  newRound.transaction = event.transaction.hash.toHex();
  newRound.timestamp = event.block.timestamp.toI32();
  newRound.round = event.params.round.toString();
  newRound.blockHash = event.params.blockHash.toString();
  newRound.save();
}

export function parameterUpdate(event: ParameterUpdate): void {
  let roundsManager = RoundsManager.bind(event.address);
  let protocol = Protocol.load("0");
  let currentRound = roundsManager.currentRound();

  if (event.params.param == "roundLength") {
    let roundLength = roundsManager.roundLength();
    let lastRoundLengthUpdateStartBlock = roundsManager.lastRoundLengthUpdateStartBlock();

    if (protocol.roundLength.toI32() == 0) {
      createRound(event.block.number, roundLength, currentRound);
    }
    protocol.roundLength = roundLength;
    protocol.lastRoundLengthUpdateStartBlock = lastRoundLengthUpdateStartBlock;
    protocol.lastRoundLengthUpdateRound = currentRound.toString();
    protocol.currentRound = currentRound.toString();
  }

  if (event.params.param == "roundLockAmount") {
    protocol.roundLockAmount = roundsManager.roundLockAmount();
    protocol.lockPeriod = roundsManager
      .roundLength()
      .times(roundsManager.roundLockAmount())
      .div(BigInt.fromI32(PERC_DIVISOR));
  }

  protocol.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let parameterUpdate = new ParameterUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  parameterUpdate.transaction = event.transaction.hash.toHex();
  parameterUpdate.timestamp = event.block.timestamp.toI32();
  parameterUpdate.round = currentRound.toString();
  parameterUpdate.param = event.params.param;
  parameterUpdate.save();
}
