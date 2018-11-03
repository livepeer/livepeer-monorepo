import "allocator/arena";
export { allocate_memory };

import { store, Address } from "@graphprotocol/graph-ts";
import { RoundsManager, NewRound } from "../types/RoundsManager/RoundsManager";
import { BondingManager } from "../types/BondingManager/BondingManager";
import { Transcoder, Reward, Round } from "../types/schema";

export function newRound(event: NewRound): void {
  let roundsManager = RoundsManager.bind(event.address);
  let bondingManager = BondingManager.bind(
    Address.fromString("511bc4556d823ae99630ae8de28b9b80df90ea2e")
  );
  let EMPTY_ADDRESS = Address.fromString(
    "0000000000000000000000000000000000000000"
  );
  let transcoder = new Transcoder();
  let reward = new Reward();
  let round = new Round();
  let roundNumber = event.params.round;
  let currentTranscoder = bondingManager.getFirstTranscoderInPool();
  let lastInitializedRound = roundsManager.lastInitializedRound();
  let length = roundsManager.roundLength();
  let startBlock = roundsManager.currentRoundStartBlock();
  let active: boolean;

  while (EMPTY_ADDRESS.toHex() != currentTranscoder.toHex()) {
    active = bondingManager.isActiveTranscoder(currentTranscoder, roundNumber);
    transcoder.id = currentTranscoder.toHex();
    transcoder.active = active;
    store.set("Transcoder", currentTranscoder.toHex(), transcoder);
    if (active) {
      reward.id = currentTranscoder.toHex() + "-" + roundNumber.toString();
      reward.round = roundNumber.toString();
      reward.transcoder = currentTranscoder.toHex();
      store.set("Reward", reward.id, reward);
    }
    currentTranscoder = bondingManager.getNextTranscoderInPool(
      currentTranscoder
    );
  }

  round.id = roundNumber.toString();
  round.initialized = true;
  round.lastInitializedRound = lastInitializedRound;
  round.length = length;
  round.startBlock = startBlock;
  store.set("Round", round.id, round);
}
