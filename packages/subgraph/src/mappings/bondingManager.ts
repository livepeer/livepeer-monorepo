// Import types and APIs from graph-ts
import { Address, BigInt } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import {
  BondingManager__getDelegatorResult,
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
import { Controller } from "../types/BondingManager/Controller";
import { RoundsManager } from "../types/RoundsManager/RoundsManager";

// Import entity types generated from the GraphQL schema
import { Transcoder, Reward, Delegator, Share } from "../types/schema";

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString("3984fc4ceeef1739135476f625d36d6c35c40dc3")
);

// Bind Controller contract
let controller = Controller.bind(
  Address.fromString("f96d54e490317c557a967abfa5d6e33006be69b3")
);

// Deprecated target contracts
let BondingManagerV1 = "0x81eb0b10ff8703905904e4d91cf6aa575d59736f";
let BondingManagerV2 = "0x5a9512826eaaf1fe4190f89443314e95a515fe24";

// Handler for TranscoderUpdate events
export function transcoderUpdated(event: TranscoderUpdate): void {
  // Bind BondingManager contract
  let bondingManager = BondingManager.bind(event.address);
  let currentRound = roundsManager.currentRound();
  let transcoderAddress = event.params.transcoder;
  let transcoder = Transcoder.load(transcoderAddress.toHex());

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
  transcoder.save();
}

// Handler for TranscoderResigned events
export function transcoderResigned(event: TranscoderResigned): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = Transcoder.load(transcoderAddress.toHex());

  // Update transcoder
  transcoder.active = false;
  transcoder.status = "NotRegistered";

  // Apply store updates
  transcoder.save();
}

// Handler for TranscoderEvicted events
export function transcoderEvicted(event: TranscoderEvicted): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = Transcoder.load(transcoderAddress.toHex());

  // Update transcoder
  transcoder.active = false;
  transcoder.status = "NotRegistered";

  // Apply store updates
  transcoder.save();
}

// Handler for TranscoderSlashed events
export function transcoderSlashed(event: TranscoderSlashed): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = Transcoder.load(transcoderAddress.toHex());
  let bondingManager = BondingManager.bind(event.address);
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);

  // Update transcoder total stake
  transcoder.totalStake = totalStake;

  // Apply store updates
  transcoder.save();
}

// Handler for Bond events
export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address);
  let newDelegateAddress = event.params.newDelegate;
  let oldDelegateAddress = event.params.oldDelegate;
  let delegatorAddress = event.params.delegator;

  // Get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let startRound = delegatorData.value4;

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(delegatorAddress.toHex());
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex());
  }

  // Create Transcoder if it does not yet exist
  let newDelegate = Transcoder.load(newDelegateAddress.toHex());
  if (newDelegate == null) {
    newDelegate = new Transcoder(newDelegateAddress.toHex());
  }

  // Add delegator to delegate if bonding to it for first time
  if (newDelegateAddress.toHex() != oldDelegateAddress.toHex()) {
    // Update old delegate if delegator is bonding to a new one
    if (
      oldDelegateAddress.toHex() != "0x0000000000000000000000000000000000000000"
    ) {
      // Remove delegator from old delegate
      let oldDelegate = Transcoder.load(oldDelegateAddress.toHex());
      let delegators = oldDelegate.delegators;
      let i = delegators.indexOf(delegatorAddress.toHex());
      delegators.splice(i, 1);
      oldDelegate.delegators = delegators;

      // Update old delegate stake
      let oldDelegateTotalStake = bondingManager.transcoderTotalStake(
        oldDelegateAddress
      );
      oldDelegate.totalStake = oldDelegateTotalStake;

      oldDelegate.save();
    }

    if (newDelegate.delegators == null) {
      newDelegate.delegators = new Array<string>();
    }

    // Add delegator to delegate
    let delegators = newDelegate.delegators;
    let i = delegators.indexOf(delegatorAddress.toHex());
    if (i == -1) {
      delegators.push(delegatorAddress.toHex());
      newDelegate.delegators = delegators;
    }
    delegator.delegate = newDelegateAddress.toHex();
  }

  // Update new delegates total stake
  let newDelegateTotalStake = bondingManager.transcoderTotalStake(
    newDelegateAddress
  );
  newDelegate.totalStake = newDelegateTotalStake;

  // Update delegator's start round
  delegator.startRound = startRound.toString();

  // Apply store updates
  delegator.save();
  newDelegate.save();
}

