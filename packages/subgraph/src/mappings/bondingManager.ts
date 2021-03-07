import { store } from "@graphprotocol/graph-ts";

// Import event types from the registrar contract ABIs
import {
  BondingManager,
  WithdrawStake,
  Bond,
  Unbond,
  Rebond,
  WithdrawFees,
  Reward,
  TranscoderSlashed,
  TranscoderUpdate,
  TranscoderActivated,
  TranscoderDeactivated,
  EarningsClaimed,
  ParameterUpdate,
} from "../types/BondingManager/BondingManager";

import {
  BondEvent,
  Delegator,
  EarningsClaimedEvent,
  ParameterUpdateEvent,
  Pool,
  Protocol,
  RebondEvent,
  RewardEvent,
  Transaction,
  Transcoder,
  TranscoderActivatedEvent,
  TranscoderDeactivatedEvent,
  TranscoderSlashedEvent,
  TranscoderUpdateEvent,
  UnbondEvent,
  UnbondingLock,
  WithdrawFeesEvent,
  WithdrawStakeEvent,
} from "../types/schema";

import {
  makeUnbondingLockId,
  makeEventId,
  EMPTY_ADDRESS,
  convertToDecimal,
  createOrLoadTranscoder,
  createOrLoadDelegator,
  createOrLoadRound,
  makePoolId,
  MAXIMUM_VALUE_UINT256,
  createOrLoadProtocol,
} from "../../utils/helpers";

export function bond(event: Bond): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegateData = bondingManager.getDelegator(event.params.newDelegate);
  let delegatorData = bondingManager.getDelegator(event.params.delegator);
  let round = createOrLoadRound(event.block.number);
  let transcoder = createOrLoadTranscoder(event.params.newDelegate.toHex());
  let delegate = createOrLoadDelegator(event.params.newDelegate.toHex());
  let delegator = createOrLoadDelegator(event.params.delegator.toHex());
  let protocol = Protocol.load("0");

  // If self delegating, set status and assign reference to self
  if (event.params.delegator.toHex() == event.params.newDelegate.toHex()) {
    transcoder.status = "Registered";
    transcoder.delegator = event.params.delegator.toHex();
  }

  // Changing delegate
  if (
    event.params.oldDelegate.toHex() != EMPTY_ADDRESS.toHex() &&
    event.params.oldDelegate.toHex() != event.params.newDelegate.toHex()
  ) {
    let oldTranscoder = Transcoder.load(event.params.oldDelegate.toHex());
    let oldDelegate = Delegator.load(event.params.oldDelegate.toHex());
    let oldDelegateData = bondingManager.getDelegator(event.params.oldDelegate);

    // if previous delegate was itself, set status and unassign reference to self
    if (event.params.oldDelegate.toHex() == event.params.delegator.toHex()) {
      oldTranscoder.status = "NotRegistered";
      oldTranscoder.delegator = null;
    }

    oldTranscoder.totalStake = convertToDecimal(oldDelegateData.value3);
    oldDelegate.delegatedAmount = convertToDecimal(oldDelegateData.value3);

    oldDelegate.save();
    oldTranscoder.save();

    // keep track of how much stake moved during this round.
    round.movedStake = round.movedStake.plus(
      convertToDecimal(delegatorData.value0).minus(
        convertToDecimal(event.params.additionalAmount)
      )
    );

    // keep track of how much new stake was introduced this round
    round.newStake = round.newStake.plus(
      convertToDecimal(event.params.additionalAmount)
    );

    round.save();
  }

  transcoder.totalStake = convertToDecimal(delegateData.value3);
  delegate.delegatedAmount = convertToDecimal(delegateData.value3);

  delegator.delegate = event.params.newDelegate.toHex();
  delegator.lastClaimRound = round.id;
  delegator.bondedAmount = convertToDecimal(event.params.bondedAmount);
  delegator.fees = convertToDecimal(delegatorData.value1);
  delegator.startRound = delegatorData.value4;
  delegator.principal = delegator.principal.plus(
    convertToDecimal(event.params.additionalAmount)
  );

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

  let bondEvent = new BondEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  bondEvent.transaction = event.transaction.hash.toHex();
  bondEvent.timestamp = event.block.timestamp.toI32();
  bondEvent.round = round.id;
  bondEvent.newDelegate = event.params.newDelegate.toHex();
  bondEvent.oldDelegate = event.params.oldDelegate.toHex();
  bondEvent.delegator = event.params.delegator.toHex();
  bondEvent.bondedAmount = convertToDecimal(event.params.bondedAmount);
  bondEvent.additionalAmount = convertToDecimal(event.params.additionalAmount);
  bondEvent.save();
}

