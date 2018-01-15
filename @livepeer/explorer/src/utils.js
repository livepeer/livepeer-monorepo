import Big from 'big.js'

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
