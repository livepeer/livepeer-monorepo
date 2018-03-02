import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Provider as UnstatedProvider, Container } from 'unstated'
import { TransactionStatusContainer } from '../containers'

const TRANSACTION_STATUS = new TransactionStatusContainer()

const Root = ({ client, history, store, children }) => (
  <ApolloProvider client={client}>
    <ReduxProvider store={store}>
      <UnstatedProvider inject={[TRANSACTION_STATUS]}>
        <ConnectedRouter history={history}>{children}</ConnectedRouter>
      </UnstatedProvider>
    </ReduxProvider>
  </ApolloProvider>
)

export default Root
