import React from 'react'
import { render } from 'react-dom'
import createApolloClient from '@livepeer/apollo'
import store, { history } from '../store'
import Root from './Root'
import App from './App'

it('renders without crashing', async () => {
  const client = await createApolloClient()
  render(
    <Root store={store} history={history} client={client}>
      <App />
    </Root>,
    document.createElement('div'),
  )
})
