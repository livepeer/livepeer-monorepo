import {
  Address,
  BigDecimal,
  BigInt,
  dataSource,
} from "@graphprotocol/graph-ts";

import {
  BondingManager,
  Reward,
  Bond,
  Unbond,
  Rebond,
  EarningsClaimed,
} from "../types/BondingManager/BondingManager";

import { Delegator, Poll, Vote, Transcoder } from "../types/schema";

import {
  makeVoteId,
  EMPTY_ADDRESS,
  convertToDecimal,
  createOrLoadRound,
} from "../../utils/helpers";
import { tallyVotes } from "./poll";
import { integer } from "@protofire/subgraph-toolkit";

export function updatePollTallyOnReward(event: Reward): void {
  let voterAddress = dataSource.context().getString("voter");
  let delegator = Delegator.load(voterAddress) as Delegator;

  // Return if transcoder that called reward isn't voter's delegate
  if (
    delegator == null ||
    delegator.delegate != event.params.transcoder.toHex()
  ) {
    return;
  }

  let pollAddress = dataSource.context().getString("poll");
  let poll = Poll.load(pollAddress) as Poll;

  // Return if poll is no longer active
  if (poll.endBlock.lt(event.block.number)) {
    return;
  }

  let round = createOrLoadRound(event.block.number);
  let voteId = makeVoteId(delegator.id, poll.id);
  let vote = Vote.load(voteId);
  let transcoder = Transcoder.load(event.params.transcoder.toHex());

  // update vote stakes
  if (voterAddress == event.params.transcoder.toHex()) {
    vote.voteStake = transcoder.totalStake as BigDecimal;
  } else {
    let bondingManager = BondingManager.bind(event.address);
    let pendingStake = convertToDecimal(
      bondingManager.pendingStake(
        Address.fromString(voterAddress),
        integer.fromString(round.id)
      )
    );

    let delegateVoteId = makeVoteId(event.params.transcoder.toHex(), poll.id);
    let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId);
    delegateVote.voter = event.params.transcoder.toHex();

    // update nonVoteStake
    delegateVote.nonVoteStake = delegateVote.nonVoteStake
      .minus(vote.voteStake as BigDecimal)
      .plus(pendingStake);

    delegateVote.save();

    vote.voteStake = pendingStake;
  }

  vote.save();
  tallyVotes(poll);
}

export function updatePollTallyOnBond(event: Bond): void {
  let pollAddress = dataSource.context().getString("poll");
  let poll = Poll.load(pollAddress) as Poll;

  // Return if poll is no longer active
  if (poll.endBlock.lt(event.block.number)) {
    return;
  }

  let voterAddress = dataSource.context().getString("voter");
  let updateTally = false;
  let isSwitchingDelegates =
    event.params.oldDelegate.toHex() != EMPTY_ADDRESS.toHex() &&
    event.params.oldDelegate.toHex() != event.params.newDelegate.toHex();
  let oldDelegateVoteId = makeVoteId(
    event.params.oldDelegate.toHex(),
    pollAddress
  );
  let oldDelegateVote = Vote.load(oldDelegateVoteId);
  let oldDelegate = Transcoder.load(event.params.oldDelegate.toHex());
  let newDelegateVoteId = makeVoteId(
    event.params.newDelegate.toHex(),
    pollAddress
  );
  let newDelegateVote = Vote.load(newDelegateVoteId);
  let newDelegate = Transcoder.load(event.params.newDelegate.toHex());
  let voteId = makeVoteId(voterAddress, pollAddress);
  let vote = Vote.load(voteId);
  let bondedAmount = convertToDecimal(event.params.bondedAmount);

  if (oldDelegateVote) {
    updateTally = true;
    if (oldDelegate.status == "Registered") {
      oldDelegateVote.registeredTranscoder = true;
    } else {
      oldDelegateVote.registeredTranscoder = false;
    }
    if (isSwitchingDelegates) {
      // if old delegate voted, update its vote stake
      if (oldDelegateVote.choiceID != null) {
        oldDelegateVote.voteStake = oldDelegate.totalStake as BigDecimal;
      }

      // if caller is voter, remove its nonVoteStake from old delegate
      if (voterAddress == event.params.delegator.toHex()) {
        oldDelegateVote.nonVoteStake = oldDelegateVote.nonVoteStake.minus(
          bondedAmount.minus(convertToDecimal(event.params.additionalAmount))
        );
      }
    }
    oldDelegateVote.save();
  }

  if (newDelegateVote) {
    updateTally = true;
    if (newDelegate.status == "Registered") {
      newDelegateVote.registeredTranscoder = true;
      if (newDelegateVote.choiceID != null) {
        newDelegateVote.voteStake = newDelegate.totalStake as BigDecimal;
      }
    } else {
      newDelegateVote.registeredTranscoder = false;
    }
    newDelegateVote.save();
  }

  // if caller is voter and *not* a registered transcoder update its vote
  if (
    voterAddress == event.params.delegator.toHex() &&
    voterAddress != event.params.newDelegate.toHex()
  ) {
    updateTally = true;

    // if delegate has not voted, create a "placeholder" vote for tracking
    // nonVoteStake in case it happens to register during the poll period
    if (newDelegateVote == null) {
      newDelegateVote = new Vote(newDelegateVoteId);
      if (newDelegate.status == "Registered") {
        newDelegateVote.registeredTranscoder = true;
      } else {
        newDelegateVote.registeredTranscoder = false;
      }
    }

    newDelegateVote.voter = event.params.newDelegate.toHex();

    // if switching, add stake to new delegate's nonVoteStake, otherwise update
    // new delegate's nonVoteStake
    if (isSwitchingDelegates) {
      newDelegateVote.nonVoteStake = newDelegateVote.nonVoteStake.plus(
        bondedAmount
      );
    } else {
      newDelegateVote.nonVoteStake = newDelegateVote.nonVoteStake
        .minus(vote.voteStake as BigDecimal)
        .plus(bondedAmount);
    }

    newDelegateVote.save();

    vote.voteStake = bondedAmount;
    vote.save();
  }

  // if delegator, oldDelegate, or newDelegate attached to event voted in poll
  // then update the tally
  if (updateTally) {
    tallyVotes(poll);
  }
}

