import { Address, BigInt, dataSource } from '@graphprotocol/graph-ts'

import {
  BondingManager,
  Reward as RewardEvent,
  Bond as BondEvent,
  Unbond as UnbondEvent,
  Rebond as RebondEvent,
} from '../types/BondingManager_LIP12/BondingManager'

import {
  Delegator,
  Share,
  Protocol,
  Poll,
  Vote,
  Transcoder,
} from '../types/schema'

import {
  makeShareId,
  makePoolId,
  makeVoteId,
  EMPTY_ADDRESS,
} from '../../utils/helpers'
import { tallyVotes } from './poll'

export function updateDelegatorWithShare(event: RewardEvent): void {
  let delegatorAddress = dataSource.context().getString('delegator')
  let delegator = Delegator.load(delegatorAddress)

  if (delegator.delegate == event.params.transcoder.toHex()) {
    let protocol = Protocol.load('0') || new Protocol('0')
    let shareId = makeShareId(delegatorAddress, protocol.currentRound)
    let share = Share.load(shareId) || new Share(shareId)

    let bondingManager = BondingManager.bind(event.address)
    let poolId = makePoolId(
      event.params.transcoder.toHex(),
      protocol.currentRound,
    )
    let pendingStake = bondingManager.pendingStake(
      Address.fromString(delegatorAddress),
      BigInt.fromI32(protocol.currentRound as i32),
    )
    let rewardTokens = pendingStake.minus(
      (delegator.pendingStake as BigInt)
        ? (delegator.pendingStake as BigInt)
        : BigInt.fromI32(0),
    )
    share.rewardTokens = rewardTokens
    share.delegator = delegatorAddress
    share.round = protocol.currentRound
    share.pool = poolId
    share.save()

    delegator.pendingStake = pendingStake
    delegator.save()
  }
}

export function updateVoteStakesAndPollTallyOnReward(event: RewardEvent): void {
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
      let shareId = makeShareId(delegator.id, protocol.currentRound)
      let share = Share.load(shareId) || new Share(shareId)
      let voteId = makeVoteId(delegator.id, poll.id)
      let vote = Vote.load(voteId)
      if (delegator.id == event.params.transcoder.toHex()) {
        let transcoder = Transcoder.load(event.params.transcoder.toHex())
        vote.voteStake = transcoder.totalStake
      } else {
        vote.voteStake = delegator.pendingStake
        let delegateVoteId = makeVoteId(
          event.params.transcoder.toHex(),
          poll.id,
        )
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.nonVoteStake = delegateVote.nonVoteStake.plus(
          share.rewardTokens as BigInt,
        )
        delegateVote.save()
      }
      vote.save()
      tallyVotes(poll)
    }
  }
}

export function updateVoteStakesAndPollTallyOnBond(event: BondEvent): void {
  let voterAddress = dataSource.context().getString('voter')
  if (voterAddress == event.params.delegator.toHex()) {
    let pollAddress = dataSource.context().getString('poll')
    let poll = Poll.load(pollAddress) as Poll

    // Check if poll is active
    if (poll.endBlock > event.block.number) {
      let voteId = makeVoteId(voterAddress, pollAddress)
      let vote = Vote.load(voteId)

      if (event.params.delegator.toHex() == event.params.newDelegate.toHex()) {
        let transcoder = Transcoder.load(event.params.newDelegate.toHex())
        vote.voteStake = transcoder.totalStake
      } else {
        let delegator = Delegator.load(event.params.delegator.toHex())
        vote.voteStake = delegator.pendingStake

        let delegateVoteId = makeVoteId(
          event.params.newDelegate.toHex(),
          poll.id,
        )
        let delegateVote = Vote.load(delegateVoteId)
        delegateVote.nonVoteStake = delegateVote.nonVoteStake.plus(
          event.params.additionalAmount,
        )
        delegateVote.save()
      }

      vote.save()

      // If moving stake, remove vote with old delegate
      if (
        event.params.oldDelegate.toHex() != EMPTY_ADDRESS.toHex() &&
        event.params.oldDelegate.toHex() != event.params.newDelegate.toHex()
      ) {
        let delegator = Delegator.load(event.params.delegator.toHex())
        let oldDelegateVoteId = makeVoteId(
          event.params.oldDelegate.toHex(),
          poll.id,
        )
        let oldDelegateVote = Vote.load(oldDelegateVoteId)
        oldDelegateVote.nonVoteStake = oldDelegateVote.nonVoteStake.minus(
          delegator.pendingStake as BigInt,
        )
        oldDelegateVote.save()
      }

      tallyVotes(poll)
    }
  }
}

export function updateVoteStakesAndPollTallyOnUnbond(event: UnbondEvent): void {
  let voterAddress = dataSource.context().getString('voter')
  if (voterAddress == event.params.delegator.toHex()) {
    let pollAddress = dataSource.context().getString('poll')
    let poll = Poll.load(pollAddress) as Poll

    // Check if poll is active
    if (poll.endBlock > event.block.number) {
      let voteId = makeVoteId(voterAddress, pollAddress)
      let vote = Vote.load(voteId)

      if (event.params.delegator.toHex() == event.params.delegate.toHex()) {
        let transcoder = Transcoder.load(event.params.delegate.toHex())
        vote.voteStake = transcoder.totalStake
      } else {
        let delegator = Delegator.load(event.params.delegator.toHex())
        vote.voteStake = delegator.pendingStake

        let delegateVoteId = makeVoteId(event.params.delegate.toHex(), poll.id)
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.nonVoteStake = delegateVote.nonVoteStake.minus(
          event.params.amount,
        )
        delegateVote.save()
      }
      vote.save()
      tallyVotes(poll)
    }
  }
}

export function updateVoteStakesAndPollTallyOnRebond(event: RebondEvent): void {
  let voterAddress = dataSource.context().getString('voter')
  if (voterAddress == event.params.delegator.toHex()) {
    let pollAddress = dataSource.context().getString('poll')
    let poll = Poll.load(pollAddress) as Poll

    // Check if poll is active
    if (poll != null && poll.endBlock > event.block.number) {
      let voteId = makeVoteId(voterAddress, pollAddress)
      let vote = Vote.load(voteId)

      if (event.params.delegator.toHex() == event.params.delegate.toHex()) {
        let transcoder = Transcoder.load(
          event.params.delegate.toHex(),
        ) as Transcoder
        vote.voteStake = transcoder.totalStake
      } else {
        let delegator = Delegator.load(event.params.delegator.toHex())
        vote.voteStake = delegator.pendingStake

        let delegateVoteId = makeVoteId(event.params.delegate.toHex(), poll.id)
        let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
        delegateVote.nonVoteStake = delegateVote.nonVoteStake.plus(
          event.params.amount,
        )
        delegateVote.save()
      }
      vote.save()
      tallyVotes(poll)
    }
  }
}
