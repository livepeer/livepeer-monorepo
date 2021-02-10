import {
  WinningTicketRedeemed,
  ReserveFunded,
  DepositFunded,
  ReserveClaimed,
  Withdrawal,
} from "../types/TicketBroker/TicketBroker";
import { UniswapV2Pair } from "../types/TicketBroker/UniswapV2Pair";
import { UniswapV1Exchange } from "../types/TicketBroker/UniswapV1Exchange";
import {
  Transaction,
  Protocol,
  Broadcaster,
  WinningTicketRedeemedEvent,
  ReserveFundedEvent,
  ReserveClaimedEvent,
  DepositFundedEvent,
  WithdrawalEvent,
} from "../types/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  convertToDecimal,
  createOrLoadDay,
  createOrLoadRound,
  createOrLoadTranscoder,
  createOrLoadTranscoderDay,
  getUniswapV1DaiEthExchangeAddress,
  getUniswapV2DaiEthPairAddress,
  makeEventId,
  ZERO_BD,
  ZERO_BI,
} from "../../utils/helpers";

export function winningTicketRedeemed(event: WinningTicketRedeemed): void {
  let round = createOrLoadRound(event.block.number);
  let day = createOrLoadDay(event.block.timestamp.toI32());
  let winningTicketRedeemed = new WinningTicketRedeemedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  let protocol = Protocol.load("0");
  let faceValue = convertToDecimal(event.params.faceValue);
  let ethPrice = ZERO_BD;

  // DAI-ETH V2 pair was created during this block
  if (event.block.number.gt(BigInt.fromI32(10095742))) {
    let address = getUniswapV2DaiEthPairAddress();
    let daiEthPair = UniswapV2Pair.bind(Address.fromString(address));
    let daiEthPairReserves = daiEthPair.getReserves();
    ethPrice = convertToDecimal(daiEthPairReserves.value0).div(
      convertToDecimal(daiEthPairReserves.value1)
    );
  } else {
    let address = getUniswapV1DaiEthExchangeAddress();
    let daiEthExchange = UniswapV1Exchange.bind(Address.fromString(address));
    ethPrice = convertToDecimal(
      daiEthExchange.getTokenToEthOutputPrice(BigInt.fromI32(10).pow(18))
    );
  }

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  winningTicketRedeemed.transaction = event.transaction.hash.toHex();
  winningTicketRedeemed.timestamp = event.block.timestamp.toI32();
  winningTicketRedeemed.round = round.id;
  winningTicketRedeemed.sender = event.params.sender.toHex();
  winningTicketRedeemed.recipient = event.params.recipient.toHex();
  winningTicketRedeemed.faceValue = faceValue;
  winningTicketRedeemed.faceValueUSD = faceValue.times(ethPrice);
  winningTicketRedeemed.winProb = event.params.winProb;
  winningTicketRedeemed.senderNonce = event.params.senderNonce;
  winningTicketRedeemed.recipientRand = event.params.recipientRand;
  winningTicketRedeemed.auxData = event.params.auxData;
  winningTicketRedeemed.save();

  let broadcaster = Broadcaster.load(event.params.sender.toHex());
  if (faceValue.gt(broadcaster.deposit)) {
    broadcaster.deposit = ZERO_BD;
  } else {
    broadcaster.deposit = broadcaster.deposit.minus(faceValue);
  }

  // Update transcoder's fee volume
  let transcoder = createOrLoadTranscoder(event.params.recipient.toHex());
  transcoder.totalVolumeETH = transcoder.totalVolumeETH.plus(faceValue);
  transcoder.totalVolumeUSD = transcoder.totalVolumeUSD.plus(
    faceValue.times(ethPrice)
  );
  transcoder.save();

  // Update total protocol fee volume
  protocol.totalVolumeETH = protocol.totalVolumeETH.plus(faceValue);
  protocol.totalVolumeUSD = protocol.totalVolumeUSD.plus(
    faceValue.times(ethPrice)
  );

  protocol.winningTicketCount = protocol.winningTicketCount + 1;
  protocol.save();

  day.totalSupply = protocol.totalSupply;
  day.totalActiveStake = protocol.totalActiveStake;
  day.participationRate = protocol.participationRate;
  day.volumeETH = day.volumeETH.plus(faceValue);
  day.volumeUSD = day.volumeUSD.plus(faceValue.times(ethPrice));
  day.save();

  let transcoderDay = createOrLoadTranscoderDay(
    event.block.timestamp.toI32(),
    event.params.recipient.toHex()
  );
  transcoderDay.volumeETH = transcoderDay.volumeETH.plus(faceValue);
  transcoderDay.volumeUSD = transcoderDay.volumeUSD.plus(
    faceValue.times(ethPrice)
  );
  transcoderDay.save();

  // Update fee volume for this round
  round.volumeETH = round.volumeETH.plus(faceValue);
  round.volumeUSD = round.volumeUSD.plus(faceValue.times(ethPrice));
  round.save();
}

