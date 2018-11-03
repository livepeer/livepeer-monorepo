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

// Respond to transcoder added events
export function transcoderUpdated(event: TranscoderUpdate): void {
  let bondingManager = BondingManager.bind(event.address);
  let transcoder = new Transcoder();
  let currentRound = roundsManager.currentRound();
  let transcoderAddress = event.params.transcoder;
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

  transcoder.id = transcoderAddress.toHex();
  transcoder.pendingRewardCut = pendingRewardCut;
  transcoder.pendingFeeShare = pendingFeeShare;
  transcoder.pendingPricePerSegment = pendingPricePerSegment;
  transcoder.rewardCut = rewardCut;
  transcoder.feeShare = feeShare;
  transcoder.pricePerSegment = pricePerSegment;
  transcoder.lastRewardRound = lastRewardRound;
  transcoder.active = active;
  transcoder.status = registered ? "Registered" : "NotRegistered";

  store.set("Transcoder", transcoder.id, transcoder);
}

export function transcoderResigned(event: TranscoderResigned): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = new Transcoder();
  transcoder.id = transcoderAddress.toHex();
  transcoder.active = false;
  transcoder.status = "NotRegistered";
  store.set("Transcoder", transcoder.id, transcoder);
}

export function transcoderEvicted(event: TranscoderEvicted): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = new Transcoder();
  transcoder.id = transcoderAddress.toHex();
  transcoder.active = false;
  transcoder.status = "NotRegistered";
  store.set("Transcoder", transcoder.id, transcoder);
}

export function transcoderSlashed(event: TranscoderSlashed): void {
  let bondingManager = BondingManager.bind(event.address);
  let transcoder = new Transcoder();
  let transcoderAddress = event.params.transcoder;
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);
  transcoder.id = transcoderAddress.toHex();
  transcoder.totalStake = totalStake;
  store.set("Transcoder", transcoder.id, transcoder);
}

export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address);
  let newDelegate = new Transcoder();
  let oldDelegate = new Transcoder();
  let newDelegateAddress = event.params.newDelegate;
  let oldDelegateAddress = event.params.oldDelegate;
  let newDelegateTotalStake = bondingManager.transcoderTotalStake(
    newDelegateAddress
  );
  let oldDelegateTotalStake = bondingManager.transcoderTotalStake(
    oldDelegateAddress
  );
  newDelegate.id = newDelegateAddress.toHex();
  newDelegate.totalStake = newDelegateTotalStake;
  store.set("Transcoder", newDelegate.id, newDelegate);

  oldDelegate.id = oldDelegateAddress.toHex();
  oldDelegate.totalStake = oldDelegateTotalStake;
  store.set("Transcoder", oldDelegate.id, oldDelegate);
}

export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegate = new Transcoder();
  let delegateAddress = event.params.delegate;
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  delegate.id = delegateAddress.toHex();
  delegate.totalStake = totalStake;
  store.set("Transcoder", delegate.id, delegate);
}

export function rebond(event: Rebond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegate = new Transcoder();
  let delegateAddress = event.params.delegate;
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  delegate.id = delegateAddress.toHex();
  delegate.totalStake = totalStake;
  store.set("Transcoder", delegate.id, delegate);
}

export function reward(event: RewardEvent): void {
  let bondingManager = BondingManager.bind(event.address);
  let transcoder = new Transcoder();
  let reward = new Reward();
  let transcoderAddress = event.params.transcoder;
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);
  let currentRound = roundsManager.currentRound();

  transcoder.id = transcoderAddress.toHex();
  transcoder.totalStake = totalStake;
  store.set("Transcoder", transcoder.id, transcoder);

  reward.id = transcoderAddress.toHex() + "-" + currentRound.toString();
  reward.rewardTokens = event.params.amount;
  store.set("Reward", reward.id, reward);
}
