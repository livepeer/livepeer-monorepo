import {
  Minter,
  SetCurrentRewardTokens,
  ParameterUpdate,
} from "../types/Minter/Minter";
import {
  Transaction,
  Protocol,
  ParameterUpdateEvent,
  SetCurrentRewardTokensEvent,
} from "../types/schema";
import {
  convertToDecimal,
  createOrLoadRound,
  makeEventId,
} from "../../utils/helpers";

export function setCurrentRewardTokens(event: SetCurrentRewardTokens): void {
  let minter = Minter.bind(event.address);
  let round = createOrLoadRound(event.block.number);
  let protocol = Protocol.load("0");

  round.mintableTokens = convertToDecimal(event.params.currentMintableTokens);
  round.save();

  // The variables targetBondingRate, inflationChange, and inflation are
  // initially set inside the Minter's constructor, however constructors are
  // currently disallowed in call handlers so we'll set them in here for now
  protocol.targetBondingRate = minter.targetBondingRate();
  protocol.inflationChange = minter.inflationChange();
  protocol.inflation = minter.inflation();
  protocol.save();

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

  let setCurrentRewardTokensEvent = new SetCurrentRewardTokensEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  setCurrentRewardTokensEvent.transaction = event.transaction.hash.toHex();
  setCurrentRewardTokensEvent.timestamp = event.block.timestamp.toI32();
  setCurrentRewardTokensEvent.round = round.id;
  setCurrentRewardTokensEvent.currentMintableTokens = convertToDecimal(
    event.params.currentMintableTokens
  );
  setCurrentRewardTokensEvent.currentInflation = event.params.currentInflation;
  setCurrentRewardTokensEvent.save();
}

export function parameterUpdate(event: ParameterUpdate): void {
  let minter = Minter.bind(event.address);
  let round = createOrLoadRound(event.block.number);
  let protocol = Protocol.load("0");

  if (event.params.param == "targetBondingRate") {
    protocol.targetBondingRate = minter.targetBondingRate();
  }

  if (event.params.param == "inflationChange") {
    protocol.inflationChange = minter.inflationChange();
  }

  protocol.save();

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

  let parameterUpdateEvent = new ParameterUpdateEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  parameterUpdateEvent.transaction = event.transaction.hash.toHex();
  parameterUpdateEvent.timestamp = event.block.timestamp.toI32();
  parameterUpdateEvent.round = round.id;
  parameterUpdateEvent.param = event.params.param;
  parameterUpdateEvent.save();
}
