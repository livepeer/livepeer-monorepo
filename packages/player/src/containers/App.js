import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Landing from '../views/Landing'
import Channel from '../views/Channel'
import Embed from '../views/Embed'

const App = ({ location }) => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/channels/:channel" component={Channel} />
      <Route exact path="/embed/:channel" component={Embed} />
      <Redirect to="/" />
    </Switch>
  </div>
)

export default App
