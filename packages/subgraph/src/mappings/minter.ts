import { Address } from '@graphprotocol/graph-ts'
import { SetCurrentRewardTokens } from '../types/Minter/Minter'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'
import { Round } from '../types/schema'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('572d1591bD41f50130FD0212058eAe34F1B17290')
)

export function setCurrentRewardTokens(event: SetCurrentRewardTokens): void {
  let currentRound = roundsManager.currentRound()
  let round = new Round(currentRound.toString())
  round.mintableTokens = event.params.currentMintableTokens
  round.save()
}
