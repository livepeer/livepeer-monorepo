import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

const Root = ({ store, history, children }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        {children}
      </div>
    </ConnectedRouter>
  </Provider>
)

export default Root
