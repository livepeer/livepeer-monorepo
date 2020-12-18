import { BigDecimal } from '@graphprotocol/graph-ts'
import { convertToDecimal, ZERO_BD } from '../../utils/helpers'
import { Mint as MintEvent, Burn as BurnEvent } from '../types/LivepeerToken/LivepeerToken'
import { DayData, Protocol, Round } from '../types/schema'

export function mint(event: MintEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let totalSupply = protocol.totalSupply.plus(convertToDecimal(event.params.amount) as BigDecimal)
  
  protocol.totalSupply = totalSupply
  
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

  dayData.totalSupply = totalSupply
  dayData.totalActiveStake = protocol.totalActiveStake as BigDecimal
  
  if(protocol.totalActiveStake.gt(ZERO_BD)) {
    protocol.participationRate = protocol.totalActiveStake.div(totalSupply)
    dayData.participationRate = protocol.participationRate as BigDecimal
  }
  
  let round = Round.load(protocol.currentRound)
  if(round != null && protocol.totalActiveStake.gt(ZERO_BD)) {
    round.totalSupply = totalSupply
    round.participationRate = protocol.participationRate as BigDecimal
    round.save()
  }
  
  protocol.save()
  dayData.save()
}

export function burn(event: BurnEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let totalSupply = protocol.totalSupply.minus(convertToDecimal(event.params.value) as BigDecimal)
  
  protocol.totalSupply = totalSupply
  
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

  dayData.totalSupply = totalSupply
  dayData.totalActiveStake = protocol.totalActiveStake as BigDecimal
  
  if(protocol.totalActiveStake.gt(ZERO_BD)) {
    protocol.participationRate = protocol.totalActiveStake.div(totalSupply)
    dayData.participationRate = protocol.participationRate as BigDecimal
  }
  
  let round = Round.load(protocol.currentRound)
  if(round != null && protocol.totalActiveStake.gt(ZERO_BD)) {
    round.totalSupply = totalSupply
    round.participationRate = protocol.participationRate as BigDecimal
    round.save()
  }
  
  protocol.save()
  dayData.save()
}