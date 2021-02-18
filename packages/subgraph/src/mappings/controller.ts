import {
  Transaction,
  Protocol,
  PauseEvent,
  UnpauseEvent,
} from "../types/schema";
import { createOrLoadRound, makeEventId } from "../../utils/helpers";
import { Pause, Unpause } from "../types/Controller/Controller";

export function pause(event: Pause): void {
  let round = createOrLoadRound(event.block.number);
  let protocol = Protocol.load("0");
  protocol.paused = true;
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

  let pauseEvent = new PauseEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  pauseEvent.transaction = event.transaction.hash.toHex();
  pauseEvent.timestamp = event.block.timestamp.toI32();
  pauseEvent.round = round.id;
  pauseEvent.save();
}

export function unpause(event: Unpause): void {
  let round = createOrLoadRound(event.block.number);
  let protocol = Protocol.load("0");
  protocol.paused = false;
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

  let unpauseEvent = new UnpauseEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  unpauseEvent.transaction = event.transaction.hash.toHex();
  unpauseEvent.timestamp = event.block.timestamp.toI32();
  unpauseEvent.round = round.id;
  unpauseEvent.save();
}
