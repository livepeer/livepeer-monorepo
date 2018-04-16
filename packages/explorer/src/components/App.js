import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Button, CTA, CTABanner } from '../components'
import Account from '../views/Account'
import BondModals from '../views/BondModals'
import ClaimEarningsModals from '../views/ClaimEarningsModals'
import Landing from '../views/Landing'
import ToastNotifications from '../views/ToastNotifications'
import Transcoders from '../views/Transcoders'
import { history } from '../store'

const onMyAccountPage = (
  match: { params: { accountId: string } },
  accountId: ?string,
): boolean =>
  accountId ? match.params.accountId.toLowerCase() === accountId : false

const App = props => (
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
    <ToastNotifications />
    <CTA>
      <Switch>
        <Route exact path="/transcoders" component={() => null} />
        <Route
          path="*"
          component={() => (
            <CTABanner flag="view-transcoders">
              <div>
                Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien
                odio sollicitudin, in neque magna, orci pede, vel eleifend urna.
              </div>
              <div style={{ minWidth: 320, textAlign: 'right' }}>
                <Button
                  style={{ margin: 0 }}
                  onClick={() => history.push('/transcoders?tour=true')}
                >
                  View Transcoders
                </Button>
              </div>
            </CTABanner>
          )}
        />
      </Switch>
    </CTA>
  </div>
)

export default App
