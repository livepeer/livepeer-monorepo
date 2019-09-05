import { Address, BigInt } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  Bond,
  Unbond,
  WithdrawStake
} from "../types/BondingManager/BondingManager";

// Import entity types generated from the GraphQL schema
import { Transcoder, Delegator } from "../types/schema";
import { RoundsManager } from "../types/RoundsManager/RoundsManager";

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString("3984fc4ceeef1739135476f625d36d6c35c40dc3")
);

export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address);
  let transcoderAddress = event.params.delegate;
  let delegatorAddress = event.params.delegator;
  let transcoderTotalStake = bondingManager.transcoderTotalStake(
    transcoderAddress
  );
  let currentRound = roundsManager.currentRound();

  // Get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress);

  // Create transcoder if it does not yet exist
  let transcoder = Transcoder.load(transcoderAddress.toHex());
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex());
  }

  // Create delegate if it does not yet exist
  let delegate = Delegator.load(transcoderAddress.toHex());
  if (delegate == null) {
    delegate = new Delegator(transcoderAddress.toHex());
  }

  // Get delegate data
  let delegateData = bondingManager.getDelegator(transcoderAddress);

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3;

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(delegatorAddress.toHex());
  if (delegator == null) {
    delegator = new Delegator(delegatorAddress.toHex());
  }

  if (transcoder.delegators == null) {
    transcoder.delegators = new Array<string>();
  }

  // Add delegator to delegate if it's not already
  let delegators = transcoder.delegators;
  let i = delegators.indexOf(delegatorAddress.toHex());
  if (i == -1) {
    delegators.push(delegatorAddress.toHex());
    transcoder.delegators = delegators;
  }

  // Update delegate's total stake
  transcoder.totalStake = transcoderTotalStake;

  delegator.delegate = transcoderAddress.toHex();

  // Update delegator's start round
  delegator.startRound = currentRound.plus(BigInt.fromI32(1)).toString();

  // Update delegator's last claim round
  delegator.lastClaimRound = currentRound.toString();

  // Update delegator's bonded amount
  delegator.bondedAmount = delegatorData.value0;

  // Update delegator's fees
  delegator.fees = delegator.pendingFees;

  // Update delegator's pending stake
  delegator.pendingStake = BigInt.fromI32(0);

  // Update delegator's pending fees
  delegator.pendingFees = BigInt.fromI32(0);

  delegate.save();
  delegator.save();
  transcoder.save();
}

export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegatorAddress = event.params.delegator;
  let delegator = Delegator.load(delegatorAddress.toHex());
  let currentRound = roundsManager.currentRound();

  // delegate is not emitted in the deprecated event so grab it from delegator
  let transcoderAddress = Address.fromString(delegator.delegate);

  let transcoder = Transcoder.load(transcoderAddress.toHex());
  if (transcoder == null) {
    transcoder = new Transcoder(transcoderAddress.toHex());
  }

  let delegate = Delegator.load(transcoderAddress.toHex());
  if (delegate == null) {
    delegate = new Delegator(transcoderAddress.toHex());
  }

  // Get delegate data
  let delegateData = bondingManager.getDelegator(transcoderAddress);

  let totalStake = bondingManager.transcoderTotalStake(transcoderAddress);

  // Get delegator data
  let delegatorData = bondingManager.getDelegator(delegatorAddress);

  // Update delegate's total stake
  transcoder.totalStake = totalStake;

  // Remove delegator from delegate
  let delegators = transcoder.delegators;
  if (delegators != null) {
    let i = delegators.indexOf(delegatorAddress.toHex());
    delegators.splice(i, 1);
    transcoder.delegators = delegators;
  }

  // Update delegate's delegated amount
  delegate.delegatedAmount = delegateData.value3;

  // Remote delegate from delegator
  delegator.delegate = null;

  // Update delegator's start round
  delegator.startRound = delegatorData.value4.toString();

  // Update delegator's last claim round
  delegator.lastClaimRound = currentRound.toString();

  // Update delegator's bonded amount
  delegator.bondedAmount = delegatorData.value0;

  // Update delegator's fees
  delegator.fees = delegatorData.value1;

  // Update delegator's pending stake
  delegator.pendingStake = BigInt.fromI32(0);

  // Update delegator's pending fees
  delegator.pendingFees = BigInt.fromI32(0);

  // Apply store updates
  delegate.save();
  delegator.save();
  transcoder.save();
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegatorAddress = event.params.delegator;
  let delegator = Delegator.load(delegatorAddress.toHex());
  delegator.bondedAmount = BigInt.fromI32(0);
  delegator.save();
}
