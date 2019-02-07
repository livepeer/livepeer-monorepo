// Import types and APIs from graph-ts
import { Address } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import { RoundsManager, NewRound } from "../types/RoundsManager/RoundsManager";
import { BondingManager } from "../types/BondingManager/BondingManager";

// Import entity types generated from the GraphQL schema
import { Transcoder, Reward, Round } from "../types/schema";

// Bind BondingManager contract
let bondingManager = BondingManager.bind(
  Address.fromString("511bc4556d823ae99630ae8de28b9b80df90ea2e")
);

// Handler for NewRound events
export function newRound(event: NewRound): void {
  let roundsManager = RoundsManager.bind(event.address);
  let roundNumber = event.params.round;
  let EMPTY_ADDRESS = Address.fromString(
    "0000000000000000000000000000000000000000"
  );
  let currentTranscoder = bondingManager.getFirstTranscoderInPool();
  let transcoder = Transcoder.load(currentTranscoder.toHex());
  let active: boolean;
  let rewardId: string;
  let reward: Reward;
  let round: Round;
  // Iterate over all registered transcoders
  while (EMPTY_ADDRESS.toHex() != currentTranscoder.toHex()) {
    // Update transcoder active state
    active = bondingManager.isActiveTranscoder(currentTranscoder, roundNumber);
    transcoder.active = active;
    transcoder.save();

    // create a unique "reward" for each active transcoder on every
    // round. If a transcoder calls reward() for a given round, we store its
    // reward tokens inside this entry in a field called "rewardTokens". If
    // "rewardTokens" is null for a given transcoder and round then we know
    // the transcoder failed to call reward()
    if (active) {
      rewardId = currentTranscoder.toHex() + "-" + roundNumber.toString();
      reward = new Reward(rewardId);
      reward.round = roundNumber.toString();
      reward.transcoder = currentTranscoder.toHex();

      // Apply store updates
      reward.save();
    }

    currentTranscoder = bondingManager.getNextTranscoderInPool(
      currentTranscoder
    );

    transcoder = Transcoder.load(currentTranscoder.toHex());
  }

  // Create new round
  round = new Round(roundNumber.toString());
  round.initialized = true;
  round.timestamp = event.block.timestamp;
  round.lastInitializedRound = roundsManager.lastInitializedRound();
  round.length = roundsManager.roundLength();
  round.startBlock = roundsManager.currentRoundStartBlock();

  // Apply store updates
  round.save();
}
