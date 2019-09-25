import { Address } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABIs
import { DistributeFees } from '../types/JobsManager/JobsManager'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'

// Import entity types generated from the GraphQL schema
import { Transcoder, Pool } from '../types/schema'

import { makePoolId } from './util'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
)

export function distributeFees(event: DistributeFees): void {
  let transcoderAddress = event.params.transcoder
  let transcoder = Transcoder.load(transcoderAddress.toHex())
  let currentRound = roundsManager.currentRound()
  let poolId = makePoolId(transcoderAddress, currentRound)
  let pool = Pool.load(poolId)

  // Update pool fees
  pool.fees = pool.fees.plus(event.params.fees)

  // Update transcoder's accrued fees
  transcoder.accruedFees = transcoder.accruedFees.plus(event.params.fees)

  // Apply store updates
  pool.save()
  transcoder.save()
}
