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
    provider: 'https://rinkeby.infura.io/srFaWg0SlljdJAoClX3B',
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
    script.onload = () => {
      const dataLayer = window.dataLayer || []
      const gtag = (window.gtag = dataLayer.push.bind(dataLayer))
      gtag('js', new Date())
      gtag('config', trackingId)
    }
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    document.getElementsByTagName('head')[0].appendChild(script)
  }

  // Hot module reloading
  if (hot) module.hot.accept(update)
})()

// registerServiceWorker()
