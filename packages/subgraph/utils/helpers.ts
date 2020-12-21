import { Address, BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts'

let x = BigInt.fromI32(2)
let y = <u8>255
let z = BigInt.fromI32(1)

export let MAXIMUM_VALUE_UINT256: BigInt = x.pow(y).minus(z)
export let EMPTY_ADDRESS = Address.fromString(
  '0000000000000000000000000000000000000000',
)
export let PERC_DIVISOR = 1000000

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

// Make a number the specified number of digits
export function leftPad(str: string, size: i32): string {
  while (str.length < size) {
    str = '0' + str
  }
  return str
}

// Make a derived pool ID from a transcoder address
export function makePoolId(transcoderAddress: string, roundId: string): string {
  return leftPad(roundId, 10) + '-' + transcoderAddress
}

// Make a derived share ID from a delegator address
export function makeShareId(delegatorAddress: string, roundId: string): string {
  return leftPad(roundId, 10) + '-' + delegatorAddress
}

// Make a vote id
export function makeVoteId(
  delegatorAddress: string,
  pollAddress: string,
): string {
  return delegatorAddress + '-' + pollAddress
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

export function getBondingManagerAddress(network: string): string {
  if (network == 'mainnet') {
    return '511bc4556d823ae99630ae8de28b9b80df90ea2e'
  } else if (network == 'rinkeby') {
    return 'e75a5DccfFe8939F7f16CC7f63EB252bB542FE95'
  } else {
    return 'A94B7f0465E98609391C623d0560C5720a3f2D33'
  }
}

export function getLivepeerTokenAddress(network: string): string {
  if (network == 'mainnet') {
    return '58b6a8a3302369daec383334672404ee733ab239'
  } else if (network == 'rinkeby') {
    return '23b814a57D53b1a7A860194F53401D0D639abED7'
  } else {
    return 'D833215cBcc3f914bD1C9ece3EE7BF8B14f841bb'
  }
}

export function getDaiEthPairAddress(): string {
  return 'a478c2975ab1ea89e8196811f51a7b7ade33eb11'
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function convertToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(BI_18))
}
