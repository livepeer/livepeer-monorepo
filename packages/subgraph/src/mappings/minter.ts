import {
  Minter,
  SetCurrentRewardTokens as SetCurrentRewardTokensEvent,
  ParameterUpdate as ParameterUpdateEvent,
} from '../types/Minter/Minter'
import {
  Round,
  Protocol,
  ParameterUpdate,
  SetCurrentRewardTokens,
} from '../types/schema'
import { makeEventId } from './util'

export function setCurrentRewardTokens(
  event: SetCurrentRewardTokensEvent,
): void {
  let minter = Minter.bind(event.address)
  let protocol = Protocol.load('0') || new Protocol('0')
  let round = new Round(protocol.currentRound)
  round.mintableTokens = event.params.currentMintableTokens
  round.save()

  // The variables targetBondingRate, inflationChange, and inflation are
  // initially set inside the Minter's constructor, however constructors are
  // currently disallowed in call handlers so we'll set them in here for now
  protocol.targetBondingRate = minter.targetBondingRate()
  protocol.inflationChange = minter.inflationChange()
  protocol.inflation = minter.inflation()
  protocol.save()

  let setCurrentRewardTokens = new SetCurrentRewardTokens(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  setCurrentRewardTokens.hash = event.transaction.hash.toHex()
  setCurrentRewardTokens.blockNumber = event.block.number
  setCurrentRewardTokens.gasUsed = event.transaction.gasUsed
  setCurrentRewardTokens.gasPrice = event.transaction.gasPrice
  setCurrentRewardTokens.timestamp = event.block.timestamp
  setCurrentRewardTokens.from = event.transaction.from.toHex()
  setCurrentRewardTokens.to = event.transaction.to.toHex()
  setCurrentRewardTokens.round = protocol.currentRound
  setCurrentRewardTokens.currentMintableTokens =
    event.params.currentMintableTokens
  setCurrentRewardTokens.currentInflation = event.params.currentInflation
  setCurrentRewardTokens.save()
}

export function parameterUpdate(event: ParameterUpdateEvent): void {
  let minter = Minter.bind(event.address)
  let protocol = Protocol.load('0') || new Protocol('0')

  if (event.params.param == 'targetBondingRate') {
    protocol.targetBondingRate = minter.targetBondingRate()
  }

  if (event.params.param == 'inflationChange') {
    protocol.inflationChange = minter.inflationChange()
  }

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
