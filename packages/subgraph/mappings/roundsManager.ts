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
  let currentTranscoder = bondingManager.getFirstTranscoderInPool();
  let transcoder = store.get(
    "Transcoder",
    currentTranscoder.toHex()
  ) as Transcoder;
  let roundNumber = event.params.round;
  let lastInitializedRound = roundsManager.lastInitializedRound();
  let length = roundsManager.roundLength();
  let startBlock = roundsManager.currentRoundStartBlock();
  let round = new Round();
  let active: boolean;
  let rewardId: string;
  let reward: Reward;

  while (EMPTY_ADDRESS.toHex() != currentTranscoder.toHex()) {
    active = bondingManager.isActiveTranscoder(currentTranscoder, roundNumber);

    transcoder.active = active;
    store.set("Transcoder", currentTranscoder.toHex(), transcoder);

    // create a unique "reward" entry for each active transcoder on every
    // round. If a transcoder calls reward() for a given round, we store its
    // reward tokens inside this entry in a field called "rewardTokens". If
    // "rewardTokens" is null for a given transcoder and round then we know
    // the transcoder failed to call reward()
    if (active) {
      reward = new Reward();
      rewardId = currentTranscoder.toHex() + "-" + roundNumber.toString();
      reward.round = roundNumber.toString();
      reward.transcoder = currentTranscoder.toHex();
      store.set("Reward", rewardId, reward);
    }

    currentTranscoder = bondingManager.getNextTranscoderInPool(
      currentTranscoder
    );

    transcoder = store.get(
      "Transcoder",
      currentTranscoder.toHex()
    ) as Transcoder;
  }

  round.initialized = true;
  round.lastInitializedRound = lastInitializedRound;
  round.length = length;
  round.startBlock = startBlock;

  store.set("Round", roundNumber.toString(), round);
}
