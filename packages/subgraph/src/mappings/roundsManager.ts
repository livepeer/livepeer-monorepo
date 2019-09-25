// Import types and APIs from graph-ts
import { Address } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import { RoundsManager, NewRound } from '../types/RoundsManager/RoundsManager'
import { BondingManager } from '../types/BondingManager_LIP11/BondingManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Pool,
  Round,
  InitializeRoundTransaction
} from '../types/schema'

import { makePoolId } from './util'

// Bind BondingManager contract
let bondingManager = BondingManager.bind(
  Address.fromString('511bc4556d823ae99630ae8de28b9b80df90ea2e')
)

// Handler for NewRound events
export function newRound(event: NewRound): void {
  let roundsManager = RoundsManager.bind(event.address)
  let roundNumber = event.params.round
  let EMPTY_ADDRESS = Address.fromString(
    '0000000000000000000000000000000000000000'
  )
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
      poolId = makePoolId(currentTranscoder, roundNumber)
      pool = new Pool(poolId)
      pool.round = roundNumber.toString()
      pool.delegate = currentTranscoder.toHex()
      pool.totalStake = transcoder.totalStake
      pool.rewardCut = transcoder.rewardCut
      pool.feeShare = transcoder.feeShare

      // Apply store updates
      pool.save()
    }

    currentTranscoder = bondingManager.getNextTranscoderInPool(
      currentTranscoder
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
  let initializeRoundTransaction = new InitializeRoundTransaction(
    event.transaction.hash.toHex()
  )
  initializeRoundTransaction.blockNumber = event.block.number
  initializeRoundTransaction.gasUsed = event.transaction.gasUsed
  initializeRoundTransaction.gasPrice = event.transaction.gasPrice
  initializeRoundTransaction.timestamp = event.block.timestamp
  initializeRoundTransaction.from = event.transaction.from.toHex()
  initializeRoundTransaction.to = event.transaction.to.toHex()
  initializeRoundTransaction.round = roundNumber.toString()
  initializeRoundTransaction.save()
}
