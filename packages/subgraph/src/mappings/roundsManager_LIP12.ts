// Import types and APIs from graph-ts
import { Address, dataSource } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  RoundsManager,
  NewRound as NewRoundEvent,
} from '../types/RoundsManager_LIP12/RoundsManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Pool,
  Round,
  InitializeRound,
  Protocol,
} from '../types/schema'

import { makePoolId, getBondingManagerInstance, makeEventId } from './util'

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
  let poolId: string
  let pool: Pool
  let round: Round

  // Iterate over all active transcoders
  while (EMPTY_ADDRESS.toHex() != currentTranscoder.toHex()) {
    // create a unique "pool" for each active transcoder. If a transcoder calls
    // reward() for a given round, we store its reward tokens inside this Pool
    // entry in a field called "rewardTokens". If "rewardTokens" is null for a
    // given transcoder and round then we know the transcoder failed to call reward()
    poolId = makePoolId(currentTranscoder, roundNumber.toString())
    pool = new Pool(poolId)
    pool.round = roundNumber.toString()
    pool.delegate = currentTranscoder.toHex()
    pool.totalStake = transcoder.totalStake
    pool.rewardCut = transcoder.rewardCut
    pool.feeShare = transcoder.feeShare

    // Apply store updates
    pool.save()

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
