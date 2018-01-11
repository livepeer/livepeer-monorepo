import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Landing from '../views/Landing'
import Account from '../views/Account'
import { history } from '../store'

/**
 * Gets the currently selected Eth account in the window.web3 instance
 * @todo - add prop `account` to redux state
 */
const getEthAccount = () =>
  window.web3 &&
  window.web3.eth &&
  window.web3.eth.accounts &&
  window.web3.eth.accounts[0] &&
  window.web3.eth.accounts[0].toLowerCase()

const App = ({ location }) => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route
        exact
        path="/accounts/:account"
        component={props => {
          const account = getEthAccount()
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
        exact
        path="/me"
        component={(props, ctx) => {
          const account = getEthAccount()
          return !account ? (
            <Redirect to="/" />
          ) : (
            <Account
              {...props}
              me={true}
              match={{
                ...props.match,
                params: {
                  ...props.match.params,
                  account,
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
