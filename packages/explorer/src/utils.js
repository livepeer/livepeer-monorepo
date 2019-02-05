import { matchPath } from 'react-router'
import Big from 'big.js'
import BN from 'bn.js'
import unit, { unitMap } from 'ethjs-unit'

export async function notify(title, options) {
  const permission = await Notification.requestPermission()
  return permission === 'granted' ? new Notification(title, options) : undefined
}

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
  gt: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return aBN.gt(bBN)
  },
  gte: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return aBN.gte(bBN)
  },
  lt: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return aBN.lt(bBN)
  },
  lte: (a: string | BN, b: string | BN): string => {
    const aBN = new BN(a || '0')
    const bBN = new BN(b || '0')
    return aBN.lte(bBN)
  },
  mul: (a: string | BN, b: string | BN): string => {
    const aBN = new Big(a || '0')
    const bBN = new Big(b || '0')
    return aBN.mul(bBN).toString(10)
  },
  div: (a: string | BN, b: string | BN): string => {
    const aBN = new Big(a || '0')
    const bBN = new Big(b || '0')
    try {
      return aBN.div(bBN).toString(10)
    } catch (err) {
      console.error(err)
      return 0
    }
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
  toBig: (x: string | BN): BN => {
    return new Big(x)
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
  decimals: number = 0,
  unit: string = 'ether',
): string {
  decimals = decimals ? decimals : unitMap[unit].length
  return !x
    ? '0'
    : parseFloat(
        Big(x)
          .div(unitMap[unit])
          .toFixed(decimals)
          .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1'),
      ).toString()
}

export function formatRoundsToDate(round: number): string {
  let date = new Date()
  date.setDate(date.getDate() + round)
  const [weekDay, month, day, year] = date.toDateString().split(' ')
  return `${weekDay}, ${month} ${day}, ${year}`
}

export function toBaseUnit(x: string) {
  try {
    return !x ? '' : unit.toWei(x, 'ether').toString(10)
  } catch (err) {
    console.warn(err)
    return ''
  }
}

export function fromBaseUnit(x: string) {
  return !x ? '' : formatBalance(x, 18)
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
  //let milliseconds = parseInt((duration % 1000) / 100),
  let seconds = parseInt((duration / 1000) % 60),
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
  const g = parseInt(x.substring(len / 3, (2 * len) / 3), 16)
  const b = parseInt(x.substring((2 * len) / 3, (3 * len) / 3), 16)
  const a = Math.min(1, Math.max(0, opacity))
  return `rgba(${[r, g, b, a]})`
}

export async function enableAccounts() {
  if (window.ethereum) {
    // This variable will tell the rest of the application if we're in limited mode
    window.limitedWeb3Conn = true
    // this is the new metamask way. details: https://bit.ly/2QQHXvF
    window.web3 = new window.Web3(window.ethereum)
    try {
      await window.ethereum.enable()
      window.limitedWeb3Conn = false
    } catch (e) {
      console.log('METAMASK | Access to accounts denied')
      limitedMode()
    }
  }
  return
}

export async function limitedMode() {
  // Enable limited mode if and only if window.Web3 exists
  if (window.Web3 && window.ethereum) {
    window.limitedWeb3Conn = true
    window.web3 = new window.Web3(window.ethereum)
  } else if (window.web3 && window.web3.version) {
    // this is the old way, accounts are always exposed.
    window.web3 = new window.Web3(window.web3.currentProvider)
  }
}
