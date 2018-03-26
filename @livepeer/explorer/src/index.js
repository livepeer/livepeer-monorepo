import 'babel-polyfill'
import 'url-search-params-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import createApolloClient from '@livepeer/apollo'
import store, { history } from './store'
import Root from './components/Root'
import App from './components/App'
import { unregister } from './registerServiceWorker'
;(async () => {
  // should use hot module reloading if available
  const hot = module.hot && process.env.NODE_ENV === 'development'

  // dump global styles
  injectGlobal`
    @font-face {
      font-family: 'AkkuratMonoPro';
      src: url('/static/fonts/lineto-akkuratmono-pro-regular.eot');
      src: url('/static/fonts/lineto-akkuratmono-pro-regular.eot?#iefix')
          format('embedded-opentype'),
        url('/static/fonts/lineto-akkuratmono-pro-regular.woff2') format('woff2'),
        url('/static/fonts/lineto-akkuratmono-pro-regular.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }
    * {
      box-sizing: border-box;
      font-weight: 300;
      // font-family: 'AkkuratMonoPro';
    }
    html, body {
      margin: 0;
      font-family: 'Helvetica Neue', helvetica, arial, sans-serif;
      background: #fafafa;
    }
    a { color: #03a678; }
  `
  // bootstrap the apollo client
  const client = await createApolloClient({
    // Allow builds to configure the http provider
    provider: process.env.REACT_APP_HTTP_PROVIDER,
    // Default gas limit to send with transactions (2.1m wei)
    defaultGas: 2.1 * 1000000,
    // If user account changes while on /me, this will hard refresh the page
    onAccountChange: (currentAccount: string, nextAccount: string): void => {
      const path = window.location.pathname.toLowerCase()
      const onMyAccountPage = path === '/me'
      const accountChanged = nextAccount && currentAccount
      if (onMyAccountPage && accountChanged) return window.location.reload()
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

unregister()
