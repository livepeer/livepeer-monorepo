import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";
import { Delegator, Protocol, Share, Transcoder } from "../types/schema";
import {
  makeShareId,
  percOfWithDenom,
  percOf,
  makePoolId,
  convertToDecimal,
  ZERO_BI,
  ZERO_BD,
} from "../../utils/helpers";
import { BondingManagerV1 } from "../types/templates/ShareTemplate/BondingManagerV1";
import { BondingManagerV7 } from "../types/templates/ShareTemplate/BondingManagerV7";
import {
  BondingManager,
  Reward as RewardEvent,
} from "../types/templates/ShareTemplate/BondingManager";
import { decimal, integer } from "@protofire/subgraph-toolkit";

export function updateShareOnReward(event: RewardEvent): void {
  let delegatorAddress = dataSource.context().getString("delegator");
  let delegator = Delegator.load(delegatorAddress) as Delegator;
  // if caller is delegator's delegate, update its share and pendingStake
  if (delegator.delegate == event.params.transcoder.toHex()) {
    if (event.block.number.lt(BigInt.fromI32(6248558))) {
      calculateRewardsV1(event, delegator);
    } else if (event.block.number.lt(BigInt.fromI32(10972430))) {
      calculateRewardsV7(event, delegator);
    } else {
      calculateRewards(event, delegator);
    }
  }
}

export function calculateRewards(
  event: RewardEvent,
  delegator: Delegator
): void {
  // TODO: implement share logic post lip-36
}

export function calculateRewardsV7(
  event: RewardEvent,
  delegator: Delegator
): void {
  let bondingManager = BondingManagerV7.bind(event.address);
  let protocol = Protocol.load("0");
  let currentRound = integer.fromString(protocol.currentRound);
  // We have to fetch lastClaimRound from contract storage because if a transcoder
  // called reward in the block that a delegator claimed earnings
  // last claim round would be incorrect
  let delegatorData = bondingManager.getDelegator(
    Address.fromString(delegator.id)
  );

  let lastClaimRound = delegatorData.value5;

  if (currentRound.gt(lastClaimRound)) {
    let earningsPool = bondingManager.getTranscoderEarningsPoolForRound(
      event.params.transcoder,
      currentRound
    );
    let rewardPool = earningsPool.value0;
    let claimableStake = earningsPool.value3;
    let poolId = makePoolId(
      event.params.transcoder.toHex(),
      protocol.currentRound
    );
    let shareId = makeShareId(delegator.id, protocol.currentRound);
    let share = Share.load(shareId) || new Share(shareId);
    let isTranscoder = delegator.id == event.params.transcoder.toHex();
    let delegatorRewards = claimableStake.gt(ZERO_BI)
      ? percOfWithDenom(
          rewardPool,
          decimal.toBigInt(delegator.pendingStake, 18),
          claimableStake
        )
      : ZERO_BI;

    if (isTranscoder) {
      let transcoderRewardPool = earningsPool.value6;
      share.rewardTokens = convertToDecimal(
        delegatorRewards.plus(transcoderRewardPool)
      );
    } else {
      share.rewardTokens = convertToDecimal(delegatorRewards);
    }

    share.pool = poolId;
    share.round = currentRound.toString();
    share.delegator = delegator.id;
    share.save();

    delegator.pendingStake = delegator.pendingStake.plus(share.rewardTokens);
    delegator.save();
  }
}

export function calculateRewardsV1(
  event: RewardEvent,
  delegator: Delegator
): void {
  let bondingManager = BondingManagerV1.bind(event.address);
  let protocol = Protocol.load("0");
  let currentRound = integer.fromString(protocol.currentRound);
  // We have to fetch lastClaimRound from contract storage because if a transcoder
  // called reward in the block that a delegator claimed earnings
  // last claim round would be incorrect
  let delegatorData = bondingManager.getDelegator(
    Address.fromString(delegator.id)
  );

  let lastClaimRound = event.block.number.lt(BigInt.fromI32(6194948))
    ? delegatorData.value6
    : delegatorData.value5;

  if (currentRound.gt(lastClaimRound)) {
    let earningsPool = bondingManager.getTranscoderEarningsPoolForRound(
      event.params.transcoder,
      currentRound
    );
    let rewardPool = earningsPool.value0;
    let claimableStake = earningsPool.value3;
    let poolId = makePoolId(
      event.params.transcoder.toHex(),
      protocol.currentRound
    );
    let shareId = makeShareId(delegator.id, protocol.currentRound);
    let share = Share.load(shareId) || new Share(shareId);
    let isTranscoder = delegator.id == event.params.transcoder.toHex();
    let transcoderRewards = ZERO_BI;
    let delegatorRewards = ZERO_BI;
    let transcoder = Transcoder.load(event.params.transcoder.toHex());
    if (claimableStake.gt(BigInt.fromI32(0))) {
      transcoderRewards = percOf(rewardPool, transcoder.rewardCut);
      delegatorRewards = percOfWithDenom(
        rewardPool.minus(transcoderRewards),
        decimal.toBigInt(delegator.pendingStake, 18),
        claimableStake
      );
    }

    if (isTranscoder) {
      share.rewardTokens = convertToDecimal(
        delegatorRewards.plus(transcoderRewards)
      );
    } else {
      share.rewardTokens = convertToDecimal(delegatorRewards);
    }

    share.pool = poolId;
    share.round = currentRound.toString();
    share.delegator = delegator.id;
    share.save();

    delegator.pendingStake = delegator.pendingStake.plus(share.rewardTokens);
    delegator.save();
  }
}
