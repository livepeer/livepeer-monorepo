import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Button, CTABanner } from '../components'
import Account from '../views/Account'
import Approve from '../views/Approve'
import Bond from '../views/Bond'
import ClaimEarnings from '../views/ClaimEarnings'
import ImportantMessage from '../views/ImportantMessage'
import Landing from '../views/Landing'
import SmartContracts from '../views/SmartContracts'
import ProtocolStatus from '../views/ProtocolStatus'
import ToastNotifications from '../views/ToastNotifications'
import Transcoders from '../views/Transcoders'

const App = () => (
  <BrowserRouter>
    <div>
      {/* Pages */}
      <Switch>
        <Route exact path="/about" component={Landing} />
        <Route exact path="/transcoders" component={Transcoders} />
        <Route path="/accounts/:accountId" component={Account} />
        <Route
          path="/me"
          render={({ location }, ctx) => {
            const { pathname, search } = location
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
        <Redirect to="/transcoders" />
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
                <Route path="/approve/:delegateAddress" component={Approve} />
                <Route path="/bond/:delegateAddress" component={Bond} />
                <Route path="/claim-earnings" component={ClaimEarnings} />
                <Route path="/smart-contracts" component={SmartContracts} />
                <Route path="/protocol-status" component={ProtocolStatus} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
      <Route component={ImportantMessage} />
      <ToastNotifications />
      <Switch>
        <Route exact path="/transcoders" component={() => null} />
        <Route
          path="*"
          render={({ history }) => (
            <CTABanner flag="view-transcoders">
              <div>
                If you are a token holder, you can participate in the network by
                staking towards a transcoder to earn fees and LPT rewards.
              </div>
              <div>
                <a
                  style={{
                    color: 'rgb(0, 235, 135)',
                    background: 'rgb(0, 0, 0)',
                    padding: '10px',
                    margin: 'auto',
                    textDecoration: 'none',
                  }}
                  target="_blank"
                  href="https://livepeer.org/#token"
                >
                  Get Livepeer Token
                </a>
              </div>
            </CTABanner>
          )}
        />
      </Switch>
    </div>
  </BrowserRouter>
)

export default App
