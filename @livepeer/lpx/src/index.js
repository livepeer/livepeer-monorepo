#!/usr/bin/env node

import Table from 'cli-table'
import { Spinner } from 'cli-spinner'
import program from 'commander'
import Vorpal from 'vorpal'
import Livepeer from '@livepeer/sdk'
import pjson from '../package'

const LOGO = `
 _ _                                
| (_)                               
| |___   _____ _ __   ___  ___ _ __ 
| | \\ \\ / / _ \\ '_ \\ / _ \\/ _ \\ '__|
| | |\\ V /  __/ |_) |  __/  __/ |   
|_|_| \\_/ \\___| .__/ \\___|\\___|_|   
              | |                   
              |_|                   
------------------------------------
      C O N S O L E   M O D E
------------------------------------
`

// console.table shim
const toTable = x => {
  const isArray = Array.isArray(x)
  const len = isArray ? Object.keys(x[0] || {}).length : 2
  const head = isArray ? Object.keys(x[0] || {}) : ['key', 'value']
  const colWidths = isArray
    ? Array(len).fill(Math.floor((process.stdout.columns - 2 * len) / len))
    : [24, process.stdout.columns - 28]
  const t = new Table({ head, colWidths })
  if (isArray) {
    t.push(...x.map(x => Object.values(x).map(x => JSON.stringify(x))))
  } else {
    t.push(
      ...Object.entries(x).map(([key, value]) => [key, JSON.stringify(value)]),
    )
  }
  return t.toString()
}

console.table = x => console.log(toTable(x))

// configure spinner
Spinner.setDefaultSpinnerString(18) // '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'

// show version with lowercase -v flag as well
const vPos = process.argv.indexOf('-v')
if (vPos > -1) process.argv[vPos] = '-V'

program.version(pjson.version)

