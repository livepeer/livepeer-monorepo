import { Address, BigInt, log } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import { DistributeFees } from "../types/JobsManager/JobsManager";
import { BondingManager } from "../types/BondingManager_LIP11/BondingManager";

import { RoundsManager } from "../types/RoundsManager/RoundsManager";

// Import entity types generated from the GraphQL schema
import { Transcoder, Delegator, Pool, Share } from "../types/schema";

import { makePoolId, makeShareId } from "./util";

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString("3984fc4ceeef1739135476f625d36d6c35c40dc3")
);

// Bind BondingManager contract
let bondingManager = BondingManager.bind(
  Address.fromString("511bc4556d823ae99630ae8de28b9b80df90ea2e")
);

export function distributeFees(event: DistributeFees): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = Transcoder.load(transcoderAddress.toHex());
  let currentRound = roundsManager.currentRound();
  let delegatorAddress: Address;
  let pendingFeesAsOfNow: BigInt;
  let delegator: Delegator;
  let share: Share;
  let delegators: Array<string> = transcoder.delegators as Array<string>;
  let roundsSinceLastClaim: number;
  let poolId = makePoolId(transcoderAddress, currentRound);
  let pool = Pool.load(poolId);
  let shareId: string;

  // Update each delegator's earned fees
  for (let i = 0; i < delegators.length; i++) {
    delegatorAddress = Address.fromString(delegators[i]);
    delegator = Delegator.load(delegators[i]) as Delegator;

    // Calculate delegator's fee share if it hasn't yet claimed earnings for this round
    if (currentRound.toI32() > parseInt(delegator.lastClaimRound, 10)) {
      let callResult = bondingManager.try_pendingFees(
        delegatorAddress,
        currentRound
      );

      if (callResult.reverted) {
        log.info(
          "pendingStake reverted. A delegator claimed its earnings inside the same block its delegate called reward",
          []
        );
      } else {
        pendingFeesAsOfNow = callResult.value;

        shareId = makeShareId(delegatorAddress, currentRound);
        share = Share.load(shareId) as Share;
        if (share == null) {
          share = new Share(shareId);
        }

        roundsSinceLastClaim =
          currentRound.toI32() - parseInt(delegator.lastClaimRound, 10);

        if (roundsSinceLastClaim > 1) {
          share.fees = pendingFeesAsOfNow.minus(
            delegator.pendingFees as BigInt
          );
        } else {
          share.fees = pendingFeesAsOfNow.minus(delegator.fees as BigInt);
        }

        share.round = currentRound.toString();
        share.delegator = delegatorAddress.toHex();
        share.save();

        delegator.pendingFees = pendingFeesAsOfNow;
        delegator.save();
      }
    }
  }

  // Update pool fees
  pool.fees = pool.fees.plus(event.params.fees);

  // Update transcoder's accrued fees
  transcoder.accruedFees = transcoder.accruedFees.plus(event.params.fees);

  // Apply store updates
  pool.save();
  transcoder.save();
}
