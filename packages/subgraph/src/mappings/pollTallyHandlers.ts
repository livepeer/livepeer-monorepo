import { Address, BigInt, dataSource } from '@graphprotocol/graph-ts'

import {
  BondingManager,
  Reward as RewardEvent,
  Bond as BondEvent,
  Unbond as UnbondEvent,
  Rebond as RebondEvent,
  EarningsClaimed as EarningsClaimedEvent,
} from '../types/BondingManager_streamflow/BondingManager'

import { Delegator, Protocol, Poll, Vote, Transcoder } from '../types/schema'

import { makeVoteId, EMPTY_ADDRESS } from '../../utils/helpers'
import { tallyVotes } from './poll'

export function updatePollTallyOnReward(event: RewardEvent): void {
  let voterAddress = dataSource.context().getString('voter')
  let delegator = Delegator.load(voterAddress) as Delegator

  // If voter is a delegator and the caller that invoked reward is its delegate,
  if (
    delegator != null &&
    delegator.delegate == event.params.transcoder.toHex()
  ) {
    let pollAddress = dataSource.context().getString('poll')
    let poll = Poll.load(pollAddress) as Poll

    // If poll is active then update delegator's vote stakes and poll tally
    if (poll.endBlock > event.block.number) {
      let protocol = Protocol.load('0') || new Protocol('0')
      let voteId = makeVoteId(delegator.id, poll.id)
      let vote = Vote.load(voteId)
      let transcoder = Transcoder.load(event.params.transcoder.toHex())

      // update vote stakes
      if (delegator.id == event.params.transcoder.toHex()) {
        vote.voteStake = transcoder.totalStake
      } else {
        let bondingManager = BondingManager.bind(event.address)
        let pendingStake = bondingManager.pendingStake(
          Address.fromString(voterAddress),
          BigInt.fromI32(protocol.currentRound as i32),
        )

        let delegateVoteId = makeVoteId(
          event.params.transcoder.toHex(),
          poll.id,
        )
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.voter = event.params.transcoder.toHex()

        // if delegate voted, update its vote stake
        if (delegateVote.voteStake != null) {
          delegateVote.voteStake = transcoder.totalStake
        }

        // update nonVoteStake
        delegateVote.nonVoteStake = delegateVote.nonVoteStake
          .minus(vote.voteStake as BigInt)
          .plus(pendingStake)
        delegateVote.save()

        vote.voteStake = pendingStake
      }

      vote.save()
      tallyVotes(poll)
    }
  }
}

export function updatePollTallyOnBond(event: BondEvent): void {
  let voterAddress = dataSource.context().getString('voter')
  if (voterAddress == event.params.delegator.toHex()) {
    let pollAddress = dataSource.context().getString('poll')
    let poll = Poll.load(pollAddress) as Poll

    // Check if poll is active
    if (poll.endBlock > event.block.number) {
      let transcoder = Transcoder.load(event.params.newDelegate.toHex())
      let voteId = makeVoteId(voterAddress, pollAddress)
      let vote = Vote.load(voteId)

      // If moving stake, remove vote with old delegate
      if (
        voterAddress == event.params.delegator.toHex() &&
        event.params.oldDelegate.toHex() != EMPTY_ADDRESS.toHex() &&
        event.params.oldDelegate.toHex() != event.params.newDelegate.toHex()
      ) {
        let oldDelegate = Transcoder.load(event.params.oldDelegate.toHex())
        let oldDelegateVoteId = makeVoteId(
          event.params.oldDelegate.toHex(),
          poll.id,
        )
        let oldDelegateVote = Vote.load(oldDelegateVoteId)
        oldDelegateVote.voteStake = oldDelegate.totalStake
        oldDelegateVote.nonVoteStake = oldDelegateVote.nonVoteStake.minus(
          vote.voteStake as BigInt,
        )
        oldDelegateVote.save()
      }

      // update vote stakes
      if (event.params.delegator.toHex() == event.params.newDelegate.toHex()) {
        vote.voteStake = transcoder.totalStake
      } else {
        let protocol = Protocol.load('0') || new Protocol('0')
        let bondingManager = BondingManager.bind(event.address)
        let pendingStake = bondingManager.pendingStake(
          Address.fromString(voterAddress),
          BigInt.fromI32(protocol.currentRound as i32),
        )

        let delegateVoteId = makeVoteId(
          event.params.newDelegate.toHex(),
          poll.id,
        )
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.voter = event.params.newDelegate.toHex()

        // if delegate voted, update its vote stake
        if (delegateVote.voteStake != null) {
          delegateVote.voteStake = transcoder.totalStake
        }

        // update delegate nonVoteStake
        delegateVote.nonVoteStake = delegateVote.nonVoteStake
          .minus(vote.voteStake as BigInt)
          .plus(pendingStake)
        delegateVote.save()

        // update voteStake
        vote.voteStake = pendingStake
      }

      vote.save()
      tallyVotes(poll)
    }
  }
}

