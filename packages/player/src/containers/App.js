import React from 'react'
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom'
import Landing from '../views/Landing'
import Channel from '../views/Channel'
import AsyncLoader from './AsyncLoader'
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
      {/* Load Demo async, 99% of users aren't using D3 and such */}
      <Route
        exact
        path="/demo/:video?"
        render={props => (
          <QueryHandler
            {...props}
            component={AsyncLoader}
            required={false}
            asyncComponent={import('../views/Demo')}
            {...props}
          />
        )}
      />
      <Redirect to="/" />
    </Switch>
  </Router>
)

export default App