// Handler for Unbond events
export function unbond(event: Unbond): void {
  let bondingManager = BondingManager.bind(event.address);
  let uniqueUnbondingLockId = makeUnbondingLockId(
    event.params.delegator,
    event.params.unbondingLockId
  );
  let withdrawRound = event.params.withdrawRound;
  let amount = convertToDecimal(event.params.amount);
  let delegator = Delegator.load(event.params.delegator.toHex());
  let delegateData = bondingManager.getDelegator(event.params.delegate);
  let round = createOrLoadRound(event.block.number);
  let transcoder = createOrLoadTranscoder(event.params.delegate.toHex());
  let delegate = createOrLoadDelegator(event.params.delegate.toHex());
  let unbondingLock =
    UnbondingLock.load(uniqueUnbondingLockId) ||
    new UnbondingLock(uniqueUnbondingLockId);
  let protocol = Protocol.load("0");

  delegate.delegatedAmount = convertToDecimal(delegateData.value3);
  transcoder.totalStake = convertToDecimal(delegateData.value3);

  let delegatorData = bondingManager.getDelegator(event.params.delegator);
  delegator.lastClaimRound = round.id;
  delegator.bondedAmount = convertToDecimal(delegatorData.value0);
  delegator.fees = convertToDecimal(delegatorData.value1);
  delegator.startRound = delegatorData.value4;
  delegator.unbonded = delegator.unbonded.plus(
    convertToDecimal(event.params.amount)
  );

  // Delegator no longer delegated to anyone if it does not have a bonded amount
  // so remove it from delegate
  if (delegatorData.value0.isZero()) {
    // If unbonding from self and no longer has a bonded amount
    // update transcoder status and delegator
    if (event.params.delegator.toHex() == event.params.delegate.toHex()) {
      transcoder.status = "NotRegistered";
      transcoder.delegator = null;
    }

    // Update delegator's delegate
    delegator.delegate = null;
  }

  unbondingLock.unbondingLockId = event.params.unbondingLockId.toI32();
  unbondingLock.delegator = event.params.delegator.toHex();
  unbondingLock.delegate = event.params.delegate.toHex();
  unbondingLock.withdrawRound = withdrawRound;
  unbondingLock.amount = amount;

  // Apply store updates
  delegate.save();
  transcoder.save();
  unbondingLock.save();
  delegator.save();
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
  unbondEvent.amount = amount;
  unbondEvent.withdrawRound = unbondingLock.withdrawRound;
  unbondEvent.unbondingLockId = event.params.unbondingLockId.toI32();
  unbondEvent.delegate = event.params.delegate.toHex();
  unbondEvent.delegator = delegator.id;
  unbondEvent.save();
}

// Handler for Rebond events
export function rebond(event: Rebond): void {
  let bondingManager = BondingManager.bind(event.address);
  let uniqueUnbondingLockId = makeUnbondingLockId(
    event.params.delegator,
    event.params.unbondingLockId
  );
  let round = createOrLoadRound(event.block.number);
  let transcoder = Transcoder.load(event.params.delegate.toHex());
  let delegate = Delegator.load(event.params.delegate.toHex());
  let delegator = Delegator.load(event.params.delegator.toHex());
  let delegateData = bondingManager.getDelegator(event.params.delegate);
  let protocol = Protocol.load("0");

  // If rebonding from unbonded
  if (!delegator.delegate) {
    // If self-bonding then update transcoder status
    if (event.params.delegate.toHex() == event.params.delegator.toHex()) {
      transcoder.status = "Registered";
      transcoder.delegator = event.params.delegator.toHex();
    }
  }

  // update delegator
  let delegatorData = bondingManager.getDelegator(event.params.delegator);
  delegator.delegate = event.params.delegate.toHex();
  delegator.startRound = delegatorData.value4;
  delegator.lastClaimRound = round.id;
  delegator.bondedAmount = convertToDecimal(delegatorData.value0);
  delegator.fees = convertToDecimal(delegatorData.value1);
  delegator.unbonded = delegator.unbonded.minus(
    convertToDecimal(event.params.amount)
  );

  // update delegate
  delegate.delegatedAmount = convertToDecimal(delegateData.value3);
  transcoder.totalStake = convertToDecimal(delegateData.value3);

  // Apply store updates
  delegate.save();
  transcoder.save();
  delegator.save();
  protocol.save();
  store.remove("UnbondingLock", uniqueUnbondingLockId);

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

  let rebondEvent = new RebondEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  rebondEvent.transaction = event.transaction.hash.toHex();
  rebondEvent.timestamp = event.block.timestamp.toI32();
  rebondEvent.round = round.id;
  rebondEvent.delegator = delegator.id;
  rebondEvent.delegate = delegate.id;
  rebondEvent.amount = convertToDecimal(event.params.amount);
  rebondEvent.unbondingLockId = event.params.unbondingLockId.toI32();
  rebondEvent.save();
}

