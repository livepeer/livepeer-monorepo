import { Address, BigInt } from '@graphprotocol/graph-ts'
import { BondingManager } from '../types/BondingManager/BondingManager'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'

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
  roundId: BigInt,
): string {
  return leftPad(roundId.toString(), 10) + '-' + transcoderAddress.toHex()
}

// Make a derived share ID from a delegator address
export function makeShareId(
  delegatorAddress: Address,
  roundId: BigInt,
): string {
  return leftPad(roundId.toString(), 10) + '-' + delegatorAddress.toHex()
}

// Make a derived unlocking ID from a delegator address
export function makeUnbondingLockId(
  delegatorAddress: Address,
  unbondingLockId: BigInt,
): string {
  return (
    leftPad(unbondingLockId.toString(), 10) + '-' + delegatorAddress.toHex()
  )
}

export function percOfWithDenom(
  _amount: BigInt,
  _fracNum: BigInt,
  _fracDenom: BigInt,
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

export function getRoundsManagerInstance(network: string): RoundsManager {
  return RoundsManager.bind(
    Address.fromString(
      network == 'mainnet'
        ? '3984fc4ceeef1739135476f625d36d6c35c40dc3'
        : 'EB0EF46B5771D523402234FF0d7596d2C62411dE',
    ),
  )
}

export function getBondingManagerInstance(network: string): BondingManager {
  return BondingManager.bind(
    Address.fromString(
      network == 'mainnet'
        ? '511bc4556d823ae99630ae8de28b9b80df90ea2e'
        : 'F6b0Ceb5e3f25b6FBecf8186F8A68B4E42A96a17',
    ),
  )
}