// Handler for Unbond events
export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let startRound = delegatorData.value4;
  let delegator = Delegator.load(delegatorAddress.toHex());
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  let delegate = Transcoder.load(delegateAddress.toHex());
  if (delegate == null) {
    delegate = new Transcoder(delegateAddress.toHex());
  }

  // Update transcoder's total stake
  delegate.totalStake = totalStake;

  // Delegator no longer delegated to anyone if it does not have a bonded amount
  // so remove it from delegate
  if (!delegatorData.value0) {
    let delegators = delegate.delegators;
    if (delegators != null) {
      let i = delegators.indexOf(delegatorAddress.toHex());
      delegators.splice(i, 1);
      delegate.delegators = delegators;
    }

    // Update delegator's delegate
    delegator.delegate = null;

    // Update delegator's start round
    delegator.startRound = startRound.toString();
  }

  // Apply store updates
  delegator.save();
  delegate.save();
}

// Handler for Rebond events
export function rebond(event: Rebond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let delegator = Delegator.load(delegatorAddress.toHex());
  let delegate = Transcoder.load(delegateAddress.toHex());
  let totalStake = bondingManager.transcoderTotalStake(delegateAddress);

  // Get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress);
  let startRound = delegatorData.value4;

  // Update delegator's delegate
  delegator.delegate = delegateAddress.toHex();

  // Update delegator's start round
  delegator.startRound = startRound.toString();

  // Update delegate's total stake
  delegate.totalStake = totalStake;

  // Apply store updates
  delegate.save();
  delegator.save();
}

// Handler for Reward events
export function reward(event: RewardEvent): void {
  let bondingManager = BondingManager.bind(event.address);
  let transcoderAddress = event.params.transcoder;
  let transcoder = Transcoder.load(transcoderAddress.toHex());
  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);
  let currentRound = roundsManager.currentRound();

  // Recreate unique id from transcoder address and round
  // We use this to keep track of a transcoder's rewards for each round
  let rewardId = transcoderAddress.toHex() + "-" + currentRound.toString();

  // Get reward
  let reward = new Reward(rewardId);

  // Update transcoder total stake
  transcoder.totalStake = totalStake;

  // Update reward tokens
  reward.rewardTokens = event.params.amount;

  let delegatorAddress: Address;
  let pendingStakeAsOfNow: BigInt;
  let pendingStakeAsOfLastRound: BigInt;
  let delegator: Delegator;
  let share: Share;
  let delegatorData: BondingManager__getDelegatorResult;
  let delegators: Array<string> = transcoder.delegators as Array<string>;
  let roundsSinceLastClaim: number;
  let lastClaimRound: BigInt;
  let targetContract: string;
  let isDeprecated: boolean;

  for (let i = 0; i < delegators.length; i++) {
    delegatorAddress = Address.fromString(delegators[i]);
    delegator = Delegator.load(delegators[i]) as Delegator;
    delegatorData = bondingManager.getDelegator(delegatorAddress);

    // Get target contract address
    targetContract = controller
      .getContract(bondingManager.targetContractId())
      .toHex();

    // Check to see if target contract is deprecated
    isDeprecated =
      targetContract == BondingManagerV1 || targetContract == BondingManagerV2;

    // Account for getDelegator return signature change
    lastClaimRound = isDeprecated ? delegatorData.value6 : delegatorData.value5;

    // Get total rounds sincer delegators last claim
    roundsSinceLastClaim = currentRound.toI32() - lastClaimRound.toI32();

    // Create Share if it does not yet exist
    share = Share.load(
      delegatorAddress.toHex() + "-" + currentRound.toString()
    ) as Share;
    if (share == null) {
      share = new Share(
        delegatorAddress.toHex() + "-" + currentRound.toString()
      );
    }

    // Calculate delegators reward tokens for this round
    if (roundsSinceLastClaim > 1) {
      pendingStakeAsOfNow = bondingManager.pendingStake(
        delegatorAddress,
        currentRound
      );
      pendingStakeAsOfLastRound = bondingManager.pendingStake(
        delegatorAddress,
        currentRound.minus(BigInt.fromI32(1))
      );
      share.rewardTokens = pendingStakeAsOfNow.minus(pendingStakeAsOfLastRound);
    }

    if (roundsSinceLastClaim == 1) {
      pendingStakeAsOfNow = bondingManager.pendingStake(
        delegatorAddress,
        currentRound
      );
      share.rewardTokens = pendingStakeAsOfNow.minus(delegatorData.value0);
    }

    share.round = currentRound.toString();
    share.delegator = delegatorAddress.toHex();
    share.save();
  }

  // Apply store updates
  transcoder.save();
  reward.save();
}
