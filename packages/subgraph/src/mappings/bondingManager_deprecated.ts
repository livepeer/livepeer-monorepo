import { Address, BigInt } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  ClaimEarningsCall,
  BondCall,
  Unbond,
  WithdrawStake,
  TranscoderUpdate,
  TranscoderResigned,
  TranscoderEvicted,
} from "../types/BondingManagerV1/BondingManager";

// Import entity types generated from the GraphQL schema
import {
  Transaction,
  Transcoder,
  Delegator,
  Protocol,
  TranscoderUpdateEvent,
  TranscoderResignedEvent,
  TranscoderEvictedEvent,
  BondEvent,
  UnbondEvent,
  EarningsClaimedEvent,
  WithdrawStakeEvent,
} from "../types/schema";

import {
  makeEventId,
  convertToDecimal,
  ZERO_BD,
  EMPTY_ADDRESS,
  createOrLoadDelegator,
  createOrLoadTranscoder,
  createOrLoadRound,
} from "../../utils/helpers";
import { integer } from "@protofire/subgraph-toolkit";

// Handler for TranscoderUpdate events
export function transcoderUpdate(event: TranscoderUpdate): void {
  let bondingManager = BondingManager.bind(event.address);
  let round = createOrLoadRound(event.block.number);
  let transcoder = createOrLoadTranscoder(event.params.transcoder.toHex());
  let active = bondingManager.isActiveTranscoder(
    event.params.transcoder,
    integer.fromString(round.id)
  );

  // Update transcoder
  transcoder.delegator = event.params.transcoder.toHex();
  transcoder.pendingRewardCut = event.params.pendingRewardCut as BigInt;
  transcoder.pendingFeeShare = event.params.pendingFeeShare as BigInt;
  transcoder.pendingPricePerSegment = event.params.pendingPricePerSegment;
  transcoder.active = active;
  transcoder.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let transcoderUpdateEvent = new TranscoderUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderUpdateEvent.transaction = event.transaction.hash.toHex();
  transcoderUpdateEvent.timestamp = event.block.timestamp.toI32();
  transcoderUpdateEvent.round = round.id;
  transcoderUpdateEvent.delegate = event.params.transcoder.toHex();
  transcoderUpdateEvent.rewardCut = event.params.pendingRewardCut as BigInt;
  transcoderUpdateEvent.feeShare = event.params.pendingFeeShare as BigInt;
  transcoderUpdateEvent.save();
}

// Handler for TranscoderResigned events
export function transcoderResigned(event: TranscoderResigned): void {
  let transcoder = Transcoder.load(event.params.transcoder.toHex());
  let round = createOrLoadRound(event.block.number);

  // Update transcoder
  transcoder.active = false;
  transcoder.status = "NotRegistered";
  transcoder.delegator = null;
  transcoder.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let transcoderResignedEvent = new TranscoderResignedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderResignedEvent.transaction = event.transaction.hash.toHex();
  transcoderResignedEvent.timestamp = event.block.timestamp.toI32();
  transcoderResignedEvent.round = round.id;
  transcoderResignedEvent.delegate = event.params.transcoder.toHex();
  transcoderResignedEvent.save();
}

// Handler for TranscoderEvicted events
export function transcoderEvicted(event: TranscoderEvicted): void {
  let transcoder = Transcoder.load(event.params.transcoder.toHex());
  let round = createOrLoadRound(event.block.number);

  // Update transcoder
  transcoder.active = false;

  // Apply store updates
  transcoder.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let transcoderEvictedEvent = new TranscoderEvictedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderEvictedEvent.transaction = event.transaction.hash.toHex();
  transcoderEvictedEvent.timestamp = event.block.timestamp.toI32();
  transcoderEvictedEvent.round = round.id;
  transcoderEvictedEvent.delegate = event.params.transcoder.toHex();
  transcoderEvictedEvent.save();
}

