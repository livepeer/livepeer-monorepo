import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Landing from '../views/Landing'
import Channel from '../views/Channel'
import Demo from '../views/Demo'
import Embed from '../views/Embed'
import QueryHandler from './QueryHandler'

const App = ({ location }) => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
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
      <Route exact path="/demo/:video?" render={props => <Demo {...props} />} />
      <Redirect to="/" />
    </Switch>
  </div>
)

export default App
