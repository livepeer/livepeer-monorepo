// Import types and APIs from graph-ts
import { Address, dataSource } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  RoundsManager,
  NewRound,
} from '../types/RoundsManager_LIP12/RoundsManager'

// Import entity types generated from the GraphQL schema
import { Transcoder, Pool, Round, InitializeRoundEvent } from '../types/schema'

import { makePoolId, getBondingManagerInstance } from './util'

// Handler for NewRound events
export function newRound(event: NewRound): void {
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
    poolId = makePoolId(currentTranscoder, roundNumber)
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
  round.lastInitializedRound = roundsManager.lastInitializedRound()
  round.length = roundsManager.roundLength()
  round.startBlock = roundsManager.currentRoundStartBlock()

  // Apply store updates
  round.save()

  // Store transaction info
  let initializeRoundEvent = new InitializeRoundEvent(
    event.transaction.hash.toHex() + '-InitializeRound',
  )
  initializeRoundEvent.hash = event.transaction.hash.toHex()
  initializeRoundEvent.blockNumber = event.block.number
  initializeRoundEvent.gasUsed = event.transaction.gasUsed
  initializeRoundEvent.gasPrice = event.transaction.gasPrice
  initializeRoundEvent.timestamp = event.block.timestamp
  initializeRoundEvent.from = event.transaction.from.toHex()
  initializeRoundEvent.to = event.transaction.to.toHex()
  initializeRoundEvent.round = roundNumber.toString()
  initializeRoundEvent.save()
}