export function bond(call: BondCall): void {
  // After LIP11 was deployed (at block 6192000), we no longer have to rely on
  // this call handler to get the amount bonded.
  // https://forum.livepeer.org/t/tributary-release-protocol-upgrade/354
  if (call.block.number.le(BigInt.fromI32(6192000))) {
    let bondingManager = BondingManager.bind(call.to);
    let newDelegateAddress = call.inputs._to;
    let delegatorAddress = call.from;
    let oldDelegateAddress = EMPTY_ADDRESS;
    let amount = convertToDecimal(call.inputs._amount);
    let delegatorData = bondingManager.getDelegator(delegatorAddress);
    let delegateData = bondingManager.getDelegator(newDelegateAddress);
    let round = createOrLoadRound(call.block.number);
    let transcoder = createOrLoadTranscoder(newDelegateAddress.toHex());
    let delegate = createOrLoadDelegator(newDelegateAddress.toHex());
    let delegator = createOrLoadDelegator(delegatorAddress.toHex());
    let protocol = Protocol.load("0");

    if (delegator.delegate) {
      oldDelegateAddress = Address.fromString(delegator.delegate);
    }

    // If self delegating, set status and assign reference to self
    if (delegatorAddress.toHex() == newDelegateAddress.toHex()) {
      transcoder.status = "Registered";
      transcoder.delegator = delegatorAddress.toHex();
    }

    // Changing delegate
    if (
      delegator.delegate != null &&
      delegator.delegate != newDelegateAddress.toHex()
    ) {
      let oldTranscoder = Transcoder.load(
        oldDelegateAddress.toHex()
      ) as Transcoder;
      let oldDelegate = Delegator.load(oldDelegateAddress.toHex()) as Delegator;

      // if previous delegate was itself, set status and unassign reference to self
      if (oldDelegateAddress.toHex() == delegatorAddress.toHex()) {
        oldTranscoder.status = "NotRegistered";
        oldTranscoder.delegator = null;
      }

      let oldDelegateData = bondingManager.getDelegator(
        Address.fromString(oldTranscoder.id)
      );

      oldTranscoder.totalStake = convertToDecimal(oldDelegateData.value3);
      oldDelegate.delegatedAmount = convertToDecimal(oldDelegateData.value3);

      oldDelegate.save();
      oldTranscoder.save();

      // keep track of how much new stake was moved this round
      round.movedStake = round.movedStake.plus(
        convertToDecimal(oldDelegateData.value0).minus(amount)
      );

      // keep track of how much new stake was introduced this round
      round.newStake = round.newStake.plus(amount);

      round.save();
    }

    transcoder.totalStake = convertToDecimal(delegateData.value3);
    delegate.delegatedAmount = convertToDecimal(delegateData.value3);

    // delegator rebonding
    if (!delegator.delegate && delegator.bondedAmount.gt(ZERO_BD)) {
      delegator.unbonded = delegator.unbonded.minus(delegator.bondedAmount);
    }

    delegator.delegate = newDelegateAddress.toHex();
    delegator.lastClaimRound = round.id;
    delegator.bondedAmount = convertToDecimal(delegatorData.value0);
    delegator.fees = convertToDecimal(delegatorData.value1);
    delegator.startRound = delegatorData.value4;
    delegator.principal = delegator.principal.plus(amount);

    delegate.save();
    delegator.save();
    transcoder.save();
    protocol.save();

    let tx = new Transaction(call.transaction.hash.toHex());
    tx.blockNumber = call.block.number;
    tx.gasUsed = call.transaction.gasUsed;
    tx.gasPrice = call.transaction.gasPrice;
    tx.timestamp = call.block.timestamp.toI32();
    tx.from = call.transaction.from.toHex();
    tx.to = call.transaction.to.toHex();
    tx.save();

    let bondEvent = new BondEvent(
      makeEventId(call.transaction.hash, call.transaction.index)
    );
    bondEvent.transaction = call.transaction.hash.toHex();
    bondEvent.timestamp = call.block.timestamp.toI32();
    bondEvent.round = round.id;
    bondEvent.oldDelegate = oldDelegateAddress.toHex();
    bondEvent.newDelegate = newDelegateAddress.toHex();
    bondEvent.bondedAmount = convertToDecimal(delegatorData.value0);
    bondEvent.additionalAmount = amount;
    bondEvent.delegator = delegatorAddress.toHex();
    bondEvent.save();
  }
}