export function updatePollTallyOnUnbond(event: Unbond): void {
  updatePollTally(event);
}

export function updatePollTallyOnRebond(event: Rebond): void {
  updatePollTally(event);
}

export function updatePollTallyOnEarningsClaimed(event: EarningsClaimed): void {
  // After LIP-36 the pending stake of other delegators does not change
  // after earnings are claimed so after the LIP-36 mainnet upgrade block
  // we stop updating all voters vote weight on each EarningsClaimed event
  if (
    dataSource.network() != "mainnet" ||
    event.block.number.gt(BigInt.fromI32(10972586))
  ) {
    return;
  }

  let voterAddress = dataSource.context().getString("voter");
  let delegator = Delegator.load(voterAddress) as Delegator;

  // Return if the voter doesn't share the same delegate as the delegator that claimed earnings
  if (
    delegator == null ||
    delegator.delegate != event.params.delegate.toHex()
  ) {
    return;
  }

  let pollAddress = dataSource.context().getString("poll");
  let poll = Poll.load(pollAddress) as Poll;

  // Return if poll is no longer active
  if (poll.endBlock.lt(event.block.number)) {
    return;
  }

  let round = createOrLoadRound(event.block.number);
  let voteId = makeVoteId(voterAddress, pollAddress);
  let vote = Vote.load(voteId);
  let transcoder = Transcoder.load(voterAddress);

  if (transcoder.status == "Registered") {
    vote.voteStake = transcoder.totalStake as BigDecimal;
  } else {
    let bondingManager = BondingManager.bind(event.address);
    let pendingStake = convertToDecimal(
      bondingManager.pendingStake(
        Address.fromString(voterAddress),
        integer.fromString(round.id)
      )
    );

    let delegateVoteId = makeVoteId(event.params.delegate.toHex(), poll.id);
    let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId);
    delegateVote.voter = event.params.delegate.toHex();

    // update delegate nonVoteStake
    delegateVote.nonVoteStake = delegateVote.nonVoteStake
      .minus(vote.voteStake as BigDecimal)
      .plus(pendingStake);
    delegateVote.save();
    // update voteStake
    vote.voteStake = pendingStake;
  }
  vote.save();
  tallyVotes(poll);
}

function updatePollTally<T extends Rebond>(event: T): void {
  let pollAddress = dataSource.context().getString("poll");
  let poll = Poll.load(pollAddress) as Poll;
  let updateTally = false;

  // Return if poll is no longer active
  if (poll.endBlock.lt(event.block.number)) {
    return;
  }

  let round = createOrLoadRound(event.block.number);
  let voterAddress = dataSource.context().getString("voter");
  let voteId = makeVoteId(voterAddress, pollAddress);
  let vote = Vote.load(voteId);
  let delegateVoteId = makeVoteId(event.params.delegate.toHex(), pollAddress);
  let delegateVote = Vote.load(delegateVoteId);
  let delegate = Transcoder.load(event.params.delegate.toHex());
  let bondingManager = BondingManager.bind(event.address);

  if (delegateVote) {
    updateTally = true;
    if (delegate.status == "Registered") {
      delegateVote.registeredTranscoder = true;
      if (delegateVote.choiceID != null) {
        delegateVote.voteStake = delegate.totalStake as BigDecimal;
      }
    } else {
      delegateVote.registeredTranscoder = false;
      if (delegateVote.choiceID != null) {
        delegateVote.voteStake = convertToDecimal(
          bondingManager.pendingStake(
            event.params.delegate,
            integer.fromString(round.id)
          )
        );
      }
    }
    delegateVote.save();
  }

  if (
    voterAddress == event.params.delegator.toHex() &&
    voterAddress != event.params.delegate.toHex()
  ) {
    updateTally = true;

    let pendingStake = convertToDecimal(
      bondingManager.pendingStake(
        Address.fromString(voterAddress),
        integer.fromString(round.id)
      )
    );

    if (delegateVote == null) {
      delegateVote = new Vote(delegateVoteId);
    }
    delegateVote.voter = event.params.delegate.toHex();
    delegateVote.nonVoteStake = delegateVote.nonVoteStake
      .minus(vote.voteStake as BigDecimal)
      .plus(pendingStake);
    if (delegate.status == "Registered") {
      delegateVote.registeredTranscoder = true;
    } else {
      delegateVote.registeredTranscoder = false;
    }
    vote.voteStake = pendingStake;

    delegateVote.save();
    vote.save();
  }

  // if delegator or delegate attached to event voted in poll then update tally
  if (updateTally) {
    tallyVotes(poll);
  }
}
