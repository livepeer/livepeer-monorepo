import { withHandlers } from 'recompose'
import { msToTime, openSocket, promptForArgs, toBaseUnit } from '../utils'

export default withHandlers({
  onRequestETH: props =>
    async function requestETH(e: Event): void {
      try {
        e.preventDefault()
        const socket = await openSocket('ws://52.14.204.154/api')
        // handle error
        socket.onerror = (e: Event): void => {
          window.alert(e.message)
        }
        // handle success
        socket.onmessage = (e: Event): void => {
          const data = JSON.parse(e.data)
          if (data.requests) {
            data.requests.forEach(({ account: addr, time }) => {
              if (addr.toLowerCase() !== props.account.id.toLowerCase()) return
              const t1 = Date.now()
              const t2 = +new Date(time)
              const t = t1 - t2
              const waitTime = 270 * 60 * 1000
              const timeRemaining = waitTime - t
              if (timeRemaining > 0) {
                window.alert(
                  `You may tap the ETH faucet again in ${msToTime(
                    waitTime - t,
                  )}`,
                )
              } else {
                window.alert('Got some ETH from the faucet! :)')
              }
            })
          }
        }
        // send request
        socket.send(`{"url":"${props.account.id}","tier":2}`)
      } catch (err) {
        window.alert(err.message)
      }
    },
  onRequestLPT: props =>
    async function requestLPT(e: Event): void {
      try {
        e.preventDefault()
        const { tapFaucet } = window.livepeer.rpc
        await tapFaucet()
        window.alert('Got LPT!')
      } catch (err) {
        window.alert(err.message)
      }
    },
  onDepositETH: props =>
    async function depositETH(e: Event): void {
      try {
        e.preventDefault()
        const { deposit } = window.livepeer.rpc
        const args = promptForArgs([
          {
            ask: 'How Much ETH would you like to deposit?',
            format: toBaseUnit,
          },
        ]).filter(x => x)
        if (args.length < 1) return console.warn('Aborting transaction...')
        await deposit(...args)
        window.alert('Deposit complete!')
      } catch (err) {
        window.alert(err.message)
      }
    },
  onTransferLPT: props =>
    async function transferLPT(e: Event): void {
      try {
        e.preventDefault()
        const { transferToken } = window.livepeer.rpc
        const args = promptForArgs([
          {
            ask: 'Who would you like to transfer LPT to?',
          },
          {
            ask: 'How Much LPT would you like to transfer?',
            format: toBaseUnit,
          },
        ])
        if (args.length < 2) return console.warn('Aborting transaction...')
        await transferToken(...args)
        window.alert('Transfer complete!')
      } catch (err) {
        window.alert(err.message)
      }
    },
  onBondLPT: props =>
    async function bondLPT(address: string): void {
      window.open(
        'https://livepeer.readthedocs.io/en/latest/bonding_and_delegation.html',
      )
      // try {
      //   const { bond } = window.livepeer.rpc
      //   const args = promptForArgs([
      //     {
      //       ask: 'How Much LPT would you like to bond?',
      //       format: toBaseUnit,
      //     },
      //   ])
      //   if (args.length < 1) return console.warn('Aborting transaction...')
      //   await bond(address, ...args)
      //   window.alert('Bond complete!')
      // } catch (err) {
      //   window.alert(err.message)
      // }
    },
})
