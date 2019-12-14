import { Address, BigInt } from '@graphprotocol/graph-ts'

const PERC_DIVISOR = 1000000

let x = BigInt.fromI32(2)
let y = <u8>255
let z = BigInt.fromI32(1)

export let MAXIMUM_VALUE_UINT256: BigInt = x.pow(y).minus(z)

// Make a number the specified number of digits
export function leftPad(str: string, size: i32): string {
  while (str.length < size) {
    str = '0' + str
  }
  return str
}

// Make a derived pool ID from a transcoder address
export function makePoolId(
  transcoderAddress: Address,
  roundId: BigInt
): string {
  return transcoderAddress.toHex() + '-' + leftPad(roundId.toString(), 40)
}

// Make a derived share ID from a delegator address
export function makeShareId(
  delegatorAddress: Address,
  roundId: BigInt
): string {
  return delegatorAddress.toHex() + '-' + leftPad(roundId.toString(), 40)
}

// Make a derived unlocking ID from a delegator address
export function makeUnbondingLockId(
  delegatorAddress: Address,
  unbondingLockId: BigInt
): string {
  return (
    delegatorAddress.toHex() + '-' + leftPad(unbondingLockId.toString(), 40)
  )
}

export function percOfWithDenom(
  _amount: BigInt,
  _fracNum: BigInt,
  _fracDenom: BigInt
): BigInt {
  return _amount
    .times(percPoints(_fracNum, _fracDenom))
    .div(BigInt.fromI32(PERC_DIVISOR))
}

export function percOf(_amount: BigInt, _fracNum: BigInt): BigInt {
  return _amount.times(_fracNum).div(BigInt.fromI32(PERC_DIVISOR))
}

export function percPoints(_fracNum: BigInt, _fracDenom: BigInt): BigInt {
  return _fracNum.times(BigInt.fromI32(PERC_DIVISOR)).div(_fracDenom)
}
