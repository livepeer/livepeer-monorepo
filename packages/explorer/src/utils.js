import { matchPath } from 'react-router'
import Big from 'big.js'
import BN from 'bn.js'
import unit, { unitMap } from 'ethjs-unit'

export const MathBN = {
  sub: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return aBN.sub(bBN).toString(10)
  },
  add: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return aBN.add(bBN).toString(10)
  },
  mul: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return aBN.mul(bBN).toString(10)
  },
  div: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return aBN.div(bBN).toString(10)
  },
  min: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return (aBN.lt(bBN) ? a : b).toString(10)
  },
  max: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return (aBN.gt(bBN) ? a : b).toString(10)
  },
}

export const sleep = (ms, val) =>
  new Promise(resolve => setTimeout(() => resolve(val), ms))

export function formatPercentage(x: string, decimals = 2): string {
  return !x
    ? ''
    : Big(x)
        .div('10000')
        .toFixed(decimals)
        .replace(/0+$/, '')
        .replace(/\.$/, '')
}

export function formatBalance(
  x: string,
  decimals: number = 6,
  unit: string = 'ether',
): string {
  return !x
    ? ''
    : Big(x)
        .div(unitMap[unit])
        .toFixed(decimals)
        .replace(/\.0+$/, '')
}

export function toBaseUnit(x: string) {
  return !x ? '' : unit.toWei(x, 'ether').toString(10)
}

export function promptForArgs(
  prompts: Array<{
    ask: string,
    format?: (input: string) => any,
  }>,
): Array<any> {
  const args = []
  for (const prompt of prompts) {
    const val = window.prompt(prompt.ask)
    args.push(prompt.format ? prompt.format(val) : val)
  }
  return args
}

export function openSocket(url: string): WebSocket {
  const ws = new WebSocket(url)
  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      resolve(ws)
    }
  })
}

export function isMe(url: string): boolean {
  return !!matchPath(url, { path: '/me' })
}

export function getAccountParam(url: string): string {
  const match = matchPath(url, { path: '/accounts/:account' })
  return match ? match.params.account : ''
}

export const pathInfo = {
  isMe,
  getAccountParam,
}

export function msToTime(duration: number): string {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24)
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  return hours + 'h ' + minutes + 'min ' + seconds + 's'
}

export function toRGBA(hex, opacity = 1) {
  const x = hex.replace('#', '')
  const len = x.length
  const r = parseInt(x.substring(0, len / 3), 16)
  const g = parseInt(x.substring(len / 3, 2 * len / 3), 16)
  const b = parseInt(x.substring(2 * len / 3, 3 * len / 3), 16)
  const a = Math.min(1, Math.max(0, opacity))
  return `rgba(${[r, g, b, a]})`
}

export function wireTransactionToStatus(tx, query, send) {
  return async (...args) => {
    try {
      let status = tx.findWhere(query)
      // 1. Submit transaction (signals loading state)
      status = status.merge({ submitted: true })
      tx.commit(status)
      // TODO: In the future, this call should return the tx rather than the receipt
      const receipt = await send(...args)
      // 2. Update transaction hash (signals transaction is pending)
      status = status.merge({
        hash: receipt.transactionHash,
      })
      tx.commit(status)
      // 3. Update transaction completion
      // TODO: subscribe to transactions and update this status elsewhere. (Errors as well)
      status = status.merge({ done: true })
      tx.commit(status)
    } catch (error) {
      console.error(error)
      let status = tx.findWhere({
        id: query.id,
        type: query.type,
      })
      if (error.graphQLErrors) {
        const [gqlError] = error.graphQLErrors
        try {
          // try to parse the error message
          const rpcErr = JSON.parse(
            `{"code":${gqlError.message.split('"code":')[1]}`,
          )
          console.log(rpcErr)
          const nextError = new Error(rpcErr.message)
          // use a custom error with the rpc error message
          status = status.merge({ done: true, error: nextError })
          tx.commit(status)
        } catch (err) {
          // if the message can't be parsed, just use the gql error
          status = status.merge({ done: true, error: gqlError })
          tx.commit(status)
        }
      } else {
        // if something else went wrong, use the original error
        status = status.merge({ done: true, error })
        tx.commit(status)
      }
    }
  }
}

export const mockAccount = ({ id = '', ...account } = {}) => ({
  id,
  ethBalance: '0',
  tokenBalance: '0',
  ...account,
  broadcaster: mockBroadcaster({
    id,
    ...account.broadcaster,
  }),
  delegator: mockDelegator({
    id,
    ...account.delegator,
  }),
  transcoder: mockTranscoder({
    id,
    ...account.transcoder,
  }),
})

export const mockBroadcaster = ({ id = '', ...broadcaster } = {}) => ({
  deposit: '0',
  id,
  jobs: [],
  withdrawBlock: '0',
  ...broadcaster,
})

export const mockDelegator = ({ id = '', ...delegator } = {}) => ({
  bondedAmount: '0',
  id,
  delegateAddress: '',
  delegatedAmount: '0',
  fees: '0',
  lastClaimRound: '0',
  startRound: '0',
  status: '',
  withdrawRound: '0',
  ...delegator,
})

export const mockRound = ({ id = '', ...round } = {}) => ({
  id,
  initialized: false,
  lastInitializedRound: '0',
  length: '0',
  startBlock: '0',
  ...round,
})

export const mockTranscoder = ({ id = '', ...transcoder } = {}) => ({
  active: false,
  feeShare: '0',
  id,
  lastRewardRound: '0',
  pricePerSegment: '0',
  pendingRewardCut: '0',
  pendingFeeShare: '0',
  pendingPricePerSegment: '0',
  rewardCut: '0',
  status: '',
  totalStake: '0',
  ...transcoder,
})
