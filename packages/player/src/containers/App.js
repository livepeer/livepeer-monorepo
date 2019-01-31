import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Landing from '../views/Landing'
import Channel from '../views/Channel'
import Embed from '../views/Embed'
import QueryHandler from './QueryHandler'

// https://player.livepeer.org/play?url=https://abc123.cloudflare.net/something/current

const App = ({ location }) => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
      {/* <Route exact path="/channels/:channel" component={Channel} />
      <Route exact path="/embed/:channel" component={Embed} /> */}
      <Route
        exact
        path="/play"
        render={props => <QueryHandler {...props} component={Channel} />}
      />
      <Route
        exact
        path="/embed"
        render={props => <QueryHandler {...props} component={Embed} />}
      />
      <Redirect to="/" />
    </Switch>
  </div>
)

export default App
