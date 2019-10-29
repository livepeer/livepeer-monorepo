import { Delegator, Round, UnbondingLock } from '../@types'
import Utils from 'web3-utils'

export const abbreviateNumber = (value, precision = 3) => {
  let newValue = value
  const suffixes = ['', 'K', 'M', 'B', 'T']
  let suffixNum = 0
  while (newValue >= 1000) {
    newValue /= 1000
    suffixNum++
  }

  newValue = parseFloat(Number.parseFloat(newValue).toPrecision(precision))

  newValue += suffixes[suffixNum]
  return newValue
}

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const getDelegationStatusColor = status => {
  if (status == 'Bonded') {
    return 'primary'
  } else if (status == 'Unbonding') {
    return 'yellow'
  } else if (status == 'Pending') {
    return 'blue'
  } else {
    return 'muted'
  }
}

export const getDelegatorStatus = (
  delegator: Delegator,
  currentRound: Round,
): string => {
  if (
    !delegator ||
    !delegator.bondedAmount ||
    Utils.fromWei(delegator.bondedAmount) == 0
  ) {
    return 'Unbonded'
  } else if (
    delegator.unbondingLocks.filter(
      (lock: UnbondingLock) =>
        lock.withdrawRound &&
        lock.withdrawRound > parseInt(currentRound.id, 10),
    ).length > 0
  ) {
    return 'Unbonding'
  } else if (delegator.startRound > parseInt(currentRound.id, 10)) {
    return 'Pending'
  } else if (
    delegator.startRound > 0 &&
    delegator.startRound <= parseInt(currentRound.id, 10)
  ) {
    return 'Bonded'
  } else {
    return 'Unbonded'
  }
}

export const MAXIUMUM_VALUE_UINT256 =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export const MAX_EARNINGS_CLAIMS_ROUNDS = 100