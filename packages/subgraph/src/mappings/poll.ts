import { BigDecimal } from "@graphprotocol/graph-ts";
import { Vote as VoteEventParam } from "../types/templates/Poll/Poll";
import {
  Transaction,
  Poll,
  PollTally,
  Vote,
  Delegator,
  Transcoder,
  VoteEvent,
} from "../types/schema";
import {
  makeVoteId,
  getBondingManagerAddress,
  convertToDecimal,
  ZERO_BD,
  ZERO_BI,
  ONE_BI,
  makeEventId,
  createOrLoadRound,
} from "../../utils/helpers";
import {
  DataSourceContext,
  Address,
  dataSource,
} from "@graphprotocol/graph-ts";
import { PollTallyTemplate } from "../types/templates";
import { BondingManager } from "../types/BondingManager/BondingManager";
import { integer } from "@protofire/subgraph-toolkit";

export function vote(event: VoteEventParam): void {
  // Vote must be a "Yes" or "No"
  if (
    event.params.choiceID.notEqual(ZERO_BI) &&
    event.params.choiceID.notEqual(ONE_BI)
  ) {
    return;
  }
  let round = createOrLoadRound(event.block.number);
  let poll = Poll.load(event.address.toHex()) as Poll;
  let voteId = makeVoteId(event.params.voter.toHex(), poll.id);

  let vote = Vote.load(voteId);
  if (vote == null) {
    vote = new Vote(voteId);
    // bool types must be set to something before they can accessed
    vote.registeredTranscoder = false;
  }

  let firstTimeVoter = vote.choiceID == null;

  if (event.params.choiceID.equals(ZERO_BI)) {
    vote.choiceID = "Yes";
  } else {
    vote.choiceID = "No";
  }

  if (firstTimeVoter) {
    vote.voter = event.params.voter.toHex();
    vote.poll = poll.id;

    // add vote to poll
    let pollVotes = poll.votes ? poll.votes : new Array<string>();
    pollVotes.push(voteId);
    poll.votes = pollVotes;
    poll.save();

    // if voter is a delegator
    let delegator = Delegator.load(event.params.voter.toHex());
    if (delegator) {
      let delegate = Transcoder.load(delegator.delegate) as Transcoder;

      // If voter is a registered transcoder
      if (event.params.voter.toHex() == delegator.delegate) {
        vote.voteStake = delegate.totalStake as BigDecimal;
        vote.registeredTranscoder = true;
      } else {
        let bondingManagerAddress = getBondingManagerAddress(
          dataSource.network()
        );
        let bondingManager = BondingManager.bind(
          Address.fromString(bondingManagerAddress)
        );
        let pendingStake = convertToDecimal(
          bondingManager.pendingStake(
            event.params.voter,
            integer.fromString(round.id)
          )
        );
        vote.voteStake = pendingStake;
        vote.registeredTranscoder = false;

        // update delegate's vote
        let delegateVoteId = makeVoteId(delegate.id, poll.id);
        let delegateVote =
          Vote.load(delegateVoteId) || new Vote(delegateVoteId);
        if (delegate.status == "Registered") {
          delegateVote.registeredTranscoder = true;
        } else {
          delegateVote.registeredTranscoder = false;
        }
        delegateVote.voter = delegate.id;

        delegateVote.nonVoteStake = delegateVote.nonVoteStake.plus(
          vote.voteStake as BigDecimal
        );
        delegateVote.save();
      }
    }

    // Watch for events specified in PollTallyTemplate, and trigger handlers
    // with this context
    let context = new DataSourceContext();
    context.setString("poll", poll.id);
    context.setString("voter", event.params.voter.toHex());
    let bondingManagerAddress = getBondingManagerAddress(dataSource.network());
    PollTallyTemplate.createWithContext(
      Address.fromString(bondingManagerAddress),
      context
    );
  }

  vote.save();

  // if voter has stake, update poll tally
  if (vote.voteStake) {
    tallyVotes(poll);
  }

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

  let voteEvent = new VoteEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  voteEvent.transaction = event.transaction.hash.toHex();
  voteEvent.timestamp = event.block.timestamp.toI32();
  voteEvent.round = round.id;
  voteEvent.choiceID = event.params.choiceID;
  voteEvent.voter = event.params.voter.toHex();
  voteEvent.poll = event.address.toHex();
  voteEvent.save();
}

export function tallyVotes(poll: Poll): void {
  let pollTally = new PollTally(poll.id);
  let votes = poll.votes as Array<string>;
  let v: Vote;
  let nonVoteStake = ZERO_BD;
  pollTally.yes = ZERO_BD;
  pollTally.no = ZERO_BD;

  for (let i = 0; i < votes.length; i++) {
    v = Vote.load(votes[i]) as Vote;

    // Only subtract nonVoteStake if delegate was registered during poll period
    nonVoteStake = v.registeredTranscoder
      ? (v.nonVoteStake as BigDecimal)
      : ZERO_BD;

    if (v.choiceID == "Yes") {
      pollTally.yes = pollTally.yes.plus(v.voteStake.minus(nonVoteStake));
    }
    if (v.choiceID == "No") {
      pollTally.no = pollTally.no.plus(v.voteStake.minus(nonVoteStake));
    }
  }
  pollTally.save();
}