// Handler for WithdrawStake events
export function withdrawStake(event: WithdrawStake): void {
  let round = createOrLoadRound(event.block.number);

  let uniqueUnbondingLockId = makeUnbondingLockId(
    event.params.delegator,
    event.params.unbondingLockId
  );
  store.remove("UnbondingLock", uniqueUnbondingLockId);

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
  withdrawStakeEvent.amount = convertToDecimal(event.params.amount);
  withdrawStakeEvent.unbondingLockId = event.params.unbondingLockId.toI32();
  withdrawStakeEvent.delegator = event.params.delegator.toHex();
  withdrawStakeEvent.save();
}

export function withdrawFees(event: WithdrawFees): void {
  let bondingManager = BondingManager.bind(event.address);
  let delegator = Delegator.load(event.params.delegator.toHex());
  let delegatorData = bondingManager.getDelegator(event.params.delegator);
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

  let withdrawFeesEvent = new WithdrawFeesEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  withdrawFeesEvent.transaction = event.transaction.hash.toHex();
  withdrawFeesEvent.timestamp = event.block.timestamp.toI32();
  withdrawFeesEvent.round = round.id;
  withdrawFeesEvent.amount = delegator.fees;
  withdrawFeesEvent.delegator = event.params.delegator.toHex();
  withdrawFeesEvent.save();

  delegator.bondedAmount = convertToDecimal(delegatorData.value0);
  delegator.fees = convertToDecimal(delegatorData.value1);
  delegator.withdrawnFees = delegator.withdrawnFees.plus(
    withdrawFeesEvent.amount
  );
  delegator.lastClaimRound = round.id;
  delegator.save();
}

export function parameterUpdate(event: ParameterUpdate): void {
  let bondingManager = BondingManager.bind(event.address);
  let protocol = createOrLoadProtocol();

  if (event.params.param == "unbondingPeriod") {
    protocol.unbondingPeriod = bondingManager.unbondingPeriod();
  }

  if (event.params.param == "numActiveTranscoders") {
    protocol.numActiveTranscoders = bondingManager
      .getTranscoderPoolMaxSize()
      .toI32();
  }

  if (event.params.param == "maxEarningsClaimsRounds") {
    protocol.maxEarningsClaimsRounds = bondingManager
      .maxEarningsClaimsRounds()
      .toI32();
  }

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

  let parameterUpdateEvent = new ParameterUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  parameterUpdateEvent.transaction = event.transaction.hash.toHex();
  parameterUpdateEvent.timestamp = event.block.timestamp.toI32();
  parameterUpdateEvent.param = event.params.param;
  parameterUpdateEvent.round = protocol.currentRound;
  parameterUpdateEvent.save();
}

// Handler for Reward events
export function reward(event: Reward): void {
  let transcoder = Transcoder.load(event.params.transcoder.toHex());
  let delegate = Delegator.load(event.params.transcoder.toHex());
  let round = createOrLoadRound(event.block.number);
  let poolId = makePoolId(event.params.transcoder.toHex(), round.id);
  let pool = Pool.load(poolId);
  let protocol = Protocol.load("0");

  delegate.delegatedAmount = delegate.delegatedAmount.plus(
    convertToDecimal(event.params.amount)
  );

  pool.rewardTokens = convertToDecimal(event.params.amount);
  pool.feeShare = transcoder.feeShare;
  pool.rewardCut = transcoder.rewardCut;

  transcoder.totalStake = transcoder.totalStake.plus(
    convertToDecimal(event.params.amount)
  );
  transcoder.lastRewardRound = round.id;

  transcoder.save();
  delegate.save();
  pool.save();
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

  let rewardEvent = new RewardEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  rewardEvent.transaction = event.transaction.hash.toHex();
  rewardEvent.timestamp = event.block.timestamp.toI32();
  rewardEvent.round = round.id;
  rewardEvent.rewardTokens = convertToDecimal(event.params.amount);
  rewardEvent.delegate = event.params.transcoder.toHex();
  rewardEvent.save();
}

