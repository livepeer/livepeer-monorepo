// Import types and APIs from graph-ts
import { Address, dataSource, BigInt } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  RoundsManager,
  NewRound as NewRoundEvent,
  ParameterUpdate as ParameterUpdateEvent,
} from '../types/RoundsManager/RoundsManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Pool,
  Round,
  InitializeRound,
  Protocol,
  ParameterUpdate,
} from '../types/schema'

import {
  PERC_DIVISOR,
  makePoolId,
  getBondingManagerInstance,
  makeEventId,
} from './util'

// Handler for NewRound events
export function newRound(event: NewRoundEvent): void {
  let roundsManager = RoundsManager.bind(event.address)
  let roundNumber = event.params.round
  let EMPTY_ADDRESS = Address.fromString(
    '0000000000000000000000000000000000000000',
  )
  let bondingManager = getBondingManagerInstance(dataSource.network())
  let currentTranscoder = bondingManager.getFirstTranscoderInPool()
  let transcoder = Transcoder.load(currentTranscoder.toHex())
  let active: boolean
  let poolId: string
  let pool: Pool
  let round: Round

  // Iterate over all registered transcoders
  while (EMPTY_ADDRESS.toHex() != currentTranscoder.toHex()) {
    // Update transcoder active state
    active = bondingManager.isActiveTranscoder(currentTranscoder, roundNumber)
    transcoder.active = active
    transcoder.rewardCut = transcoder.pendingRewardCut
    transcoder.feeShare = transcoder.pendingFeeShare
    transcoder.pricePerSegment = transcoder.pendingPricePerSegment
    transcoder.save()

    // create a unique "pool" for each active transcoder on every
    // round. If a transcoder calls reward() for a given round, we store its
    // reward tokens inside this Pool entry in a field called "rewardTokens". If
    // "rewardTokens" is null for a given transcoder and round then we know
    // the transcoder failed to call reward()
    if (active) {
      poolId = makePoolId(currentTranscoder, roundNumber.toString())
      pool = new Pool(poolId)
      pool.round = roundNumber.toString()
      pool.delegate = currentTranscoder.toHex()
      pool.totalStake = transcoder.totalStake
      pool.rewardCut = transcoder.pendingRewardCut
      pool.feeShare = transcoder.pendingFeeShare

      // Apply store updates
      pool.save()
    }

    currentTranscoder = bondingManager.getNextTranscoderInPool(
      currentTranscoder,
    )

    transcoder = Transcoder.load(currentTranscoder.toHex())
  }

  // Create new round
  round = new Round(roundNumber.toString())
  round.initialized = true
  round.timestamp = event.block.timestamp
  round.length = roundsManager.roundLength()
  round.startBlock = roundsManager.currentRoundStartBlock()
  round.save()

  // Update protocol
  let protocol = Protocol.load('0') || new Protocol('0')
  protocol.lastInitializedRound = roundsManager.lastInitializedRound()
  protocol.currentRound = roundNumber.toString()
  protocol.save()

  // Store transaction info
  let initializeRound = new InitializeRound(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  initializeRound.hash = event.transaction.hash.toHex()
  initializeRound.blockNumber = event.block.number
  initializeRound.gasUsed = event.transaction.gasUsed
  initializeRound.gasPrice = event.transaction.gasPrice
  initializeRound.timestamp = event.block.timestamp
  initializeRound.from = event.transaction.from.toHex()
  initializeRound.to = event.transaction.to.toHex()
  initializeRound.round = roundNumber.toString()
  initializeRound.save()
}

export function parameterUpdate(event: ParameterUpdateEvent): void {
  let roundsManager = RoundsManager.bind(event.address)
  let protocol = Protocol.load('0') || new Protocol('0')

  if (event.params.param == 'roundLength') {
    protocol.roundLength = roundsManager.roundLength()
    protocol.lastRoundLengthUpdateStartBlock = roundsManager.lastRoundLengthUpdateStartBlock()
    protocol.lastRoundLengthUpdateRound = roundsManager.lastRoundLengthUpdateRound()
  }

  if (event.params.param == 'roundLockAmount') {
    protocol.roundLockAmount = roundsManager.roundLockAmount()
  }

  protocol.lockPeriod = roundsManager
    .roundLength()
    .times(roundsManager.roundLockAmount())
    .div(BigInt.fromI32(PERC_DIVISOR))

  protocol.save()

  let parameterUpdate = new ParameterUpdate(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  parameterUpdate.hash = event.transaction.hash.toHex()
  parameterUpdate.blockNumber = event.block.number
  parameterUpdate.gasUsed = event.transaction.gasUsed
  parameterUpdate.gasPrice = event.transaction.gasPrice
  parameterUpdate.timestamp = event.block.timestamp
  parameterUpdate.from = event.transaction.from.toHex()
  parameterUpdate.to = event.transaction.to.toHex()
  parameterUpdate.round = protocol.currentRound
  parameterUpdate.param = event.params.param
  parameterUpdate.save()
}
