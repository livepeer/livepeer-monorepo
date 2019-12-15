import { dataSource } from '@graphprotocol/graph-ts'
import { SetCurrentRewardTokens } from '../types/Minter/Minter'
import { Round } from '../types/schema'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'
import { getRoundsManagerInstance } from './util'

export function setCurrentRewardTokens(event: SetCurrentRewardTokens): void {
  let roundsManager = getRoundsManagerInstance(dataSource.network())
  let currentRound = roundsManager.currentRound()
  let round = new Round(currentRound.toString())
  round.mintableTokens = event.params.currentMintableTokens
  round.save()
}
