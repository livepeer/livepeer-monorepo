import { BigInt } from '@graphprotocol/graph-ts'
import { Vote as VoteEvent } from '../types/templates/Poll/Poll'
import {
  Protocol,
  Poll,
  PollTally,
  Vote,
  Delegator,
  Transcoder,
  Voter,
} from '../types/schema'
import { makeVoteId, getBondingManagerAddress } from '../../utils/helpers'
import { DataSourceContext, Address, dataSource } from '@graphprotocol/graph-ts'
import { PollTallyTemplate } from '../types/templates'
import { BondingManager } from '../types/BondingManager_streamflow/BondingManager'

export function vote(event: VoteEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let delegator = Delegator.load(event.params.voter.toHex())
  let voter =
    Voter.load(event.params.voter.toHex()) ||
    new Voter(event.params.voter.toHex())
  let poll = Poll.load(event.address.toHex()) as Poll
  let voteId = makeVoteId(event.params.voter.toHex(), poll.id)
  let vote = Vote.load(voteId) || new Vote(voteId)
  let delegate: Transcoder

  if (event.params.choiceID.equals(BigInt.fromI32(0))) {
    vote.choiceID = 'Yes'
  } else if (event.params.choiceID.equals(BigInt.fromI32(1))) {
    vote.choiceID = 'No'
  } else {
    return
  }

  // If first time voting in this poll
  let pollVotes = poll.votes ? poll.votes : new Array<string>()
  if (pollVotes.indexOf(voteId) == -1) {
    vote.voter = event.params.voter.toHex()
    vote.poll = poll.id

    pollVotes.push(voteId)
    poll.votes = pollVotes

    // if voter is a delegator
    if (delegator) {
      delegate = Transcoder.load(delegator.delegate) as Transcoder

      // If voter is a registered orchestrator
      if (event.params.voter.toHex() == delegator.delegate) {
        vote.voteStake = delegate.totalStake
      } else {
        let bondingManagerAddress = getBondingManagerAddress(
          dataSource.network(),
        )
        let bondingManager = BondingManager.bind(
          Address.fromString(bondingManagerAddress),
        )
        let pendingStake = bondingManager.pendingStake(
          event.params.voter,
          BigInt.fromI32(protocol.currentRound as i32),
        )
        vote.voteStake = pendingStake
      }

      // If delegate is a registered orchestrator and not delegated to self
      if (
        delegate.status == 'Registered' &&
        event.params.voter.toHex() != delegator.delegate
      ) {
        let delegateVoteId = makeVoteId(delegate.id, poll.id)
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.voter = delegate.id
        delegateVote.nonVoteStake = delegateVote.nonVoteStake.plus(
          vote.voteStake as BigInt,
        )
        delegateVote.save()
      }
    }

    poll.save()
    voter.save()

    // Watch for events specified in PollTallyTemplate, and trigger handlers
    // with this context
    let context = new DataSourceContext()
    context.setString('poll', poll.id)
    context.setString('voter', event.params.voter.toHex())
    let bondingManagerAddress = getBondingManagerAddress(dataSource.network())
    PollTallyTemplate.createWithContext(
      Address.fromString(bondingManagerAddress),
      context,
    )
  }

  vote.save()

  // if voter has stake, update poll tally
  if (vote.voteStake) {
    tallyVotes(poll)
  }
}

export function tallyVotes(poll: Poll): void {
  let pollTally = new PollTally(poll.id)
  let votes = poll.votes as Array<string>
  let v: Vote
  pollTally.yes = BigInt.fromI32(0)
  pollTally.no = BigInt.fromI32(0)
  for (let i = 0; i < votes.length; i++) {
    v = Vote.load(votes[i]) as Vote
    if (v.choiceID == 'Yes') {
      pollTally.yes = pollTally.yes.plus(
        v.voteStake.minus(v.nonVoteStake as BigInt),
      )
    }
    if (v.choiceID == 'No') {
      pollTally.no = pollTally.no.plus(
        v.voteStake.minus(v.nonVoteStake as BigInt),
      )
    }
  }
  pollTally.save()
}
