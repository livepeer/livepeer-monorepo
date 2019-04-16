import { Address, BigInt } from "@graphprotocol/graph-ts";

// Make a number the specified number of digits
export function leftPad(str: String, size: i32): String {
  while (str.length < size) {
    str = "0" + str;
  }
  return str;
}

// Make a derived reward ID from a transcoder address
export function makeRewardId(
  transcoderAddress: Address,
  roundId: BigInt
): String {
  return transcoderAddress.toHex() + "-" + leftPad(roundId.toString(), 40);
}
