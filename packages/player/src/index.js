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
const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const hot = module.hot && isDev
const trackingId = process.env.REACT_APP_GA_TRACKING_ID
;(async () => {
  // Dump global styles
  injectGlobal`
    * {
      box-sizing: border-box;
      font-weight: 300;
    }
    html, body {
      margin: 0;
      font-family: 'Helvetica Neue', helvetica, arial, sans-serif;
      background: #fafafa;
    }
    a { color: #03a678; }
  `
  // Bootstrap the apollo client
  const client = await createApolloClient({
    controllerAddress: process.env.REACT_APP_CONTROLLER_ADDRESS,
    provider: process.env.REACT_APP_HTTP_PROVIDER,
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

  // Hot module reloading
  if (hot) module.hot.accept(update)
})()

// registerServiceWorker()
