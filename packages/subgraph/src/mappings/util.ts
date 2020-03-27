import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { BondingManager } from '../types/BondingManager/BondingManager'
import { RoundsManager } from '../types/RoundsManager/RoundsManager'

let x = BigInt.fromI32(2)
let y = <u8>255
let z = BigInt.fromI32(1)

export let MAXIMUM_VALUE_UINT256: BigInt = x.pow(y).minus(z)

export const PERC_DIVISOR = 1000000

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
  roundId: string,
): string {
  return leftPad(roundId, 10) + '-' + transcoderAddress.toHex()
}

// Make a derived share ID from a delegator address
export function makeShareId(
  delegatorAddress: Address,
  roundId: string,
): string {
  return leftPad(roundId, 10) + '-' + delegatorAddress.toHex()
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

export function makeEventId(hash: Bytes, index: BigInt): string {
  return hash.toHex() + '-' + index.toString()
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
        : '572d1591bD41f50130FD0212058eAe34F1B17290',
    ),
  )
}

export function getBondingManagerInstance(network: string): BondingManager {
  return BondingManager.bind(
    Address.fromString(
      network == 'mainnet'
        ? '511bc4556d823ae99630ae8de28b9b80df90ea2e'
        : 'e75a5DccfFe8939F7f16CC7f63EB252bB542FE95',
    ),
  )
}
