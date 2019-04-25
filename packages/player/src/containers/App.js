import React from 'react'
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom'
import Landing from '../views/Landing'
import Channel from '../views/Channel'
import Embed from '../views/Embed'
import QueryHandler from './QueryHandler'

const App = ({ location }) => (
  <Router>
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
      <Redirect to="/" />
    </Switch>
  </Router>
)

export default App
