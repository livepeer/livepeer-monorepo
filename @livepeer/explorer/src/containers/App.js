import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Landing from '../views/Landing'
import Account from '../views/Account'

const App = ({ location }) => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/accounts/:account" component={Account} />
      <Redirect to="/" />
    </Switch>
  </div>
)

export default App
