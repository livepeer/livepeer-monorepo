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

  // Return if transcoder that called reward isn't voter's delegate
  if (
    delegator == null &&
    delegator.delegate != event.params.transcoder.toHex()
  ) {
    return
  }

  let pollAddress = dataSource.context().getString('poll')
  let poll = Poll.load(pollAddress) as Poll

  // Return if poll is no longer active
  if (poll.endBlock.lt(event.block.number)) {
    return
  }

  let protocol = Protocol.load('0')
  let voteId = makeVoteId(delegator.id, poll.id)
  let vote = Vote.load(voteId)
  let transcoder = Transcoder.load(event.params.transcoder.toHex())

  // update vote stakes
  if (voterAddress == event.params.transcoder.toHex()) {
    vote.voteStake = transcoder.totalStake
  } else {
    let bondingManager = BondingManager.bind(event.address)
    let pendingStake = bondingManager.pendingStake(
      Address.fromString(voterAddress),
      BigInt.fromI32(protocol.currentRound as i32),
    )

    let delegateVoteId = makeVoteId(event.params.transcoder.toHex(), poll.id)
    let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
    delegateVote.voter = event.params.transcoder.toHex()

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

export function updatePollTallyOnBond(event: BondEvent): void {
  let pollAddress = dataSource.context().getString('poll')
  let poll = Poll.load(pollAddress) as Poll

  // Return if poll is no longer active
  if (poll.endBlock.lt(event.block.number)) {
    return
  }

  let voterAddress = dataSource.context().getString('voter')
  let updateTally = false
  let isSwitchingDelegates =
    event.params.oldDelegate.toHex() != EMPTY_ADDRESS.toHex() &&
    event.params.oldDelegate.toHex() != event.params.newDelegate.toHex()
  let oldDelegateVoteId = makeVoteId(
    event.params.oldDelegate.toHex(),
    pollAddress,
  )
  let oldDelegateVote = Vote.load(oldDelegateVoteId)
  let oldDelegate = Transcoder.load(event.params.oldDelegate.toHex())
  let newDelegateVoteId = makeVoteId(
    event.params.newDelegate.toHex(),
    pollAddress,
  )
  let newDelegateVote = Vote.load(newDelegateVoteId)
  let newDelegate = Transcoder.load(event.params.newDelegate.toHex())
  let voteId = makeVoteId(voterAddress, pollAddress)
  let vote = Vote.load(voteId)

  if (oldDelegateVote) {
    updateTally = true
    if (oldDelegate.status == 'Registered') {
      oldDelegateVote.registeredTranscoder = true
    } else {
      oldDelegateVote.registeredTranscoder = false
    }
    if (isSwitchingDelegates && oldDelegateVote.choiceID != null) {
      oldDelegateVote.voteStake = oldDelegate.totalStake

      // if caller is voter, remove its nonVoteStake from old delegate
      if (voterAddress == event.params.delegator.toHex()) {
        oldDelegateVote.nonVoteStake = oldDelegateVote.nonVoteStake.minus(
          event.params.bondedAmount,
        )
      }
    }
    oldDelegateVote.save()
  }

  if (newDelegateVote) {
    updateTally = true
    if (newDelegate.status == 'Registered') {
      newDelegateVote.registeredTranscoder = true
      if (newDelegateVote.choiceID != null) {
        newDelegateVote.voteStake = newDelegate.totalStake
      }
    } else {
      newDelegateVote.registeredTranscoder = false
    }
    newDelegateVote.save()
  }

  // if caller is voter and *not* a registered transcoder update its vote
  if (
    voterAddress == event.params.delegator.toHex() &&
    voterAddress != event.params.newDelegate.toHex()
  ) {
    updateTally = true

    // if delegate has not voted, create a "placeholder" vote for tracking
    // nonVoteStake in case it happens to register during the poll period
    if (newDelegateVote == null) {
      newDelegateVote = new Vote(newDelegateVoteId)
      if (newDelegate.status == 'Registered') {
        newDelegateVote.registeredTranscoder = true
      } else {
        newDelegateVote.registeredTranscoder = false
      }
    }

    newDelegateVote.voter = event.params.newDelegate.toHex()
    newDelegateVote.nonVoteStake = newDelegateVote.nonVoteStake
      .minus(vote.voteStake as BigInt)
      .plus(event.params.bondedAmount)
    newDelegateVote.save()

    vote.voteStake = event.params.bondedAmount
    vote.save()
  }

  // if delegator, oldDelegate, or newDelegate attached to event voted in poll
  // then update the tally
  if (updateTally) {
    tallyVotes(poll)
  }
}

export function updatePollTallyOnUnbond(event: UnbondEvent): void {
  updatePollTally(event)
}

export function updatePollTallyOnRebond(event: RebondEvent): void {
  updatePollTally(event)
}

export function updatePollTallyOnEarningsClaimed(
  event: EarningsClaimedEvent,
): void {
  let voterAddress = dataSource.context().getString('voter')
  let delegator = Delegator.load(voterAddress) as Delegator

  // Return if the voter doesn't share the same delegate as the delegator that claimed earnings
  if (
    delegator == null &&
    delegator.delegate != event.params.delegate.toHex()
  ) {
    return
  }

  let pollAddress = dataSource.context().getString('poll')
  let poll = Poll.load(pollAddress) as Poll

  // Return if poll is no longer active
  if (poll.endBlock.lt(event.block.number)) {
    return
  }

  let voteId = makeVoteId(voterAddress, pollAddress)
  let vote = Vote.load(voteId)
  let transcoder = Transcoder.load(voterAddress)

  if (transcoder.status == 'Registered') {
    vote.voteStake = transcoder.totalStake
  } else {
    let protocol = Protocol.load('0')
    let bondingManager = BondingManager.bind(event.address)
    let pendingStake = bondingManager.pendingStake(
      Address.fromString(voterAddress),
      BigInt.fromI32(protocol.currentRound as i32),
    )

    let delegateVoteId = makeVoteId(event.params.delegate.toHex(), poll.id)
    let delegateVote = Vote.load(delegateVoteId) || new Vote(delegateVoteId)
    delegateVote.voter = event.params.delegate.toHex()

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

function updatePollTally<T extends RebondEvent>(event: T): void {
  let pollAddress = dataSource.context().getString('poll')
  let poll = Poll.load(pollAddress) as Poll
  let updateTally = false

  // Return if poll is no longer active
  if (poll.endBlock.lt(event.block.number)) {
    return
  }

  let voterAddress = dataSource.context().getString('voter')
  let voteId = makeVoteId(voterAddress, pollAddress)
  let vote = Vote.load(voteId)
  let delegateVoteId = makeVoteId(event.params.delegate.toHex(), pollAddress)
  let delegateVote = Vote.load(delegateVoteId)
  let delegate = Transcoder.load(event.params.delegate.toHex())
  let protocol = Protocol.load('0')
  let bondingManager = BondingManager.bind(event.address)

  if (delegateVote) {
    updateTally = true
    if (delegate.status == 'Registered') {
      delegateVote.registeredTranscoder = true
      if (delegateVote.choiceID != null) {
        delegateVote.voteStake = delegate.totalStake
      }
    } else {
      delegateVote.registeredTranscoder = false
      if (delegateVote.choiceID != null) {
        delegateVote.voteStake = bondingManager.pendingStake(
          event.params.delegate,
          BigInt.fromI32(protocol.currentRound as i32),
        )
      }
    }
    delegateVote.save()
  }

  if (
    voterAddress == event.params.delegator.toHex() &&
    voterAddress != event.params.delegate.toHex()
  ) {
    updateTally = true

    let pendingStake = bondingManager.pendingStake(
      Address.fromString(voterAddress),
      BigInt.fromI32(protocol.currentRound as i32),
    )

    if (delegateVote == null) {
      delegateVote = new Vote(delegateVoteId)
    }
    delegateVote.voter = event.params.delegate.toHex()
    delegateVote.nonVoteStake = delegateVote.nonVoteStake
      .minus(vote.voteStake as BigInt)
      .plus(pendingStake)
    if (delegate.status == 'Registered') {
      delegateVote.registeredTranscoder = true
    } else {
      delegateVote.registeredTranscoder = false
    }
    vote.voteStake = pendingStake

    delegateVote.save()
    vote.save()
  }

  // if delegator or delegate attached to event voted in poll then update tally
  if (updateTally) {
    tallyVotes(poll)
  }
}
