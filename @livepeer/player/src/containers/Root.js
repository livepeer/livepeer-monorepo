import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

const Root = ({ client, history, store, children }) => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  </ApolloProvider>
)

export default Root
