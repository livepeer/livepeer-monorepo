import Transaction from './Transaction'

const Subscription = `

type Subscription {

  "A newly submitted transaction"
  transactionSubmitted: Transaction!

  "A newly confirmed transaction"
  transactionConfirmed: Transaction!

}
`

export default () => [Subscription, Transaction]
