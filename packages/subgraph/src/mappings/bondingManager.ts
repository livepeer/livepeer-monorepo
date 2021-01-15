// Import types and APIs from graph-ts
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
  let protocol = Protocol.load("0");
  let round = createOrLoadRound(event.block.number);
  let transcoder = createOrLoadTranscoder(event.params.newDelegate.toHex());
  let delegate = createOrLoadDelegator(event.params.newDelegate.toHex());
  let delegator = createOrLoadDelegator(event.params.delegator.toHex());

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
    let delegateData = bondingManager.getDelegator(event.params.oldDelegate);

    // if previous delegate was itself, set status and unassign reference to self
    if (event.params.oldDelegate.toHex() == event.params.delegator.toHex()) {
      oldTranscoder.status = "NotRegistered";
      oldTranscoder.delegator = null;
    }

    oldTranscoder.totalStake = convertToDecimal(delegateData.value3);
    oldDelegate.delegatedAmount = convertToDecimal(delegateData.value3);

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

  let bond = new BondEvent(makeEventId(event.transaction.hash, event.logIndex));
  bond.transaction = event.transaction.hash.toHex();
  bond.timestamp = event.block.timestamp.toI32();
  bond.round = round.id;
  bond.newDelegate = event.params.newDelegate.toHex();
  bond.oldDelegate = event.params.oldDelegate.toHex();
  bond.delegator = event.params.delegator.toHex();
  bond.bondedAmount = convertToDecimal(event.params.bondedAmount);
  bond.additionalAmount = convertToDecimal(event.params.additionalAmount);
  bond.save();
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
  let protocol = Protocol.load("0");
  let round = createOrLoadRound(event.block.number);
  let transcoder = createOrLoadTranscoder(event.params.delegate.toHex());
  let delegate = createOrLoadDelegator(event.params.delegate.toHex());
  let unbondingLock =
    UnbondingLock.load(uniqueUnbondingLockId) ||
    new UnbondingLock(uniqueUnbondingLockId);

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

  let unbond = new UnbondEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  unbond.transaction = event.transaction.hash.toHex();
  unbond.timestamp = event.block.timestamp.toI32();
  unbond.round = round.id;
  unbond.amount = amount;
  unbond.withdrawRound = unbondingLock.withdrawRound;
  unbond.unbondingLockId = event.params.unbondingLockId.toI32();
  unbond.delegate = event.params.delegate.toHex();
  unbond.delegator = delegator.id;
  unbond.save();
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

  // If rebonding from unbonded and is self-bonding then update transcoder status
  if (
    !delegator.delegate &&
    event.params.delegate.toHex() == event.params.delegator.toHex()
  ) {
    transcoder.status = "Registered";
    transcoder.delegator = event.params.delegator.toHex();
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

  let rebond = new RebondEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  rebond.transaction = event.transaction.hash.toHex();
  rebond.timestamp = event.block.timestamp.toI32();
  rebond.round = round.id;
  rebond.delegator = delegator.id;
  rebond.delegate = delegate.id;
  rebond.amount = convertToDecimal(event.params.amount);
  rebond.unbondingLockId = event.params.unbondingLockId.toI32();
  rebond.save();
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

  let withdrawStake = new WithdrawStakeEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  withdrawStake.transaction = event.transaction.hash.toHex();
  withdrawStake.timestamp = event.block.timestamp.toI32();
  withdrawStake.round = round.id;
  withdrawStake.amount = convertToDecimal(event.params.amount);
  withdrawStake.unbondingLockId = event.params.unbondingLockId.toI32();
  withdrawStake.delegator = event.params.delegator.toHex();
  withdrawStake.save();
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

  let withdrawFees = new WithdrawFeesEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  withdrawFees.transaction = event.transaction.hash.toHex();
  withdrawFees.timestamp = event.block.timestamp.toI32();
  withdrawFees.round = round.id;
  withdrawFees.amount = delegator.fees;
  withdrawFees.delegator = event.params.delegator.toHex();
  withdrawFees.save();

  delegator.bondedAmount = convertToDecimal(delegatorData.value0);
  delegator.fees = convertToDecimal(delegatorData.value1);
  delegator.withdrawnFees = delegator.withdrawnFees.plus(delegator.fees);
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
    protocol.numActiveTranscoders = bondingManager.getTranscoderPoolMaxSize();
  }

  if (event.params.param == "maxEarningsClaimsRounds") {
    protocol.maxEarningsClaimsRounds = bondingManager.maxEarningsClaimsRounds();
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

  let parameterUpdate = new ParameterUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  parameterUpdate.transaction = event.transaction.hash.toHex();
  parameterUpdate.timestamp = event.block.timestamp.toI32();
  parameterUpdate.param = event.params.param;
  parameterUpdate.round = protocol.currentRound;
  parameterUpdate.save();
}

