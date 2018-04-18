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
const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const hot = module.hot && isDev
const trackingId = process.env.REACT_APP_GA_TRACKING_ID
;(async () => {
  // dump global styles
  injectGlobal`
    :root {
      --black: #000000;
      --white: #ffffff;
      --green: #00eb87;
      --tan: #faf5ef;
      --grey: #cfcfcf;
      --primary: var(--green);
      --bg-dark: var(--black);
      --bg-light: var(--tan);
    }
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
      background: var(--bg-light);
    }
    a { color: #03a678; }
    select {
      appearance: none;
      background: none;
      padding: 8px;
      padding-right: 40px;
      font-size: 14px;
      border-radius: 0;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      outline: none;
      border: 0;
      color: #000;
      background-color: #fff;
      background-image:
        linear-gradient(45deg, transparent 50%, #000 50%),
        linear-gradient(135deg, #000 50%, transparent 50%);
      background-position:
        calc(100% - 20px) calc(1em + 1px),
        calc(100% - 15px) calc(1em + 1px);
      background-size:
        5px 5px,
        5px 5px;
      background-repeat: no-repeat;
    }
    .tooltip-medium {
      max-width: 150px;
      white-space: normal;
      word-wrap: break-word;
      padding: 8px 16px;
    }
    .tooltip-nowrap {
      padding: 8px 16px;
    }
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
    // The address of the deployed Controller contract
    controllerAddress: process.env.REACT_APP_CONTROLLER_ADDRESS,
  })

  const update = () =>
    render(
      <Root store={store} history={history} client={client}>
        <App />
      </Root>,
      document.getElementById('main-root'),
    )

  update()

  // Analytics
  if (isProd && trackingId) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      window.dataLayer = window.dataLayer || []
      window.gtag = function() {
        window.dataLayer.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', trackingId)
    }
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
  }

  if (hot) module.hot.accept(update)
})()

unregister()
