import { Address } from '@graphprotocol/graph-ts'
import { SetCurrentRewardTokens } from '../types/Minter/Minter'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'
import { Round } from '../types/schema'

// Bind RoundsManager contract
let roundsManager = RoundsManager.bind(
  Address.fromString('3984fc4ceeef1739135476f625d36d6c35c40dc3')
)

// Handler for NewRound events
export function setCurrentRewardTokens(event: SetCurrentRewardTokens): void {
  let currentRound = roundsManager.currentRound()
  let round = new Round(currentRound.toString())
  round.mintableTokens = event.params.currentMintableTokens
  round.save()
}
