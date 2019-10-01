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
  } else {
    return 'muted'
  }
}

export const getDelegatorStatus = (
  delegator: Delegator,
  currentRound: Round
): string => {
  if(!delegator) {
    return 'Unbonded'
  }
  if (Utils.fromWei(delegator.bondedAmount) == 0) {
    return 'Unbonded'
  } else if (
    parseInt(delegator.startRound.id, 10) > parseInt(currentRound.id, 10)
  ) {
    return 'Pending'
  } else if (
    parseInt(delegator.startRound.id, 10) > 0 &&
    parseInt(delegator.startRound.id, 10) <= parseInt(currentRound.id, 10)
  ) {
    return 'Bonding'
  } else if (
    delegator.unbondingLocks.filter(
      (lock: UnbondingLock) =>
        lock.withdrawRound && lock.withdrawRound > parseInt(currentRound.id, 10)
    )
  ) {
    return 'Unbonding'
  } else {
    return 'Unbonded'
  }
}
