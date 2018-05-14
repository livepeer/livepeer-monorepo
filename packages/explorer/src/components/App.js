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
        render={props => <Account {...props} />}
      />
      <Route
        path="/me"
        render={(props, ctx) => {
          const { pathname, search } = props.location
          const account = window.livepeer.config.defaultTx.from
          const authenticated =
            account && account !== '0x0000000000000000000000000000000000000000'
          const nextPath =
            (authenticated
              ? pathname.replace(/^\/me/, `/accounts/${account}`)
              : '/') + search
          return <Redirect to={nextPath} />
        }}
      />
      <Redirect to="/" />
    </Switch>
    <BondModals />
    <ClaimEarningsModals />
    <CTA>
      <ToastNotifications />
      <Switch>
        <Route exact path="/transcoders" component={() => null} />
        <Route
          path="*"
          component={() => (
            <CTABanner flag="view-transcoders">
              <div>
                If you are a token holder, you can participate in the network by
                staking towards a transcoder and earn additional fees and LPT
                rewards.
              </div>
              <div>
                <Button
                  style={{ margin: 0 }}
                  onClick={() => history.push('/transcoders?tour=true')}
                >
                  Start Delegating
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
