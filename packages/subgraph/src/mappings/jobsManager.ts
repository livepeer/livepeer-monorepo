import { Address, BigInt } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import { DistributeFees } from "../types/JobsManager/JobsManager";
import {
  BondingManager,
  BondingManager__getDelegatorResult
} from "../types/BondingManager/BondingManager";

import { Controller } from "../types/BondingManager/Controller";
import { RoundsManager } from "../types/RoundsManager/RoundsManager";

// Import entity types generated from the GraphQL schema
import { Transcoder, Delegator, Share } from "../types/schema";

// Deprecated target contracts
let BondingManagerV1 = "0x81eb0b10ff8703905904e4d91cf6aa575d59736f";
let BondingManagerV2 = "0x5a9512826eaaf1fe4190f89443314e95a515fe24";

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString("3984fc4ceeef1739135476f625d36d6c35c40dc3")
);

// Bind BondingManager contract
let bondingManager = BondingManager.bind(
  Address.fromString("511bc4556d823ae99630ae8de28b9b80df90ea2e")
);

// Bind Controller contract
let controller = Controller.bind(
  Address.fromString("f96d54e490317c557a967abfa5d6e33006be69b3")
);

export function distributeFees(event: DistributeFees): void {
  let transcoderAddress = event.params.transcoder;
  let transcoder = Transcoder.load(transcoderAddress.toHex());
  let currentRound = roundsManager.currentRound();
  let delegatorAddress: Address;
  let pendingFeesAsOfNow: BigInt;
  let pendingFeesAsOfLastRound: BigInt;
  let delegator: Delegator;
  let share: Share;
  let delegatorData: BondingManager__getDelegatorResult;
  let delegators: Array<string> = transcoder.delegators as Array<string>;
  let roundsSinceLastClaim: BigInt;
  let lastClaimRound: BigInt;
  let targetContract: string;
  let isDeprecated: boolean;

  // Update each delegator's earned fees
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
    roundsSinceLastClaim = currentRound.minus(lastClaimRound);

    // Calculate delegator's fee share if it hasn't yet claimed earnings for this round
    if (roundsSinceLastClaim.toI32() > 0) {
      share = Share.load(
        delegatorAddress.toHex() + "-" + currentRound.toString()
      ) as Share;
      if (share == null) {
        share = new Share(
          delegatorAddress.toHex() + "-" + currentRound.toString()
        );
      }
      pendingFeesAsOfNow = bondingManager.pendingFees(
        delegatorAddress,
        currentRound
      );
      if (roundsSinceLastClaim.toI32() > 1) {
        pendingFeesAsOfLastRound = bondingManager.pendingFees(
          delegatorAddress,
          currentRound.minus(BigInt.fromI32(1))
        );
        share.fees = pendingFeesAsOfNow.minus(pendingFeesAsOfLastRound);
      } else {
        share.fees = pendingFeesAsOfNow.minus(delegatorData.value1);
      }
      share.round = currentRound.toString();
      share.delegator = delegatorAddress.toHex();
      share.save();
    }
  }

  // Update transcoder's accrued fees
  transcoder.accruedFees = transcoder.accruedFees.plus(event.params.fees);

  // Apply store updates
  transcoder.save();
}
