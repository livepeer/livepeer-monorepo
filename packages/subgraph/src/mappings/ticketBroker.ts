import {
  WinningTicketRedeemed as WinningTicketRedeemedEvent,
  ReserveFunded as ReserveFundedEvent,
  DepositFunded as DepositFundedEvent,
  ReserveClaimed as ReserveClaimedEvent,
  Withdrawal as WithdrawalEvent,
} from '../types/TicketBroker/TicketBroker'
import { UniswapV2Pair } from '../types/TicketBroker/UniswapV2Pair'
import {
  DayData,
  WinningTicketRedeemed,
  Protocol,
  Transcoder,
  Broadcaster,
  Round,
  ReserveFunded,
  ReserveClaimed,
  DepositFunded,
  Withdrawal,
} from '../types/schema'
import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import {
  convertToDecimal,
  getDaiEthPairAddress,
  makeEventId,
  ZERO_BD,
  ZERO_BI,
} from '../../utils/helpers'

export function winningTicketRedeemed(event: WinningTicketRedeemedEvent): void {
  let uniswapV2PairAddress = getDaiEthPairAddress()
  let daiEthPair = UniswapV2Pair.bind(Address.fromString(uniswapV2PairAddress))
  let protocol = Protocol.load('0') || new Protocol('0')
  let round = Round.load(protocol.currentRound)
  let winningTicketRedeemed = new WinningTicketRedeemed(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  let faceValue = convertToDecimal(event.params.faceValue)
  let ethPrice = ZERO_BD

  // DAI-ETH pair was created during this block
  if(event.block.number.gt(BigInt.fromI32(10095742))) {
    let daiEthPairReserves = daiEthPair.getReserves()
    ethPrice = convertToDecimal(daiEthPairReserves.value0).div(convertToDecimal(daiEthPairReserves.value1))
  }

  winningTicketRedeemed.hash = event.transaction.hash.toHex()
  winningTicketRedeemed.blockNumber = event.block.number
  winningTicketRedeemed.gasUsed = event.transaction.gasUsed
  winningTicketRedeemed.gasPrice = event.transaction.gasPrice
  winningTicketRedeemed.timestamp = event.block.timestamp
  winningTicketRedeemed.from = event.transaction.from.toHex()
  winningTicketRedeemed.to = event.transaction.to.toHex()
  winningTicketRedeemed.round = protocol.currentRound
  winningTicketRedeemed.sender = event.params.sender.toHex()
  winningTicketRedeemed.recipient = event.params.recipient.toHex()
  winningTicketRedeemed.faceValue = faceValue
  winningTicketRedeemed.winProb = event.params.winProb
  winningTicketRedeemed.senderNonce = event.params.senderNonce
  winningTicketRedeemed.recipientRand = event.params.recipientRand
  winningTicketRedeemed.auxData = event.params.auxData
  winningTicketRedeemed.save()

  // Update broadcaster's deposit & reserve
  let broadcaster = Broadcaster.load(event.params.sender.toHex())
  if (faceValue.gt(broadcaster.deposit as BigDecimal)) {
    broadcaster.deposit = ZERO_BD
  } else {
    broadcaster.deposit = broadcaster.deposit.minus(faceValue)
  }

  // Update transcoder's fee volume
  let transcoder =
    Transcoder.load(event.params.recipient.toHex()) ||
    new Transcoder(event.params.recipient.toHex())
  transcoder.totalVolumeETH = transcoder.totalVolumeETH.plus(faceValue)
  transcoder.totalVolumeUSD = transcoder.totalVolumeUSD.plus(faceValue.times(ethPrice))
  transcoder.save()

  // Update total protocol fee volume
  protocol.totalVolumeETH = protocol.totalVolumeETH.plus(faceValue)
  protocol.totalVolumeUSD = protocol.totalVolumeUSD.plus(faceValue.times(ethPrice))
  
  protocol.totalWinningTickets = protocol.totalWinningTickets.plus(ZERO_BI)
  protocol.save()

  // Update fee volume for this day
  let timestamp = event.block.timestamp.toI32()
  let dayID = timestamp / 86400
  let dayStartTimestamp = dayID * 86400
  let dayData = DayData.load(dayID.toString())
  if (dayData === null) {
    dayData = new DayData(dayID.toString())
    dayData.date = dayStartTimestamp
    dayData.volumeUSD = ZERO_BD
    dayData.volumeETH = ZERO_BD
    dayData.totalSupply = protocol.totalSupply as BigDecimal
    dayData.totalActiveStake = protocol.totalActiveStake as BigDecimal
    dayData.participationRate = protocol.participationRate as BigDecimal
  }

  // Update fee volume for this day
  dayData.volumeETH = dayData.volumeETH.plus(faceValue)
  dayData.volumeUSD = dayData.volumeUSD.plus(faceValue.times(ethPrice))
  dayData.save()

  // Update fee volume for this round
  round.volumeETH = round.volumeETH.plus(faceValue)
  round.volumeUSD = round.volumeUSD.plus(faceValue.times(ethPrice))
  round.save()
}

export function depositFunded(event: DepositFundedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let broadcaster =
    Broadcaster.load(event.params.sender.toHex()) ||
    new Broadcaster(event.params.sender.toHex())
  broadcaster.deposit = broadcaster.deposit.plus(
    convertToDecimal(event.params.amount),
  )
  broadcaster.save()

  let depositFunded = new DepositFunded(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  depositFunded.hash = event.transaction.hash.toHex()
  depositFunded.blockNumber = event.block.number
  depositFunded.gasUsed = event.transaction.gasUsed
  depositFunded.gasPrice = event.transaction.gasPrice
  depositFunded.timestamp = event.block.timestamp
  depositFunded.from = event.transaction.from.toHex()
  depositFunded.to = event.transaction.to.toHex()
  depositFunded.round = protocol.currentRound
  depositFunded.sender = event.params.sender.toHex()
  depositFunded.amount = convertToDecimal(event.params.amount)
  depositFunded.save()
}

export function reserveFunded(event: ReserveFundedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let broadcaster =
    Broadcaster.load(event.params.reserveHolder.toHex()) ||
    new Broadcaster(event.params.reserveHolder.toHex())

  broadcaster.reserve = broadcaster.reserve.plus(
    convertToDecimal(event.params.amount),
  )
  broadcaster.save()

  let reserveFunded = new ReserveFunded(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  reserveFunded.hash = event.transaction.hash.toHex()
  reserveFunded.blockNumber = event.block.number
  reserveFunded.gasUsed = event.transaction.gasUsed
  reserveFunded.gasPrice = event.transaction.gasPrice
  reserveFunded.timestamp = event.block.timestamp
  reserveFunded.from = event.transaction.from.toHex()
  reserveFunded.to = event.transaction.to.toHex()
  reserveFunded.round = protocol.currentRound
  reserveFunded.reserveHolder = event.params.reserveHolder.toHex()
  reserveFunded.amount = convertToDecimal(event.params.amount)
  reserveFunded.save()
}

export function reserveClaimed(event: ReserveClaimedEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let broadcaster = Broadcaster.load(event.params.reserveHolder.toHex())
  broadcaster.reserve = broadcaster.reserve.minus(
    convertToDecimal(event.params.amount),
  )
  broadcaster.save()

  let reserveClaimed = new ReserveClaimed(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  reserveClaimed.hash = event.transaction.hash.toHex()
  reserveClaimed.blockNumber = event.block.number
  reserveClaimed.gasUsed = event.transaction.gasUsed
  reserveClaimed.gasPrice = event.transaction.gasPrice
  reserveClaimed.timestamp = event.block.timestamp
  reserveClaimed.from = event.transaction.from.toHex()
  reserveClaimed.to = event.transaction.to.toHex()
  reserveClaimed.round = protocol.currentRound
  reserveClaimed.reserveHolder = event.params.reserveHolder.toHex()
  reserveClaimed.claimant = event.params.claimant.toHex()
  reserveClaimed.amount = convertToDecimal(event.params.amount)
  reserveClaimed.save()
}

export function withdrawal(event: WithdrawalEvent): void {
  let protocol = Protocol.load('0') || new Protocol('0')
  let broadcaster = Broadcaster.load(event.params.sender.toHex())
  broadcaster.deposit = ZERO_BD
  broadcaster.reserve = ZERO_BD
  broadcaster.save()

  let withdrawal = new Withdrawal(
    makeEventId(event.transaction.hash, event.logIndex),
  )
  withdrawal.hash = event.transaction.hash.toHex()
  withdrawal.blockNumber = event.block.number
  withdrawal.gasUsed = event.transaction.gasUsed
  withdrawal.gasPrice = event.transaction.gasPrice
  withdrawal.timestamp = event.block.timestamp
  withdrawal.from = event.transaction.from.toHex()
  withdrawal.to = event.transaction.to.toHex()
  withdrawal.round = protocol.currentRound
  withdrawal.sender = event.params.sender.toHex()
  withdrawal.deposit = convertToDecimal(event.params.deposit)
  withdrawal.reserve = convertToDecimal(event.params.reserve)
  withdrawal.save()
}