export function depositFunded(event: DepositFunded): void {
  let round = createOrLoadRound(event.block.number);
  let broadcaster = Broadcaster.load(event.params.sender.toHex());

  if (broadcaster == null) {
    broadcaster = new Broadcaster(event.params.sender.toHex());
    broadcaster.deposit = ZERO_BD;
    broadcaster.reserve = ZERO_BD;
  }

  broadcaster.deposit = broadcaster.deposit.plus(
    convertToDecimal(event.params.amount)
  );
  broadcaster.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let depositFunded = new DepositFundedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  depositFunded.transaction = event.transaction.hash.toHex();
  depositFunded.timestamp = event.block.timestamp.toI32();
  depositFunded.round = round.id;
  depositFunded.sender = event.params.sender.toHex();
  depositFunded.amount = convertToDecimal(event.params.amount);
  depositFunded.save();
}

export function reserveFunded(event: ReserveFunded): void {
  let round = createOrLoadRound(event.block.number);
  let broadcaster = Broadcaster.load(event.params.reserveHolder.toHex());

  if (broadcaster == null) {
    broadcaster = new Broadcaster(event.params.reserveHolder.toHex());
    broadcaster.deposit = ZERO_BD;
    broadcaster.reserve = ZERO_BD;
  }

  broadcaster.reserve = broadcaster.reserve.plus(
    convertToDecimal(event.params.amount)
  );
  broadcaster.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let reserveFunded = new ReserveFundedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  reserveFunded.transaction = event.transaction.hash.toHex();
  reserveFunded.timestamp = event.block.timestamp.toI32();
  reserveFunded.round = round.id;
  reserveFunded.reserveHolder = event.params.reserveHolder.toHex();
  reserveFunded.amount = convertToDecimal(event.params.amount);
  reserveFunded.save();
}

export function reserveClaimed(event: ReserveClaimed): void {
  let round = createOrLoadRound(event.block.number);
  let broadcaster = Broadcaster.load(event.params.reserveHolder.toHex());
  broadcaster.reserve = broadcaster.reserve.minus(
    convertToDecimal(event.params.amount)
  );
  broadcaster.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let reserveClaimed = new ReserveClaimedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  reserveClaimed.transaction = event.transaction.hash.toHex();
  reserveClaimed.timestamp = event.block.timestamp.toI32();
  reserveClaimed.round = round.id;
  reserveClaimed.reserveHolder = event.params.reserveHolder.toHex();
  reserveClaimed.claimant = event.params.claimant.toHex();
  reserveClaimed.amount = convertToDecimal(event.params.amount);
  reserveClaimed.save();
}

export function withdrawal(event: Withdrawal): void {
  let round = createOrLoadRound(event.block.number);
  let broadcaster = Broadcaster.load(event.params.sender.toHex());
  broadcaster.deposit = ZERO_BD;
  broadcaster.reserve = ZERO_BD;
  broadcaster.save();

  let tx =
    Transaction.load(event.transaction.hash.toHex()) ||
    new Transaction(event.transaction.hash.toHex());
  tx.blockNumber = event.block.number;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.timestamp = event.block.timestamp.toI32();
  tx.from = event.transaction.from.toHex();
  tx.to = event.transaction.to.toHex();
  tx.save();

  let withdrawal = new WithdrawalEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  withdrawal.transaction = event.transaction.hash.toHex();
  withdrawal.timestamp = event.block.timestamp.toI32();
  withdrawal.round = round.id;
  withdrawal.sender = event.params.sender.toHex();
  withdrawal.deposit = convertToDecimal(event.params.deposit);
  withdrawal.reserve = convertToDecimal(event.params.reserve);
  withdrawal.save();
}