// Handler for Reward events
export function reward(event: Reward): void {
  let transcoder = Transcoder.load(event.params.transcoder.toHex());
  let delegate = Delegator.load(event.params.transcoder.toHex());
  let protocol = Protocol.load("0");
  let round = createOrLoadRound(event.block.number);
  let poolId = makePoolId(event.params.transcoder.toHex(), round.id);
  let pool = Pool.load(poolId);

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

  let reward = new RewardEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  reward.transaction = event.transaction.hash.toHex();
  reward.timestamp = event.block.timestamp.toI32();
  reward.round = round.id;
  reward.rewardTokens = convertToDecimal(event.params.amount);
  reward.delegate = event.params.transcoder.toHex();
  reward.save();
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

  let transcoderSlashed = new TranscoderSlashedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderSlashed.transaction = event.transaction.hash.toHex();
  transcoderSlashed.timestamp = event.block.timestamp.toI32();
  transcoderSlashed.round = round.id;
  transcoderSlashed.delegate = event.params.transcoder.toHex();
  transcoderSlashed.save();
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

  let transcoderUpdate = new TranscoderUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderUpdate.transaction = event.transaction.hash.toHex();
  transcoderUpdate.timestamp = event.block.timestamp.toI32();
  transcoderUpdate.round = round.id;
  transcoderUpdate.rewardCut = event.params.rewardCut;
  transcoderUpdate.feeShare = event.params.feeShare;
  transcoderUpdate.delegate = event.params.transcoder.toHex();
  transcoderUpdate.save();
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

  let transcoderActivated = new TranscoderActivatedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderActivated.transaction = event.transaction.hash.toHex();
  transcoderActivated.timestamp = event.block.timestamp.toI32();
  transcoderActivated.round = round.id;
  transcoderActivated.activationRound = event.params.activationRound;
  transcoderActivated.delegate = event.params.transcoder.toHex();
  transcoderActivated.save();
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

  let transcoderDeactivated = new TranscoderDeactivatedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  transcoderDeactivated.transaction = event.transaction.hash.toHex();
  transcoderDeactivated.timestamp = event.block.timestamp.toI32();
  transcoderDeactivated.round = round.id;
  transcoderDeactivated.deactivationRound = event.params.deactivationRound;
  transcoderDeactivated.delegate = event.params.transcoder.toHex();
  transcoderDeactivated.save();
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

  let earningsClaimed = new EarningsClaimedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  earningsClaimed.transaction = event.transaction.hash.toHex();
  earningsClaimed.timestamp = event.block.timestamp.toI32();
  earningsClaimed.round = round.id;
  earningsClaimed.delegate = event.params.delegate.toHex();
  earningsClaimed.delegator = event.params.delegator.toHex();
  earningsClaimed.startRound = event.params.startRound.toString();
  earningsClaimed.endRound = event.params.startRound.toString();
  earningsClaimed.rewardTokens = convertToDecimal(event.params.rewards);
  earningsClaimed.fees = convertToDecimal(event.params.fees);
  earningsClaimed.save();
}
