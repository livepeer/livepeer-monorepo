import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Account from '../views/Account'
import BondModals from '../views/BondModals'
import Landing from '../views/Landing'
import Transcoders from '../views/Transcoders'
import { history } from '../store'

const onMyAccountPage = (
  match: { params: { account: string } },
  account: ?string,
): boolean => (account ? match.params.account.toLowerCase() === account : false)

const App = ({ location }) => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/transcoders" component={Transcoders} />
      <Route
        path="/accounts/:account"
        render={props => {
          return onMyAccountPage(
            props.match,
            window.livepeer.config.defaultTx.from,
          ) ? (
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
          return !account ? <Redirect to="/" /> : <Account {...props} />
        }}
      />
      <Redirect to="/" />
    </Switch>
    <BondModals />
  </div>
)

export default App
