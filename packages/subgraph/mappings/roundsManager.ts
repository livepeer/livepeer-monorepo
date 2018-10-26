import 'allocator/arena'
export { allocate_memory }

import { Entity, store, Address, U256 } from '@graphprotocol/graph-ts'
import { RoundsManager, NewRound } from '../types/RoundsManager/RoundsManager'
import { BondingManager } from '../types/BondingManager/BondingManager'

export function newRound(event: NewRound): void {
  let roundsManager = RoundsManager.bind(event.address)
  let bondingManager = BondingManager.bind(
    Address.fromString('511bc4556d823ae99630ae8de28b9b80df90ea2e')
  )
  let EMPTY_ADDRESS = Address.fromString(
    '0000000000000000000000000000000000000000'
  )
  let currentTranscoder = bondingManager.getFirstTranscoderInPool()
  let transcoder = new Entity()
  let reward = new Entity()
  let currentRound: U256
  let active: boolean
  let rewardId: string

  while (EMPTY_ADDRESS.toHex() != currentTranscoder.toHex()) {
    currentRound = roundsManager.currentRound()
    active = bondingManager.isActiveTranscoder(currentTranscoder, currentRound)

    transcoder.setBoolean('active', active)
    store.set('Transcoder', currentTranscoder.toHex(), transcoder)

    if (active) {
      rewardId = currentTranscoder.toHex() + '-' + currentRound.toHex()
      reward.setString('id', rewardId)
      reward.setString('round', currentRound.toHex())
      reward.setString('transcoder', currentTranscoder.toHex())
      store.set('Reward', rewardId, reward)
    }

    currentTranscoder = bondingManager.getNextTranscoderInPool(
      currentTranscoder
    )
  }

  let round = new Entity()
  let roundNumber = event.params.round
  let lastInitializedRound = roundsManager.lastInitializedRound()
  let length = roundsManager.roundLength()
  let startBlock = roundsManager.currentRoundStartBlock()

  round.setString('id', roundNumber.toHex())
  round.setBoolean('initialized', true)
  round.setU256('lastInitializedRound', lastInitializedRound)
  round.setU256('length', length)
  round.setU256('startBlock', startBlock)

  // // Apply store updates
  store.set('Round', roundNumber.toHex(), round)
}
