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
  let protocol = Protocol.load("0");

  // Activate all transcoders pending activation
  let pendingActivation = protocol.pendingActivation;
  if (pendingActivation.length) {
    for (let index = 0; index < pendingActivation.length; index++) {
      let t = Transcoder.load(pendingActivation[index]);
      t.active = true;
      t.save();
    }
    protocol.pendingActivation = [];
  }

  // Deactivate all transcoders pending deactivation
  let pendingDeactivation = protocol.pendingDeactivation;
  if (pendingDeactivation.length) {
    for (let index = 0; index < pendingDeactivation.length; index++) {
      let t = Transcoder.load(pendingDeactivation[index]);
      t.active = false;
      t.save();
    }
    protocol.pendingDeactivation = [];
  }

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
    pool.save();

    currentTranscoder = bondingManager.getNextTranscoderInPool(
      currentTranscoder
    );

    transcoder = Transcoder.load(currentTranscoder.toHex());
  }

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

  let newRoundEvent = new NewRoundEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  newRoundEvent.transaction = event.transaction.hash.toHex();
  newRoundEvent.timestamp = event.block.timestamp.toI32();
  newRoundEvent.round = event.params.round.toString();
  newRoundEvent.blockHash = event.params.blockHash.toHexString();
  newRoundEvent.save();
}

export function parameterUpdate(event: ParameterUpdate): void {
  let roundsManager = RoundsManager.bind(event.address);
  let protocol = Protocol.load("0");
  let currentRound = roundsManager.currentRound();

  if (event.params.param == "roundLength") {
    let roundLength = roundsManager.roundLength();
    let lastRoundLengthUpdateStartBlock = roundsManager.lastRoundLengthUpdateStartBlock();
    let lastRoundLengthUpdateRound = roundsManager.lastRoundLengthUpdateRound();

    if (protocol.roundLength.toI32() == 0) {
      createRound(event.block.number, roundLength, currentRound);
    }
    protocol.roundLength = roundLength;
    protocol.lastRoundLengthUpdateStartBlock = lastRoundLengthUpdateStartBlock;
    protocol.lastRoundLengthUpdateRound = lastRoundLengthUpdateRound.toString();
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

  let parameterUpdateEvent = new ParameterUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  parameterUpdateEvent.transaction = event.transaction.hash.toHex();
  parameterUpdateEvent.timestamp = event.block.timestamp.toI32();
  parameterUpdateEvent.round = currentRound.toString();
  parameterUpdateEvent.param = event.params.param;
  parameterUpdateEvent.save();
}
