import { PollCreated } from "../types/PollCreator/PollCreator";
import { Transaction, Poll, PollCreatedEvent } from "../types/schema";
import { createOrLoadRound, makeEventId } from "../../utils/helpers";
import { Poll as PollTemplate } from "../types/templates";

export function pollCreated(event: PollCreated): void {
  let round = createOrLoadRound(event.block.number);

  let poll = new Poll(event.params.poll.toHex());
  poll.tally = event.params.poll.toHex();
  poll.proposal = event.params.proposal.toString();
  poll.endBlock = event.params.endBlock;
  poll.quorum = event.params.quorum;
  poll.quota = event.params.quota;
  poll.save();

  // Instantiate data source template
  PollTemplate.create(event.params.poll);

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

  let pollCreated = new PollCreatedEvent(
    makeEventId(event.transaction.hash, event.logIndex)
  );
  pollCreated.transaction = event.transaction.hash.toHex();
  pollCreated.timestamp = event.block.timestamp.toI32();
  pollCreated.round = round.id;
  pollCreated.poll = event.params.poll.toHex();
  pollCreated.proposal = event.params.proposal;
  pollCreated.endBlock = event.params.endBlock;
  pollCreated.quorum = event.params.quorum;
  pollCreated.quota = event.params.quota;
  pollCreated.save();
}
