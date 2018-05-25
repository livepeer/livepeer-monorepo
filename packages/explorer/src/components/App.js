import React from 'react'
import {
  BrowserRouter,
  HashRouter,
  Redirect,
  Route,
  Switch,
  matchPath,
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Button, CTA, CTABanner, Modal } from '../components'
import Account from '../views/Account'
import BondModals from '../views/BondModals'
import ClaimEarningsModals from '../views/ClaimEarningsModals'
import Landing from '../views/Landing'
import ToastNotifications from '../views/ToastNotifications'
import Transcoders from '../views/Transcoders'

const App = () => (
  <BrowserRouter>
    <div>
      {/* Pages */}
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
              account &&
              account !== '0x0000000000000000000000000000000000000000'
            const nextPath =
              (authenticated
                ? pathname.replace(/^\/me/, `/accounts/${account}`)
                : '/') + search
            return <Redirect to={nextPath} />
          }}
        />
        <Redirect to="/" />
      </Switch>
      {/* Modals */}
      <Route
        render={({ location }) => (
          <TransitionGroup>
            <CSSTransition
              key={location.hash}
              classNames="modal"
              timeout={1000}
            >
              <Switch
                location={{
                  get pathname() {
                    // use hash as pathname
                    return location.hash.substr(1)
                  },
                }}
              >
                <Route path="/bond/:delegateAddress" component={BondModals} />
                <Route path="/claim-earnings" component={ClaimEarningsModals} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
      <CTA>
        <ToastNotifications />
        <Switch>
          <Route exact path="/transcoders" component={() => null} />
          <Route
            path="*"
            render={({ history }) => (
              <CTABanner flag="view-transcoders">
                <div>
                  If you are a token holder, you can participate in the network
                  by staking towards a transcoder and earn additional fees and
                  LPT rewards.
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
  </BrowserRouter>
)

export default App
