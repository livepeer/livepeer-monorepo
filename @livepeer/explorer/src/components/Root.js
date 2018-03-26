import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Provider as UnstatedProvider, Container } from 'unstated'
import {
  ToastNotificationContainer,
  TransactionStatusContainer,
} from '../containers'

const TRANSACTION_STATUS = new TransactionStatusContainer()
const TOAST_NOTIFICATION = new ToastNotificationContainer()

window.notify = id => {
  TOAST_NOTIFICATION.push({
    id,
    title: id,
    body: '...',
  }, 5000)
  // setTimeout(() => {
  //   console.log('DELETE', id)
  //   TOAST_NOTIFICATION.delete(id)
  // }, 5000)
}

const Root = ({ client, history, store, children }) => (
  <ApolloProvider client={client}>
    <ReduxProvider store={store}>
      <UnstatedProvider inject={[TRANSACTION_STATUS, TOAST_NOTIFICATION]}>
        <ConnectedRouter history={history}>{children}</ConnectedRouter>
      </UnstatedProvider>
    </ReduxProvider>
  </ApolloProvider>
)

export default Root
