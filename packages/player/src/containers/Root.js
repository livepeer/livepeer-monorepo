import React from 'react'
import { ApolloProvider } from 'react-apollo'

const Root = ({ client, history, store, children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
)

export default Root
