import React from 'react'
import { Route } from 'react-router-dom'
import Landing from '../views/Landing'
import Channel from '../views/Channel'

const App = ({ location }) => (
  <div>
    <Route exact path="/" component={Landing} />
    <Route exact path="/channels/:channel" component={Channel} />
  </div>
)

export default App
