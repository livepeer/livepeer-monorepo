import React from 'react'
import { render } from 'react-dom'
import { injectGlobal } from 'styled-components'
import store, { history } from './store'
import Root from './containers/Root'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'

const init = () => {
  injectGlobal`
    * { box-sizing: border-box }
    html, body {
      margin: 0;
      font-family: helvetica, arial, sans-serif;
      background: #f9f9f9;
    }
    a { color: #03a678; }
  `
}

const update = () =>
  render(
    <Root store={store} history={history}>
      <App />
    </Root>,
    document.getElementById('main-root'),
  )

init()
update()
registerServiceWorker()

if (module.hot) module.hot.accept(update)