export function updatePollTallyOnUnbond(event: UnbondEvent): void {
  let voterAddress = dataSource.context().getString('voter')
  if (voterAddress == event.params.delegator.toHex()) {
    let pollAddress = dataSource.context().getString('poll')
    let poll = Poll.load(pollAddress) as Poll

    // Check if poll is active
    if (poll.endBlock > event.block.number) {
      let transcoder = Transcoder.load(event.params.delegate.toHex())
      let voteId = makeVoteId(voterAddress, pollAddress)
      let vote = Vote.load(voteId)

      if (event.params.delegator.toHex() == event.params.delegate.toHex()) {
        vote.voteStake = transcoder.totalStake
      } else {
        let protocol = Protocol.load('0') || new Protocol('0')
        let bondingManager = BondingManager.bind(event.address)
        let pendingStake = bondingManager.pendingStake(
          Address.fromString(voterAddress),
          BigInt.fromI32(protocol.currentRound as i32),
        )

        let delegateVoteId = makeVoteId(event.params.delegate.toHex(), poll.id)
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.voter = event.params.delegate.toHex()

        // if delegate voted, update its vote stake
        if (delegateVote.voteStake != null) {
          delegateVote.voteStake = transcoder.totalStake
        }

        // update delegate nonVoteStake
        delegateVote.nonVoteStake = delegateVote.nonVoteStake
          .minus(vote.voteStake as BigInt)
          .plus(pendingStake)
        delegateVote.save()

        // update voteStake
        vote.voteStake = pendingStake
      }
      vote.save()
      tallyVotes(poll)
    }
  }
}

export function updatePollTallyOnRebond(event: RebondEvent): void {
  let voterAddress = dataSource.context().getString('voter')
  if (voterAddress == event.params.delegator.toHex()) {
    let pollAddress = dataSource.context().getString('poll')
    let poll = Poll.load(pollAddress) as Poll

    // Check if poll is active
    if (poll != null && poll.endBlock > event.block.number) {
      let transcoder = Transcoder.load(event.params.delegate.toHex())
      let voteId = makeVoteId(voterAddress, pollAddress)
      let vote = Vote.load(voteId)

      if (event.params.delegator.toHex() == event.params.delegate.toHex()) {
        vote.voteStake = transcoder.totalStake
      } else {
        let protocol = Protocol.load('0') || new Protocol('0')
        let bondingManager = BondingManager.bind(event.address)
        let pendingStake = bondingManager.pendingStake(
          Address.fromString(voterAddress),
          BigInt.fromI32(protocol.currentRound as i32),
        )

        let delegateVoteId = makeVoteId(event.params.delegate.toHex(), poll.id)
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.voter = event.params.delegate.toHex()

        // if delegate voted, update its vote stake
        if (delegateVote.voteStake != null) {
          delegateVote.voteStake = transcoder.totalStake
        }

        // update delegate nonVoteStake
        delegateVote.nonVoteStake = delegateVote.nonVoteStake
          .minus(vote.voteStake as BigInt)
          .plus(pendingStake)
        delegateVote.save()

        // update voteStake
        vote.voteStake = pendingStake
      }
      vote.save()
      tallyVotes(poll)
    }
  }
}

export function updatePollTallyOnEarningsClaimed(
  event: EarningsClaimedEvent,
): void {
  let voterAddress = dataSource.context().getString('voter')
  let delegator = Delegator.load(voterAddress) as Delegator
  // If voter is a delegator and it shares the same delegate attached to the event
  if (
    delegator != null &&
    delegator.delegate == event.params.delegate.toHex()
  ) {
    let pollAddress = dataSource.context().getString('poll')
    let poll = Poll.load(pollAddress) as Poll

    // Check if poll is active
    if (poll != null && poll.endBlock > event.block.number) {
      let transcoder = Transcoder.load(event.params.delegate.toHex())
      let voteId = makeVoteId(voterAddress, pollAddress)
      let vote = Vote.load(voteId)

      // return if voter didn't vote in this specific poll
      if (!vote) {
        return
      }

      if (event.params.delegator.toHex() == event.params.delegate.toHex()) {
        vote.voteStake = transcoder.totalStake
      } else {
        let protocol = Protocol.load('0') || new Protocol('0')
        let bondingManager = BondingManager.bind(event.address)
        let pendingStake = bondingManager.pendingStake(
          Address.fromString(voterAddress),
          BigInt.fromI32(protocol.currentRound as i32),
        )

        let delegateVoteId = makeVoteId(event.params.delegate.toHex(), poll.id)
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.voter = event.params.delegate.toHex()

        // if delegate voted, update its vote stake
        if (delegateVote.voteStake != null) {
          delegateVote.voteStake = transcoder.totalStake
        }

        // update delegate nonVoteStake
        delegateVote.nonVoteStake = delegateVote.nonVoteStake
          .minus(vote.voteStake as BigInt)
          .plus(pendingStake)
        delegateVote.save()

        // update voteStake
        vote.voteStake = pendingStake
      }
      vote.save()
      tallyVotes(poll)
    }
  }
}
