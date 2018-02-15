import 'babel-polyfill'
import 'url-search-params-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import createApolloClient from '@livepeer/apollo'
import store, { history } from './store'
import Root from './containers/Root'
import App from './containers/App'
// import registerServiceWorker from './registerServiceWorker'
;(async () => {
  // Should use hot module reloading if available
  const hot = module.hot && process.env.NODE_ENV === 'development'

  // Dump global styles
  injectGlobal`
    * { box-sizing: border-box }
    html, body {
      margin: 0;
      font-family: helvetica, arial, sans-serif;
      background: #f9f9f9;
    }
    a { color: #03a678; }
  `
  // Bootstrap the apollo client
  const client = await createApolloClient({
    provider: 'https://ethrpc-testnet.livepeer.org',
  })

  // Main UI rendering function
  const update = () =>
    render(
      <Root store={store} history={history} client={client}>
        <App />
      </Root>,
      document.getElementById('main-root'),
    )

  // Update the UI
  update()

  // Hot module reloading
  if (hot) module.hot.accept(update)
})()

// registerServiceWorker()