export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegator = Delegator.load(event.params.delegator.toHex());
  let transcoderAddress = delegator.delegate;
  let round = createOrLoadRound(event.block.number);
  let transcoder = Transcoder.load(transcoderAddress);
  let delegate = Delegator.load(transcoderAddress);
  let delegateData = bondingManager.getDelegator(
    Address.fromString(transcoderAddress)
  );
  let protocol = Protocol.load("0");
  let delegatorData = bondingManager.getDelegator(event.params.delegator);

  transcoder.totalStake = convertToDecimal(delegateData.value3);
  delegate.delegatedAmount = convertToDecimal(delegateData.value3);

  // Delegator no longer bonded to anyone
  delegator.delegate = null;
  delegator.lastClaimRound = round.id;
  delegator.bondedAmount = convertToDecimal(delegatorData.value0);
  delegator.fees = convertToDecimal(delegatorData.value1);
  delegator.startRound = delegatorData.value4;

  delegator.unbonded = delegator.unbonded.plus(
    convertToDecimal(delegatorData.value0)
  );

  // Apply store updates
  delegate.save();
  delegator.save();
  transcoder.save();
  protocol.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let unbondEvent = new UnbondEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  unbondEvent.transaction = event.transaction.hash.toHex();
  unbondEvent.timestamp = event.block.timestamp.toI32();
  unbondEvent.round = round.id;
  unbondEvent.amount = convertToDecimal(delegatorData.value0);
  unbondEvent.withdrawRound = delegatorData.value5;
  unbondEvent.delegate = transcoderAddress;
  unbondEvent.delegator = event.params.delegator.toHex();
  unbondEvent.save();
}

export function claimEarnings(call: ClaimEarningsCall): void {
  // The Streamflow release introduced an event emitter for EarningsClaimed, so
  // we can ignore this call handler henceforth after the block in which the
  // protocol was paused prior to the streamflow upgrade
  if (call.block.number.le(BigInt.fromI32(9274414))) {
    let delegatorAddress = call.from;
    let endRound = call.inputs._endRound;
    let round = createOrLoadRound(call.block.number);
    let delegator = createOrLoadDelegator(delegatorAddress.toHex());
    let bondingManager = BondingManager.bind(call.to);
    let delegatorData = bondingManager.getDelegator(delegatorAddress);
    let bondedAmount = delegator.bondedAmount;
    let lastClaimRound = delegator.lastClaimRound;

    delegator.bondedAmount = convertToDecimal(delegatorData.value0);
    delegator.fees = convertToDecimal(delegatorData.value1);
    delegator.lastClaimRound = endRound.toString();
    delegator.save();

    let tx =
      Transaction.load(call.transaction.hash.toHex()) ||
      new Transaction(call.transaction.hash.toHex());
    tx.blockNumber = call.block.number;
    tx.gasUsed = call.transaction.gasUsed;
    tx.gasPrice = call.transaction.gasPrice;
    tx.timestamp = call.block.timestamp.toI32();
    tx.from = call.transaction.from.toHex();
    tx.to = call.transaction.to.toHex();
    tx.save();

    let earningsClaimedEvent = new EarningsClaimedEvent(
      makeEventId(call.transaction.hash, call.transaction.index)
    );
    earningsClaimedEvent.transaction = call.transaction.hash.toHex();
    earningsClaimedEvent.timestamp = call.block.timestamp.toI32();
    earningsClaimedEvent.round = round.id;
    earningsClaimedEvent.delegate = delegator.id;
    earningsClaimedEvent.delegator = delegatorAddress.toHex();
    earningsClaimedEvent.startRound = integer.fromString(lastClaimRound);
    earningsClaimedEvent.endRound = endRound.toString();
    earningsClaimedEvent.rewardTokens = convertToDecimal(
      delegatorData.value0
    ).minus(bondedAmount);
    earningsClaimedEvent.fees = convertToDecimal(delegatorData.value1).minus(
      delegator.fees
    );
    earningsClaimedEvent.save();
  }
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let delegator = Delegator.load(event.params.delegator.toHex());
  let round = createOrLoadRound(event.block.number);

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let withdrawStakeEvent = new WithdrawStakeEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  withdrawStakeEvent.transaction = event.transaction.hash.toHex();
  withdrawStakeEvent.timestamp = event.block.timestamp.toI32();
  withdrawStakeEvent.round = round.id;
  withdrawStakeEvent.amount = delegator.bondedAmount;
  withdrawStakeEvent.delegator = event.params.delegator.toHex();
  withdrawStakeEvent.save();

  delegator.bondedAmount = ZERO_BD;
  delegator.save();
}
