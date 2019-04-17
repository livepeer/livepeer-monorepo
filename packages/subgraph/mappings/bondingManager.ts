// Import types and APIs from graph-ts
import { store, Address } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  TranscoderUpdate,
  TranscoderResigned,
  TranscoderEvicted,
  TranscoderSlashed,
  Bond,
  Unbond,
  Rebond,
  Reward as RewardEvent // alias Reward event to avoid name collision with entity type
} from "../types/BondingManager/BondingManager";
import { RoundsManager } from "../types/RoundsManager/RoundsManager";

// Import entity types generated from the GraphQL schema
import { Transcoder, Reward } from "../types/schema";

import { makeRewardId } from "./util";

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString("3984fc4ceeef1739135476f625d36d6c35c40dc3")
);

// Handler for TranscoderUpdate events
export function transcoderUpdated(event: TranscoderUpdate): void {
  // Bind BondingManager contract
  let bondingManager = BondingManager.bind(event.address);
  let currentRound = roundsManager.currentRound();
  let transcoderAddress = event.params.transcoder;
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder | null;

  // Create transcoder if it does not yet exist
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex());
  }

  let active = bondingManager.isActiveTranscoder(
    transcoderAddress,
    currentRound
  );
  let registered = event.params.registered;
  let pendingRewardCut = event.params.pendingRewardCut;
  let pendingFeeShare = event.params.pendingFeeShare;
  let pendingPricePerSegment = event.params.pendingPricePerSegment;

  // Get more transcoder fields from contract
  let transcoderData = bondingManager.getTranscoder(transcoderAddress);
  let lastRewardRound = transcoderData.value0;
  let rewardCut = transcoderData.value1;
  let feeShare = transcoderData.value2;
  let pricePerSegment = transcoderData.value3;

  // Update transcoder
  transcoder.pendingRewardCut = pendingRewardCut;
  transcoder.pendingFeeShare = pendingFeeShare;
  transcoder.pendingPricePerSegment = pendingPricePerSegment;
  transcoder.rewardCut = rewardCut;
  transcoder.feeShare = feeShare;
  transcoder.pricePerSegment = pricePerSegment;
  transcoder.lastRewardRound = lastRewardRound;
  transcoder.active = active;
  transcoder.status = registered ? "Registered" : "NotRegistered";

  // Apply store updates
  store.set("Transcoder", transcoderAddress.toHex(), transcoder as Transcoder);
}

// Handler for TranscoderResigned events
export function transcoderResigned(event: TranscoderResigned): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder;

  // Update transcoder
  transcoder.active = false;
  transcoder.status = "NotRegistered";

  // Apply store updates
  store.set("Transcoder", transcoderAddress.toHex(), transcoder);
}

// Handler for TranscoderEvicted events
export function transcoderEvicted(event: TranscoderEvicted): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder;

  // Update transcoder
  transcoder.active = false;
  transcoder.status = "NotRegistered";

  // Apply store updates
  store.set("Transcoder", transcoderAddress.toHex(), transcoder);
}

// Handler for TranscoderSlashed events
export function transcoderSlashed(event: TranscoderSlashed): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder;
  let bondingManager = BondingManager.bind(event.address);
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);

  // Update transcoder total stake
  transcoder.totalStake = totalStake;

  // Apply store updates
  store.set("Transcoder", transcoderAddress.toHex(), transcoder);
}

// Handler for Bond events
export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address);
  let newDelegateAddress = event.params.newDelegate;
  let oldDelegateAddress = event.params.oldDelegate;
  let newDelegate = store.get(
    "Transcoder",
    newDelegateAddress.toHex()
  ) as Transcoder;
  let oldDelegate = store.get(
    "Transcoder",
    oldDelegateAddress.toHex()
  ) as Transcoder;
  let newDelegateTotalStake = bondingManager.transcoderTotalStake(
    newDelegateAddress
  );
  let oldDelegateTotalStake = bondingManager.transcoderTotalStake(
    oldDelegateAddress
  );

  // Update new and old delegate total stake
  newDelegate.totalStake = newDelegateTotalStake;
  oldDelegate.totalStake = oldDelegateTotalStake;

  // Apply store updates
  store.set("Transcoder", newDelegateAddress.toHex(), newDelegate);
  store.set("Transcoder", oldDelegateAddress.toHex(), oldDelegate);
}

// Handler for Unbond events
export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegate = store.get("Transcoder", delegateAddress.toHex()) as Transcoder;
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);
  delegate.totalStake = totalStake;

  // Apply store updates
  store.set("Transcoder", delegateAddress.toHex(), delegate);
}

// Handler for Rebond events
export function rebond(event: Rebond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegate = store.get("Transcoder", delegateAddress.toHex()) as Transcoder;
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  // Update transcoder total stake
  delegate.totalStake = totalStake;

  // Apply store updates
  store.set("Transcoder", delegateAddress.toHex(), delegate);
}

// Handler for Reward events
export function reward(event: RewardEvent): void {
  let bondingManager = BondingManager.bind(event.address);
  let transcoderAddress = event.params.transcoder;
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder;
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);
  let currentRound = roundsManager.currentRound();

  // Recreate unique id from transcoder address and round
  // We use this to keep track of a transcoder's rewards for each round
  let rewardId = makeRewardId(transcoderAddress, currentRound);

  // Get reward
  let reward = store.get("Reward", rewardId) as Reward;

  // Update transcoder total stake
  transcoder.totalStake = totalStake;

  // Update reward tokens
  reward.rewardTokens = event.params.amount;

  // Apply store updates
  store.set("Transcoder", transcoderAddress.toHex(), transcoder);
  store.set("Reward", rewardId, reward);
}
