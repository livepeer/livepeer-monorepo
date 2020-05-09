import { BigInt } from '@graphprotocol/graph-ts'
import { Vote as VoteEvent } from '../types/templates/Poll/Poll'
import {
  Protocol,
  Poll,
  PollTally,
  Vote,
  Delegator,
  Transcoder,
} from '../types/schema'
import { makeVoteId, getBondingManagerAddress } from '../../utils/helpers'
import { DataSourceContext, Address, dataSource } from '@graphprotocol/graph-ts'
import { PollTallyTemplate } from '../types/templates'
import { BondingManager } from '../types/BondingManager_streamflow/BondingManager'

export function vote(event: VoteEvent): void {
  // Vote must be a "Yes" or "No"
  if (
    event.params.choiceID.notEqual(BigInt.fromI32(0)) &&
    event.params.choiceID.notEqual(BigInt.fromI32(1))
  ) {
    return
  }

  let poll = Poll.load(event.address.toHex()) as Poll
  let voteId = makeVoteId(event.params.voter.toHex(), poll.id)

  let vote = Vote.load(voteId)
  if (vote == null) {
    vote = new Vote(voteId)
    // bool types must be set to something before they can accessed
    vote.registeredTranscoder = false
  }

  let firstTimeVoter = vote.choiceID == null

  if (event.params.choiceID.equals(BigInt.fromI32(0))) {
    vote.choiceID = 'Yes'
  } else {
    vote.choiceID = 'No'
  }

  if (firstTimeVoter) {
    vote.voter = event.params.voter.toHex()
    vote.poll = poll.id

    // add vote to poll
    let pollVotes = poll.votes ? poll.votes : new Array<string>()
    pollVotes.push(voteId)
    poll.votes = pollVotes
    poll.save()

    // if voter is a delegator
    let delegator = Delegator.load(event.params.voter.toHex())
    if (delegator) {
      let delegate = Transcoder.load(delegator.delegate) as Transcoder

      // If voter is a registered transcoder
      if (event.params.voter.toHex() == delegator.delegate) {
        vote.voteStake = delegate.totalStake
        vote.registeredTranscoder = true
      } else {
        let bondingManagerAddress = getBondingManagerAddress(
          dataSource.network(),
        )
        let bondingManager = BondingManager.bind(
          Address.fromString(bondingManagerAddress),
        )
        let protocol = Protocol.load('0') || new Protocol('0')
        let pendingStake = bondingManager.pendingStake(
          event.params.voter,
          BigInt.fromI32(protocol.currentRound as i32),
        )
        vote.voteStake = pendingStake
        vote.registeredTranscoder = false

        // update delegate's vote
        let delegateVoteId = makeVoteId(delegate.id, poll.id)
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        if (delegate.status == 'Registered') {
          delegateVote.registeredTranscoder = true
        } else {
          delegateVote.registeredTranscoder = false
        }
        delegateVote.voter = delegate.id
        delegateVote.nonVoteStake = delegateVote.nonVoteStake.plus(
          vote.voteStake as BigInt,
        )
        delegateVote.save()
      }
    }

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
  let nonVoteStake = BigInt.fromI32(0)
  pollTally.yes = BigInt.fromI32(0)
  pollTally.no = BigInt.fromI32(0)

  for (let i = 0; i < votes.length; i++) {
    v = Vote.load(votes[i]) as Vote

    // Only subtract nonVoteStake if delegate was registered during poll period
    nonVoteStake = v.registeredTranscoder
      ? (v.nonVoteStake as BigInt)
      : BigInt.fromI32(0)

    if (v.choiceID == 'Yes') {
      pollTally.yes = pollTally.yes.plus(v.voteStake.minus(nonVoteStake))
    }
    if (v.choiceID == 'No') {
      pollTally.no = pollTally.no.plus(v.voteStake.minus(nonVoteStake))
    }
  }
  pollTally.save()
}
