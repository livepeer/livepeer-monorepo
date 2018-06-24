import * as React from 'react'
import { lifecycle } from 'recompose'
import { ApolloProvider } from 'react-apollo'
import { Provider as UnstatedProvider } from 'unstated'
import { RMWCProvider } from 'rmwc/Provider'
import { ToastNotificationContainer } from '../containers'
import {
  TransactionsQuery,
  TransactionSubmittedSubscription,
  TransactionConfirmedSubscription,
} from '../enhancers'

const TOAST_NOTIFICATION = new ToastNotificationContainer()

const Root = ({ client, children }) => (
  <ApolloProvider client={client}>
    <UnstatedProvider inject={[TOAST_NOTIFICATION]}>
      <RMWCProvider listItemDefaultRipple={false}>{children}</RMWCProvider>
    </UnstatedProvider>
  </ApolloProvider>
)

const enhance = lifecycle({
  componentDidMount() {
    subscribe(this.props.client)
  },
})

function subscribe(client) {
  console.log('SUBSCRIBING TO TRANSACTIONS')
  try {
    client
      .subscribe({ query: TransactionSubmittedSubscription })
      .subscribe(({ data: { transactionSubmitted } = {}, errors }) => {
        if (errors) return console.log(errors)
        console.log('submitted', transactionSubmitted)
        const { from } = transactionSubmitted
        const { transactions } = client.readQuery({
          query: TransactionsQuery,
          variables: {
            address: from,
          },
        })
        client.writeQuery({
          query: TransactionsQuery,
          variables: {
            address: from,
          },
          data: {
            transactions: [transactionSubmitted, ...transactions],
          },
        })
        // console.log(
        //   client.readQuery({
        //     query: TransactionsQuery,
        //     variables: {
        //       address: from,
        //     },
        //   }),
        // )
      })
    client
      .subscribe({ query: TransactionConfirmedSubscription })
      .subscribe(({ data: { transactionConfirmed } = {}, errors }) => {
        if (errors) return console.log(errors)
        console.log('confirmed', transactionConfirmed)
        const { from } = transactionConfirmed
        const { transactions } = client.readQuery({
          query: TransactionsQuery,
          variables: {
            address: from,
          },
        })
        const txIndex = transactions.findIndex(
          x => x.id === transactionConfirmed.id,
        )
        if (txIndex > -1) {
          transactions[txIndex] = transactionConfirmed
        }
        client.writeQuery({
          query: TransactionsQuery,
          variables: {
            address: from,
          },
          data: {
            transactions:
              txIndex === -1
                ? [transactionConfirmed, ...transactions]
                : transactions,
          },
        })
        // console.log(
        //   client.readQuery({
        //     query: TransactionsQuery,
        //     variables: {
        //       address: from,
        //     },
        //   }),
        // )
      })
  } catch (err) {
    console.log('FAIL')
    console.error(err)
  }
}

export default enhance(Root)