// Handler for TranscoderSlashed events
export function transcoderSlashed(event: TranscoderSlashed): void {
  let transcoder = Transcoder.load(event.params.transcoder.toHex());
  let bondingManager = BondingManager.bind(event.address);
  let round = createOrLoadRound(event.block.number);
  let delegateData = bondingManager.getDelegator(event.params.transcoder);

  // Update transcoder total stake
  transcoder.totalStake = convertToDecimal(delegateData.value3);

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

  let transcoderSlashedEvent = new TranscoderSlashedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderSlashedEvent.transaction = event.transaction.hash.toHex();
  transcoderSlashedEvent.timestamp = event.block.timestamp.toI32();
  transcoderSlashedEvent.round = round.id;
  transcoderSlashedEvent.delegate = event.params.transcoder.toHex();
  transcoderSlashedEvent.save();
}

export function transcoderUpdate(event: TranscoderUpdate): void {
  let round = createOrLoadRound(event.block.number);
  let transcoder = createOrLoadTranscoder(event.params.transcoder.toHex());
  transcoder.rewardCut = event.params.rewardCut;
  transcoder.feeShare = event.params.feeShare;
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
  transcoderUpdateEvent.rewardCut = event.params.rewardCut;
  transcoderUpdateEvent.feeShare = event.params.feeShare;
  transcoderUpdateEvent.delegate = event.params.transcoder.toHex();
  transcoderUpdateEvent.save();
}

export function transcoderActivated(event: TranscoderActivated): void {
  let round = createOrLoadRound(event.block.number);
  let transcoder = createOrLoadTranscoder(event.params.transcoder.toHex());
  transcoder.active = true;
  transcoder.lastActiveStakeUpdateRound = event.params.activationRound;
  transcoder.activationRound = event.params.activationRound;
  transcoder.deactivationRound = MAXIMUM_VALUE_UINT256;
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

  let transcoderActivatedEvent = new TranscoderActivatedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderActivatedEvent.transaction = event.transaction.hash.toHex();
  transcoderActivatedEvent.timestamp = event.block.timestamp.toI32();
  transcoderActivatedEvent.round = round.id;
  transcoderActivatedEvent.activationRound = event.params.activationRound;
  transcoderActivatedEvent.delegate = event.params.transcoder.toHex();
  transcoderActivatedEvent.save();
}

export function transcoderDeactivated(event: TranscoderDeactivated): void {
  let transcoder = Transcoder.load(event.params.transcoder.toHex());
  let round = createOrLoadRound(event.block.number);

  transcoder.active = false;
  transcoder.deactivationRound = event.params.deactivationRound;
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

  let transcoderDeactivatedEvent = new TranscoderDeactivatedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderDeactivatedEvent.transaction = event.transaction.hash.toHex();
  transcoderDeactivatedEvent.timestamp = event.block.timestamp.toI32();
  transcoderDeactivatedEvent.round = round.id;
  transcoderDeactivatedEvent.deactivationRound = event.params.deactivationRound;
  transcoderDeactivatedEvent.delegate = event.params.transcoder.toHex();
  transcoderDeactivatedEvent.save();
}

export function earningsClaimed(event: EarningsClaimed): void {
  let round = createOrLoadRound(event.block.number);
  let delegator = createOrLoadDelegator(event.params.delegator.toHex());
  delegator.lastClaimRound = event.params.endRound.toString();
  delegator.bondedAmount = delegator.bondedAmount.plus(
    convertToDecimal(event.params.rewards)
  );
  delegator.fees = delegator.fees.plus(convertToDecimal(event.params.fees));
  delegator.save();

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

  let earningsClaimedEvent = new EarningsClaimedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  earningsClaimedEvent.transaction = event.transaction.hash.toHex();
  earningsClaimedEvent.timestamp = event.block.timestamp.toI32();
  earningsClaimedEvent.round = round.id;
  earningsClaimedEvent.delegate = event.params.delegate.toHex();
  earningsClaimedEvent.delegator = event.params.delegator.toHex();
  earningsClaimedEvent.startRound = event.params.startRound;
  earningsClaimedEvent.endRound = event.params.endRound.toString();
  earningsClaimedEvent.rewardTokens = convertToDecimal(event.params.rewards);
  earningsClaimedEvent.fees = convertToDecimal(event.params.fees);
  earningsClaimedEvent.save();
}
