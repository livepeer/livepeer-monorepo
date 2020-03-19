import { BigInt } from '@graphprotocol/graph-ts'
import { Yes as YesEvent, No as NoEvent } from '../types/templates/Poll/Poll'
import {
  Protocol,
  Poll,
  PollTally,
  Vote,
  No,
  Yes,
  Delegator,
  Transcoder,
} from '../types/schema'
import { makeEventId, makeVoteId } from '../../utils/helpers'

export function yes(event: YesEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let delegator = Delegator.load(event.params.voter.toHex())
  let poll = Poll.load(event.address.toHex()) as Poll
  let voteId = makeVoteId(event.params.voter.toHex(), poll.id)
  let vote = Vote.load(voteId) || new Vote(voteId)
  let delegate: Transcoder

  vote.poll = poll.id
  vote.choice = 'Yes'

  // If voter is a delegator and first time voting in this poll, set its vote stake
  if (!!delegator && !vote.voteStake) {
    vote.delegator = delegator.id
    delegate = Transcoder.load(delegator.delegate) as Transcoder

    // If voter is a registered orchestrator
    if (event.params.voter.toHex() == delegator.delegate) {
      vote.voteStake = delegate.totalStake
    } else {
      vote.voteStake = delegator.pendingStake
    }

    // If delegate is a registered orchestrator and not delegated to self
    if (
      delegate.status == 'Registered' &&
      event.params.voter.toHex() != delegator.delegate
    ) {
      let delegateVoteId = makeVoteId(delegate.id, poll.id)
      let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
      delegateVote.nonVoteStake = delegateVote.nonVoteStake.plus(
        vote.voteStake as BigInt,
      )
      delegateVote.save()
    }
  }

  vote.save()

  let votes = poll.votes ? poll.votes : new Array<string>()
  if (votes.indexOf(voteId) == -1) {
    votes.push(voteId)
    poll.votes = votes
  }

  poll.save()

  // if voter has stake, update poll tally
  if (vote.voteStake) {
    tallyVotes(poll)
  }

  // Save event data
  let yes = new Yes(makeEventId(event.transaction.hash, event.logIndex))
  yes.hash = event.transaction.hash.toHex()
  yes.blockNumber = event.block.number
  yes.gasUsed = event.transaction.gasUsed
  yes.gasPrice = event.transaction.gasPrice
  yes.timestamp = event.block.timestamp
  yes.from = event.transaction.from.toHex()
  yes.to = event.transaction.to.toHex()
  yes.round = protocol.currentRound
  yes.voter = event.params.voter.toHex()
  yes.save()
}

export function no(event: NoEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let delegator = Delegator.load(event.params.voter.toHex())
  let poll = Poll.load(event.address.toHex()) as Poll
  let voteId = makeVoteId(event.params.voter.toHex(), poll.id)
  let vote = Vote.load(voteId) || new Vote(voteId)
  let delegate: Transcoder

  vote.poll = poll.id
  vote.choice = 'No'

  // If voter is a delegator and first time voting in this poll, set its vote stake
  if (!!delegator && !vote.voteStake) {
    vote.delegator = delegator.id
    delegate = Transcoder.load(delegator.delegate) as Transcoder

    // If voter is a registered orchestrator
    if (event.params.voter.toHex() == delegator.delegate) {
      vote.voteStake = delegate.totalStake
    } else {
      vote.voteStake = delegator.pendingStake
      let delegateVoteId = makeVoteId(delegate.id, poll.id)
      let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
      delegateVote.nonVoteStake = delegateVote.nonVoteStake.plus(
        vote.voteStake as BigInt,
      )
      delegateVote.save()
    }
  }

  vote.save()

  let votes = poll.votes ? poll.votes : new Array<string>()
  if (votes.indexOf(voteId) == -1) {
    votes.push(voteId)
    poll.votes = votes
  }

  poll.save()

  // if voter has stake, update poll tally
  if (vote.voteStake) {
    tallyVotes(poll)
  }

  // Save event data
  let no = new No(makeEventId(event.transaction.hash, event.logIndex))
  no.hash = event.transaction.hash.toHex()
  no.blockNumber = event.block.number
  no.gasUsed = event.transaction.gasUsed
  no.gasPrice = event.transaction.gasPrice
  no.timestamp = event.block.timestamp
  no.from = event.transaction.from.toHex()
  no.to = event.transaction.to.toHex()
  no.round = protocol.currentRound
  no.voter = event.params.voter.toHex()
  no.save()
}

export function tallyVotes(poll: Poll): void {
  let pollTally = new PollTally(poll.id)
  let votes = poll.votes as Array<string>
  let v: Vote
  pollTally.yes = BigInt.fromI32(0)
  pollTally.no = BigInt.fromI32(0)
  for (let i = 0; i < votes.length; i++) {
    v = Vote.load(votes[i]) as Vote
    if (v.choice == 'Yes') {
      pollTally.yes = pollTally.yes.plus(
        v.voteStake.minus(v.nonVoteStake as BigInt),
      )
    } else {
      pollTally.no = pollTally.no.plus(
        v.voteStake.minus(v.nonVoteStake as BigInt),
      )
    }
  }
  pollTally.save()
}
