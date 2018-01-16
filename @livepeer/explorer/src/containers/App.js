import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Landing from '../views/Landing'
import Account from '../views/Account'
import { history } from '../store'

const App = ({ location }) => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route
        path="/accounts/:account"
        render={props => {
          const account = window.livepeer.config.defaultTx.from
          const onMyAccountPage = account
            ? props.match.params.account.toLowerCase() === account
            : false
          return onMyAccountPage ? (
            <Redirect to="/me" />
          ) : (
            <Account {...props} />
          )
        }}
      />
      <Route
        path="/me"
        render={(props, ctx) => {
          const account = window.livepeer.config.defaultTx.from
          return !account ? (
            <Redirect to="/" />
          ) : (
            <Account {...props} />
          )
        }}
      />
      <Redirect to="/" />
    </Switch>
  </div>
)

export default App
