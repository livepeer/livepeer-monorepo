import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import createApolloClient from '@livepeer/apollo'
import store, { history } from './store'
import Root from './containers/Root'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'
;(async () => {
  // should use hot module reloading if available
  const hot = module.hot && process.env.NODE_ENV === 'development'

  // dump global styles
  injectGlobal`
    * { box-sizing: border-box }
    html, body {
      margin: 0;
      font-family: helvetica, arial, sans-serif;
      background: #f9f9f9;
    }
    a { color: #03a678; }
  `
  // bootstrap the apollo client
  const client = await createApolloClient({
    // If user account changes while on /me, this will hard refresh the page
    onAccountChange: (currentAccount: string, nextAccount: string): void => {
      const path = window.location.pathname.toLowerCase()
      const onMyAccountPage = path === '/me' || nextAccount
      if (onMyAccountPage) return window.location.reload()
    },
  })

  const update = () =>
    render(
      <Root store={store} history={history} client={client}>
        <App />
      </Root>,
      document.getElementById('main-root'),
    )

  update()

  if (hot) module.hot.accept(update)
})()

registerServiceWorker()
