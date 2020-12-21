// Import types and APIs from graph-ts
import { Address, BigDecimal, dataSource } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import {
  RoundsManager,
  NewRound as NewRoundEvent,
} from '../types/RoundsManager_streamflow/RoundsManager'

// Import entity types generated from the GraphQL schema
import {
  Transcoder,
  Pool,
  Round,
  InitializeRound,
  Protocol,
  DayData,
} from '../types/schema'

import {
  makePoolId,
  getBondingManagerAddress,
  makeEventId,
  EMPTY_ADDRESS,
  convertToDecimal,
  ZERO_BD,
} from '../../utils/helpers'
import { BondingManager } from '../types/BondingManager_streamflow/BondingManager'

// Handler for NewRound events
export function newRound(event: NewRoundEvent): void {
  let roundsManager = RoundsManager.bind(event.address)
  let roundNumber = event.params.round
  let bondingManagerAddress = getBondingManagerAddress(dataSource.network())
  let bondingManager = BondingManager.bind(
    Address.fromString(bondingManagerAddress),
  )
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
    poolId = makePoolId(currentTranscoder.toHex(), roundNumber.toString())
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

  let protocol = Protocol.load('0') || new Protocol('0')
  let totalActiveStake = convertToDecimal(bondingManager.getTotalBonded()) as BigDecimal

  // Create new round
  round = new Round(roundNumber.toString())
  round.initialized = true
  round.timestamp = event.block.timestamp
  round.length = roundsManager.roundLength()
  round.startBlock = roundsManager.currentRoundStartBlock()
  round.totalActiveStake = totalActiveStake
  
  protocol.lastInitializedRound = roundsManager.lastInitializedRound()
  protocol.currentRound = roundNumber.toString()
  protocol.totalActiveStake = totalActiveStake
  
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 86400
  let dayStartTimestamp = dayID * 86400
  let dayData = DayData.load(dayID.toString())
  
  if (dayData === null) {
    dayData = new DayData(dayID.toString())
    dayData.date = dayStartTimestamp
    dayData.volumeUSD = ZERO_BD
    dayData.volumeETH = ZERO_BD
    dayData.totalSupply = ZERO_BD
    dayData.totalActiveStake = ZERO_BD
    dayData.participationRate = ZERO_BD
  }

  dayData.totalActiveStake = totalActiveStake
  dayData.totalSupply = protocol.totalSupply as BigDecimal
  
  if(protocol.totalActiveStake.gt(ZERO_BD)) {
    protocol.participationRate = protocol.totalActiveStake.div(protocol.totalSupply as BigDecimal)
    round.participationRate = protocol.participationRate as BigDecimal
    dayData.participationRate = protocol.participationRate as BigDecimal
  }

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

  dayData.save()
  protocol.save()
  round.save()
  initializeRound.save()
}
