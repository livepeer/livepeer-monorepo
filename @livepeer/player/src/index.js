import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import createClient from './client'
import store, { history } from './store'
import Root from './containers/Root'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'

let client

const init = async () => {
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
  client = await createClient()
}

const update = () =>
  render(
    <Root store={store} history={history} client={client}>
      <App />
    </Root>,
    document.getElementById('main-root'),
  )

const run = async () => {
  await init()
  update()
  registerServiceWorker()
  if (module.hot && process.env.NODE_ENV === 'development')
    module.hot.accept(update)
}

run()
