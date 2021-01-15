// Import types and APIs from graph-ts
import { Address, dataSource, BigInt } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import { NewRound } from "../types/RoundsManagerV1/RoundsManager";
import { BondingManager } from "../types/BondingManagerV1/BondingManager";

// Import entity types generated from the GraphQL schema
import {
  Transaction,
  Transcoder,
  Pool,
  Protocol,
  NewRoundEvent,
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
} from "../../utils/helpers";

// Handler for NewRound events
export function newRound(event: NewRound): void {
  let bondingManagerAddress = getBondingManagerAddress(dataSource.network());
  let bondingManager = BondingManager.bind(
    Address.fromString(bondingManagerAddress)
  );
  let day = createOrLoadDay(event.block.timestamp.toI32());
  let round = createOrLoadRound(event.block.number);
  let currentTranscoder = bondingManager.getFirstTranscoderInPool();
  let transcoder = Transcoder.load(currentTranscoder.toHex());
  let totalActiveStake = convertToDecimal(bondingManager.getTotalBonded());

  round.initialized = true;
  round.totalActiveStake = totalActiveStake;
  round.save();

  let active: boolean;
  let poolId: string;
  let pool: Pool;

  // Iterate over all registered transcoders
  while (EMPTY_ADDRESS.toHex() != currentTranscoder.toHex()) {
    // Update transcoder active state
    active = bondingManager.isActiveTranscoder(
      currentTranscoder,
      event.params.round
    );
    transcoder.active = active;
    transcoder.rewardCut = transcoder.pendingRewardCut as BigInt;
    transcoder.feeShare = transcoder.pendingFeeShare as BigInt;
    transcoder.pricePerSegment = transcoder.pendingPricePerSegment;
    transcoder.save();

    // create a unique "pool" for each active transcoder on every
    // round. If a transcoder calls reward() for a given round, we store its
    // reward tokens inside this Pool entry in a field called "rewardTokens". If
    // "rewardTokens" is null for a given transcoder and round then we know
    // the transcoder failed to call reward()
    if (active) {
      poolId = makePoolId(
        currentTranscoder.toHex(),
        event.params.round.toString()
      );
      pool = new Pool(poolId);
      pool.round = event.params.round.toString();
      pool.delegate = currentTranscoder.toHex();
      pool.totalStake = transcoder.totalStake;
      pool.rewardCut = transcoder.rewardCut;
      pool.feeShare = transcoder.feeShare;

      // Apply store updates
      pool.save();
    }

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
  day.save();
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

  let newRound = new NewRoundEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  newRound.transaction = event.transaction.hash.toHex();
  newRound.timestamp = event.block.timestamp.toI32();
  newRound.round = event.params.round.toString();
  newRound.blockHash = event.block.hash.toString();
  newRound.save();
}
