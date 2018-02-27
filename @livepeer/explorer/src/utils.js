import { matchPath } from 'react-router'
import Big from 'big.js'
import unit, { unitMap } from 'ethjs-unit'

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
