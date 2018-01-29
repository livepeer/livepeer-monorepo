import { matchPath } from 'react-router'
import Big from 'big.js'

export function formatPercentage(x: string, decimals = 2): string {
  return !x
    ? ''
    : Big(x)
        .div('10000')
        .toFixed(decimals)
        .replace(/0+$/, '')
        .replace(/\.$/, '')
}

export function formatBalance(x: string, decimals: number = 6): string {
  if (!x) return ''
  return Big(x)
    .div('1000000000000000000')
    .toFixed(decimals)
    .replace(/0+$/, '')
    .replace(/\.$/, '')
}

export function toBaseUnit(x: string) {
  return Big(x)
    .mul('1000000000000000000')
    .toString()
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
    args.push(prompt.format(val))
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
