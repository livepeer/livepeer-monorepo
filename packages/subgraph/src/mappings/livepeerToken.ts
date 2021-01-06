import {
  convertToDecimal,
  createOrLoadDay,
  createOrLoadRound,
  makeEventId,
  ZERO_BD,
} from '../../utils/helpers'
import { Mint, Burn } from '../types/LivepeerToken/LivepeerToken'
import { Transaction, MintEvent, BurnEvent, Protocol } from '../types/schema'

export function mint(event: Mint): void {
  let protocol = Protocol.load('0')
  let amount = convertToDecimal(event.params.amount)
  let totalSupply = protocol.totalSupply.plus(amount)

  protocol.totalSupply = totalSupply

  let day = createOrLoadDay(event.block.timestamp.toI32())
  day.totalSupply = totalSupply
  day.totalActiveStake = protocol.totalActiveStake

  // check if total active stake is greater than 0 to avoid divide by zero
  if (protocol.totalActiveStake.gt(ZERO_BD)) {
    protocol.participationRate = protocol.totalActiveStake.div(totalSupply)
    day.participationRate = protocol.participationRate
  }

  let round = createOrLoadRound(event.block.number)
  round.totalSupply = totalSupply
  round.participationRate = protocol.participationRate
  round.save()

  protocol.save()
  day.save()

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex())
  tx.blockNumber = event.block.number
  tx.gasUsed = event.transaction.gasUsed
  tx.gasPrice = event.transaction.gasPrice
  tx.timestamp = event.block.timestamp.toI32()
  tx.from = event.transaction.from.toHex()
  tx.to = event.transaction.to.toHex()
  tx.save()

  let mint = new MintEvent(makeEventId(event.transaction.hash, event.logIndex))
  mint.transaction = event.transaction.hash.toHex()
  mint.timestamp = event.block.timestamp.toI32()
  mint.round = round.id
  mint.to = event.params.to.toHex()
  mint.amount = amount
  mint.save()
}

export function burn(event: Burn): void {
  let protocol = Protocol.load('0')
  let value = convertToDecimal(event.params.value)
  let totalSupply = protocol.totalSupply.minus(value)

  protocol.totalSupply = totalSupply

  let day = createOrLoadDay(event.block.timestamp.toI32())

  day.totalSupply = totalSupply
  day.totalActiveStake = protocol.totalActiveStake

  if (protocol.totalActiveStake.gt(ZERO_BD)) {
    protocol.participationRate = protocol.totalActiveStake.div(totalSupply)
    day.participationRate = protocol.participationRate
  }

  let round = createOrLoadRound(event.block.number)
  round.totalSupply = totalSupply
  round.participationRate = protocol.participationRate
  round.save()

  protocol.save()
  day.save()

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex())
  tx.blockNumber = event.block.number
  tx.gasUsed = event.transaction.gasUsed
  tx.gasPrice = event.transaction.gasPrice
  tx.timestamp = event.block.timestamp.toI32()
  tx.from = event.transaction.from.toHex()
  tx.to = event.transaction.to.toHex()
  tx.save()

  let burn = new BurnEvent(makeEventId(event.transaction.hash, event.logIndex))
  burn.transaction = event.transaction.hash.toHex()
  burn.timestamp = event.block.timestamp.toI32()
  burn.round = round.id
  burn.value = value
  burn.save()
}
