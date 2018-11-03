import "allocator/arena";
export { allocate_memory };

import { store, Address } from "@graphprotocol/graph-ts";
import {
  BondingManager,
  TranscoderUpdate,
  TranscoderResigned,
  TranscoderEvicted,
  TranscoderSlashed,
  Bond,
  Unbond,
  Rebond,
  Reward as RewardEvent
} from "../types/BondingManager/BondingManager";
import { RoundsManager } from "../types/RoundsManager/RoundsManager";
import { Transcoder, Reward } from "../types/schema";

let roundsManager = RoundsManager.bind(
  Address.fromString("3984fc4ceeef1739135476f625d36d6c35c40dc3")
);

export function transcoderUpdated(event: TranscoderUpdate): void {
  let bondingManager = BondingManager.bind(event.address);
  let currentRound = roundsManager.currentRound();
  let transcoderAddress = event.params.transcoder;

  // Create transcoder if it does not yet exist
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder | null;
  if (transcoder == null) {
    transcoder = new Transcoder();
  }

  let active = bondingManager.isActiveTranscoder(
    transcoderAddress,
    currentRound
  );
  let transcoderInfo = bondingManager.getTranscoder(transcoderAddress);
  let registered = event.params.registered;
  let pendingRewardCut = event.params.pendingRewardCut;
  let pendingFeeShare = event.params.pendingFeeShare;
  let pendingPricePerSegment = event.params.pendingPricePerSegment;
  let lastRewardRound = transcoderInfo.value0;
  let rewardCut = transcoderInfo.value1;
  let feeShare = transcoderInfo.value2;
  let pricePerSegment = transcoderInfo.value3;

  transcoder.pendingRewardCut = pendingRewardCut;
  transcoder.pendingFeeShare = pendingFeeShare;
  transcoder.pendingPricePerSegment = pendingPricePerSegment;
  transcoder.rewardCut = rewardCut;
  transcoder.feeShare = feeShare;
  transcoder.pricePerSegment = pricePerSegment;
  transcoder.lastRewardRound = lastRewardRound;
  transcoder.active = active;
  transcoder.status = registered ? "Registered" : "NotRegistered";

  store.set("Transcoder", transcoderAddress.toHex(), transcoder as Transcoder);
}

export function transcoderResigned(event: TranscoderResigned): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder;

  transcoder.active = false;
  transcoder.status = "NotRegistered";
  store.set("Transcoder", transcoderAddress.toHex(), transcoder);
}

export function transcoderEvicted(event: TranscoderEvicted): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder;

  transcoder.active = false;
  transcoder.status = "NotRegistered";
  store.set("Transcoder", transcoderAddress.toHex(), transcoder);
}

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
  store.set("Transcoder", transcoderAddress.toHex(), transcoder);
}

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

  newDelegate.totalStake = newDelegateTotalStake;
  store.set("Transcoder", newDelegateAddress.toHex(), newDelegate);

  oldDelegate.totalStake = oldDelegateTotalStake;
  store.set("Transcoder", oldDelegateAddress.toHex(), oldDelegate);
}

export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegate = store.get("Transcoder", delegateAddress.toHex()) as Transcoder;
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  delegate.totalStake = totalStake;
  store.set("Transcoder", delegateAddress.toHex(), delegate);
}

export function rebond(event: Rebond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegate = store.get("Transcoder", delegateAddress.toHex()) as Transcoder;
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  delegate.totalStake = totalStake;
  store.set("Transcoder", delegateAddress.toHex(), delegate);
}

export function reward(event: RewardEvent): void {
  let bondingManager = BondingManager.bind(event.address);
  let transcoderAddress = event.params.transcoder;
  let transcoder = store.get(
    "Transcoder",
    transcoderAddress.toHex()
  ) as Transcoder;
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);
  let currentRound = roundsManager.currentRound();
  let rewardId = transcoderAddress.toHex() + "-" + currentRound.toString();
  let reward = store.get("Reward", rewardId) as Reward;

  transcoder.totalStake = totalStake;
  store.set("Transcoder", transcoderAddress.toHex(), transcoder);

  reward.rewardTokens = event.params.amount;
  store.set("Reward", rewardId, reward);
}
