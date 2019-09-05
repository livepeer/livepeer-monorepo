import { Address, BigInt } from "@graphprotocol/graph-ts";

// Make a number the specified number of digits
export function leftPad(str: string, size: i32): string {
  while (str.length < size) {
    str = "0" + str;
  }
  return str;
}

// Make a derived pool ID from a transcoder address
export function makePoolId(
  transcoderAddress: Address,
  roundId: BigInt
): string {
  return transcoderAddress.toHex() + "-" + leftPad(roundId.toString(), 40);
}

// Make a derived share ID from a delegator address
export function makeShareId(
  delegatorAddress: Address,
  roundId: BigInt
): string {
  return delegatorAddress.toHex() + "-" + leftPad(roundId.toString(), 40);
}

// Make a derived unlocking ID from a delegator address
export function makeUnbondingLockId(
  delegatorAddress: Address,
  unbondingLockId: BigInt
): string {
  return (
    delegatorAddress.toHex() + "-" + leftPad(unbondingLockId.toString(), 40)
  );
}
