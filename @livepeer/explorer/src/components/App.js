import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Account from '../views/Account'
import BondModals from '../views/BondModals'
import ClaimEarningsModals from '../views/ClaimEarningsModals'
import Landing from '../views/Landing'
import Transcoders from '../views/Transcoders'
import { history } from '../store'

const onMyAccountPage = (
  match: { params: { accountId: string } },
  accountId: ?string,
): boolean =>
  accountId ? match.params.accountId.toLowerCase() === accountId : false

const App = ({ location }) => (
  <div>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route exact path="/transcoders" component={Transcoders} />
      <Route
        path="/accounts/:accountId"
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
          const athenticated =
            account && account !== '0x0000000000000000000000000000000000000000'
          return !athenticated ? <Redirect to="/" /> : <Account {...props} />
        }}
      />
      <Redirect to="/" />
    </Switch>
    <BondModals />
    <ClaimEarningsModals />
  </div>
)

export default App
