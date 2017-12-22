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
        exact
        path="/accounts/:account"
        component={props => {
          const onMyAccountPage =
            window.web3 &&
            props.match.params.account.toLowerCase() ===
              window.web3.eth.accounts[0].toLowerCase()
          // redirect to '/me'
          if (onMyAccountPage) history.replace('/me')
          return <Account {...props} />
        }}
      />
      <Route
        exact
        path="/me"
        component={(props, ctx) => {
          return (
            <Account
              {...props}
              me={true}
              match={{
                ...props.match,
                params: {
                  ...props.match.params,
                  account: window.web3.eth.accounts[0],
                },
              }}
            />
          )
        }}
      />
      <Redirect to="/" />
    </Switch>
  </div>
)

export default App
