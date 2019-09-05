import { LivepeerToken, Approval } from "../types/LivepeerToken/LivepeerToken";
import { Delegator } from "../types/schema";

// Handler for NewRound events
export function approval(event: Approval): void {
  let livepeerToken = LivepeerToken.bind(event.address);
  let owner = event.params.owner;
  let spender = event.params.spender;

  // Create delegator if it does not yet exist
  let delegator = Delegator.load(owner.toHex());
  if (delegator == null) {
    delegator = new Delegator(owner.toHex());
  }

  let allowance = livepeerToken.allowance(owner, spender);
  delegator.allowance = allowance;
  delegator.save();
}