program.command('console').action(async () => {
  console.log(`
${LOGO}
For available commands, type 'help'.
  `)
  let { rpc, config, constants } = await Livepeer()
  const { VIDEO_PROFILES } = constants
  const toFunctionCallString = (key, args) =>
    `${key}(${args.map(x => JSON.stringify(x))})`
  const rpcKeyToDashes = x =>
    x.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
  const rpcKeyToCamel = x => x.replace(/-(.)/g, (a, b) => b.toUpperCase())
  const rpcKeys = Object.keys(rpc).map(rpcKeyToDashes)
  let WATCHERS = []
  let SPINNERS = []
  let POLL_VALS = []
  // interactive console
  const vorpal = Vorpal()
  /**
   * clear
   */
  vorpal.command('clear', 'Clears console').action((_, next) => {
    console.clear()
    next()
  })
  /**
   * status
   */
  vorpal.command('status', 'Clears console').action((_, next) => {
    console.table({
      account: config.defaultTx.from,
      gas: config.defaultTx.gas,
      provider: config.eth.currentProvider.host,
    })
    next()
  })
  /**
   * use
   */
  vorpal
    .command(
      'use [address]',
      'Switches the current account that sends transactions',
    )
    .parse(command => command.replace(/@/g, config.defaultTx.from))
    .types({ string: ['_', 'address', 'to', 'from'] })
    .option('-g, --gas <gas>', 'Default gas to include in transactions')
    .option('-p, --provider <url>', 'The contract HttpProvider url')
    .action(async ({ address, options }, next) => {
      const livepeer = await Livepeer({
        account:
          'undefined' === typeof address ? config.defaultTx.from : address,
        gas: options.gas || config.defaultTx.gas,
        provider: options.provider || config.eth.currentProvider.host,
      })
      rpc = livepeer.rpc
      config = livepeer.config
      console.table({
        account: config.defaultTx.from,
        gas: config.defaultTx.gas,
        provider: config.eth.currentProvider.host,
      })
      next()
    })
  /**
   * @
   */
  vorpal
    .command('me', 'Displays default transaction account address')
    .alias('@')
    .action((_, next) => {
      console.log(config.defaultTx.from)
      next()
    })
  /**
   * accounts
   */
  vorpal
    .command('accounts', 'Shows all available account addresses')
    .alias('ls')
    .action((_, next) => {
      const t = new Table({
        head: [' ', 'address'],
        colWidths: [3, process.stdout.columns - 6],
      })
      const x = config.accounts.map((x, i) => ({ ' ': i, address: x }))
      t.push(...x.map(x => Object.values(x).map(x => JSON.stringify(x))))
      console.log(t.toString())
      next()
    })
  /**
   * tx
   */
  vorpal
    .command('tx', 'Displays default transaction info')
    .action((_, next) => {
      console.table(config.defaultTx)
      next()
    })
  /**
   * video-profiles
   */
  vorpal
    .command('video-profiles', 'Lists available video transcoding profiles')
    .alias('profiles')
    .action((_, next) => {
      console.table(Object.values(VIDEO_PROFILES))
      next()
    })
  /**
   * call
   */
  vorpal
    .command('call <method> [args...]', 'Gets values from deployed contracts')
    .parse(command => command.replace(/@/g, config.defaultTx.from))
    .types({
      string: ['_', 'address', 'to', 'from', 'broadcaster', 'transcoder'],
    })
    .autocomplete(rpcKeys)
    .allowUnknownOptions()
    .action(async ({ method, args = [], options }, next) => {
      let spinner
      const key = rpcKeyToCamel(method)
      if (!rpc.hasOwnProperty(key)) {
        console.warn(`There is no '${key}' call method`)
        return next()
      }
      try {
        const f = rpc[key]
        const { profiles, ...opts } = options
        const parsedArgs = Object.keys(options).length
          ? [options]
          : args.map(x => (x.substring(0, 2) === '0x' ? x : JSON.parse(x)))
        // comma-separated list of video profile names
        if (profiles) parsedArgs[0].profiles = profiles.split(',')
        spinner = new Spinner({
          onTick: msg => {
            console.clear()
            console.log(msg)
          },
          text: `%s Calling livepeer.rpc.${toFunctionCallString(
            key,
            parsedArgs,
          )} ...\n`,
        })
        spinner.start()
        const res = await f(...parsedArgs)
        console.clear()
        spinner.stop()
        console['object' === typeof res ? 'table' : 'log'](res)
      } catch (err) {
        console.error(`Error [${method}]:`, err.message)
        if (spinner) spinner.stop()
      }
      next()
    })
  /**
   * poll
   */
  vorpal
    .command(
      'poll <method> [args...]',
      'Polls for values from deployed contracts',
    )
    .parse(command => command.replace(/@/g, config.defaultTx.from))
    .types({
      string: ['_', 'address', 'to', 'from', 'broadcaster', 'transcoder'],
    })
    .autocomplete(rpcKeys)
    .allowUnknownOptions()
    .action(async ({ method, args = [], options }, next) => {
      const key = rpcKeyToCamel(method)
      if (!rpc.hasOwnProperty(key)) {
        console.warn(`There is no '${key}' rpc method`)
        return next()
      }
      try {
        const f = rpc[key]
        const filter = await new config.eth.filter.Filter({
          delay: 1000,
        })
        filter.new({ toBlock: 'latest' })
        const { delay, ...opts } = options
        const parsedArgs = Object.keys(opts).length
          ? [opts]
          : args.map(x => (x.substring(0, 2) === '0x' ? x : JSON.parse(x)))
        let value = ''
        async function printData() {
          try {
            const res = await f(...parsedArgs)
            value = 'object' === typeof res ? toTable(res) : res
          } catch (err) {
            console.clear()
            console.error(`Error [${method}]:`, err.message)
          }
        }
        const watcher = filter.watch(printData)
        WATCHERS.push(watcher)
        const spinner = new Spinner({
          onTick: msg => {
            const index = WATCHERS.indexOf(watcher)
            POLL_VALS[index] = msg + '\n' + value
            if (index === 0) {
              console.clear()
              console.log(POLL_VALS.filter(x => x).join('\n'))
              vorpal.show()
            }
          },
          text: `Polling livepeer.rpc.${toFunctionCallString(
            key,
            parsedArgs,
          )} ...\n`,
        })
        spinner.start()
        SPINNERS.push(spinner)
        printData()
        console.clear()
      } catch (err) {
        console.error(`Error [${method}]:`, err.message)
      }
      next()
    })
  /**
   * stop
   */
  vorpal.command('stop', 'Stops active watcher').action((_, next) => {
    if (!WATCHERS.length) return next(console.log('not watching anything!'))
    WATCHERS.forEach(x => x.stopWatching())
    WATCHERS = []
    SPINNERS.forEach(x => x.stop())
    SPINNERS = []
    POLL_VALS = []
    console.log('Stopped polling')
    next()
  })
  // run
  vorpal.delimiter('⚡').show()
})

program.parse(process.argv)

if (!program.args.length) {
  program.outputHelp()
}
