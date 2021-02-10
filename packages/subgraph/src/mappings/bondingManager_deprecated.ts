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

  let transcoderUpdate = new TranscoderUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderUpdate.transaction = event.transaction.hash.toHex();
  transcoderUpdate.timestamp = event.block.timestamp.toI32();
  transcoderUpdate.round = round.id;
  transcoderUpdate.delegate = event.params.transcoder.toHex();
  transcoderUpdate.rewardCut = event.params.pendingRewardCut as BigInt;
  transcoderUpdate.feeShare = event.params.pendingFeeShare as BigInt;
  transcoderUpdate.save();
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

  let transcoderResigned = new TranscoderResignedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderResigned.transaction = event.transaction.hash.toHex();
  transcoderResigned.timestamp = event.block.timestamp.toI32();
  transcoderResigned.round = round.id;
  transcoderResigned.delegate = event.params.transcoder.toHex();
  transcoderResigned.save();
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

  let transcoderEvicted = new TranscoderEvictedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderEvicted.transaction = event.transaction.hash.toHex();
  transcoderEvicted.timestamp = event.block.timestamp.toI32();
  transcoderEvicted.round = round.id;
  transcoderEvicted.delegate = event.params.transcoder.toHex();
  transcoderEvicted.save();
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

      let delegateData = bondingManager.getDelegator(
        Address.fromString(oldTranscoder.id)
      );

      oldTranscoder.totalStake = convertToDecimal(delegateData.value3);
      oldDelegate.delegatedAmount = convertToDecimal(delegateData.value3);

      oldDelegate.save();
      oldTranscoder.save();

      // keep track of how much new stake was moved this round
      round.movedStake = round.movedStake.plus(
        convertToDecimal(delegatorData.value0).minus(amount)
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

    let bond = new BondEvent(
      makeEventId(call.transaction.hash, call.transaction.index)
    );
    bond.transaction = call.transaction.hash.toHex();
    bond.timestamp = call.block.timestamp.toI32();
    bond.round = round.id;
    bond.oldDelegate = oldDelegateAddress.toHex();
    bond.newDelegate = newDelegateAddress.toHex();
    bond.bondedAmount = convertToDecimal(delegatorData.value0);
    bond.additionalAmount = amount;
    bond.delegator = delegatorAddress.toHex();
    bond.save();
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

  let unbond = new UnbondEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  unbond.transaction = event.transaction.hash.toHex();
  unbond.timestamp = event.block.timestamp.toI32();
  unbond.round = round.id;
  unbond.amount = convertToDecimal(delegatorData.value0);
  unbond.withdrawRound = delegatorData.value5;
  unbond.delegate = transcoderAddress;
  unbond.delegator = event.params.delegator.toHex();
  unbond.save();
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

    let earningsClaimed = new EarningsClaimedEvent(
      makeEventId(call.transaction.hash, call.transaction.index)
    );
    earningsClaimed.transaction = call.transaction.hash.toHex();
    earningsClaimed.timestamp = call.block.timestamp.toI32();
    earningsClaimed.round = round.id;
    earningsClaimed.delegate = delegator.id;
    earningsClaimed.delegator = delegatorAddress.toHex();
    earningsClaimed.startRound = integer.fromString(lastClaimRound);
    earningsClaimed.endRound = endRound.toString();
    earningsClaimed.rewardTokens = convertToDecimal(delegatorData.value0).minus(
      bondedAmount
    );
    earningsClaimed.fees = convertToDecimal(delegatorData.value1).minus(
      delegator.fees
    );
    earningsClaimed.save();
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

  let withdrawStake = new WithdrawStakeEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  withdrawStake.transaction = event.transaction.hash.toHex();
  withdrawStake.timestamp = event.block.timestamp.toI32();
  withdrawStake.round = round.id;
  withdrawStake.amount = delegator.bondedAmount;
  withdrawStake.delegator = event.params.delegator.toHex();
  withdrawStake.save();

  delegator.bondedAmount = ZERO_BD;
  delegator.save();
}
