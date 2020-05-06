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

  let protocol = Protocol.load('0') || new Protocol('0')
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

  // if switching delegates and old delegate voted, update its vote stake
  if (
    isSwitchingDelegates &&
    oldDelegateVote != null &&
    !!oldDelegateVote.choiceID
  ) {
    updateTally = true
    let oldDelegate = Transcoder.load(event.params.oldDelegate.toHex())
    oldDelegateVote.voteStake = oldDelegate.totalStake
    oldDelegateVote.save()
  }

  // if new delegate voted, update its vote stake
  let newDelegateVoteId = makeVoteId(
    event.params.newDelegate.toHex(),
    pollAddress,
  )
  let newDelegateVote = Vote.load(newDelegateVoteId)
  if (newDelegateVote != null && !!newDelegateVote.choiceID) {
    updateTally = true
    let newDelegate = Transcoder.load(event.params.newDelegate.toHex())
    newDelegateVote.voteStake = newDelegate.totalStake
    newDelegateVote.save()
  }

  // if delegator voted, update its voteStake
  if (voterAddress == event.params.delegator.toHex()) {
    updateTally = true
    let voteId = makeVoteId(voterAddress, pollAddress)
    let vote = Vote.load(voteId)

    // If moving stake, remove vote with old delegate
    if (isSwitchingDelegates) {
      oldDelegateVote.nonVoteStake = oldDelegateVote.nonVoteStake.minus(
        vote.voteStake as BigInt,
      )
      oldDelegateVote.save()
    }

    // update delegator vote stake
    if (voterAddress != event.params.newDelegate.toHex()) {
      let protocol = Protocol.load('0') || new Protocol('0')
      let bondingManager = BondingManager.bind(event.address)
      let pendingStake = bondingManager.pendingStake(
        Address.fromString(voterAddress),
        BigInt.fromI32(protocol.currentRound as i32),
      )
      if (newDelegateVote == null) {
        newDelegateVote = new Vote(newDelegateVoteId)
      }
      newDelegateVote.voter = event.params.newDelegate.toHex()
      // update delegate nonVoteStake
      newDelegateVote.nonVoteStake = newDelegateVote.nonVoteStake
        .minus(vote.voteStake as BigInt)
        .plus(pendingStake)
      newDelegateVote.save()

      // update voteStake
      vote.voteStake = pendingStake
    }
    vote.save()
  }

  // if delegator, oldDelegate, or newDelegate attached to even voted in
  // active poll then tallyVotes
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

  // Return if the voter doesn't share the same delegate attached to the event
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
  let transcoder = Transcoder.load(event.params.delegate.toHex())

  if (voterAddress == event.params.delegate.toHex()) {
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

  // if delegate voted, update its vote stake
  let delegateVoteId = makeVoteId(event.params.delegate.toHex(), pollAddress)
  let delegateVote = Vote.load(delegateVoteId)
  if (delegateVote != null && !!delegateVote.choiceID) {
    updateTally = true
    let newDelegate = Transcoder.load(event.params.delegate.toHex())
    delegateVote.voteStake = newDelegate.totalStake
    delegateVote.save()
  }

  // if delegator voted, update its voteStake
  let voterAddress = dataSource.context().getString('voter')
  if (voterAddress == event.params.delegator.toHex()) {
    updateTally = true
    let voteId = makeVoteId(voterAddress, pollAddress)
    let vote = Vote.load(voteId)

    // update delegator vote stake
    if (voterAddress != event.params.delegate.toHex()) {
      let protocol = Protocol.load('0') || new Protocol('0')
      let bondingManager = BondingManager.bind(event.address)
      let pendingStake = bondingManager.pendingStake(
        Address.fromString(voterAddress),
        BigInt.fromI32(protocol.currentRound as i32),
      )
      if (delegateVote == null) {
        delegateVote = new Vote(delegateVoteId)
      }
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
  }

  // if delegator, oldDelegate, or newDelegate attached to even voted in
  // active poll then tallyVotes
  if (updateTally) {
    tallyVotes(poll)
  }
}
