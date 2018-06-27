import React from 'react'
import { compose } from 'recompose'
import styled from 'styled-components'
import { NavLink, Link } from 'react-router-dom'
import {
  MoreHorizontal as MoreHorizontalIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Sliders as HomeIcon,
  Cpu as CpuIcon,
  User as UserIcon,
} from 'react-feather'
import { MenuItem, SimpleMenu } from 'rmwc/Menu'
import { Button } from 'rmwc/Button'
import { Icon } from 'rmwc/Icon'
import Navbar from './Navbar'
import {
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectToasts,
} from '../enhancers'

const BasicNavbar = ({ onSearch, currentRound, toasts, coinbase }) => {
  const myAccountAddress = coinbase.data.coinbase
  const notAuthenticated = !myAccountAddress
  const { host } = window.livepeer.config.eth.currentProvider
  const networkName = !window.web3
    ? /infura/.test(host)
      ? host.split('.')[0].replace(/(http|https):\/\//, '')
      : 'Custom RPC'
    : {
        1: 'Mainnet',
        4: 'Rinkeby',
      }[window.web3.version.network] || 'Custom RPC'
  const initializeRound = async () => {
    try {
      if (notAuthenticated) return
      if (currentRound.data.initialized) return
      toasts.push({
        id: 'initialize-round',
        title: 'Initializing round...',
        body: 'The current round is being initialized.',
      })
      await window.livepeer.rpc.initializeRound()
      toasts.push({
        id: 'initialize-round',
        type: 'success',
        title: 'Initialization complete',
        body: 'The current round is now initialized.',
      })
    } catch (err) {
      toasts.push({
        id: 'initialize-round',
        type: 'error',
        title: 'Initialization failed',
        body: err.message,
      })
    }
  }
  return (
    <Navbar>
      <Nav>
        <Link to="/" style={{ lineHeight: 0, padding: '8px 0' }}>
          <img
            src={`${process.env.PUBLIC_URL}/wordmark.svg`}
            height="24"
            alt="The Livepeer wordmark"
          />
        </Link>
        {
          <React.Fragment>
            <span
              onClick={initializeRound}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                paddingRight: 24,
                padding: 8,
                background: 'none',
                cursor:
                  currentRound.loading || currentRound.data.initialized
                    ? 'default'
                    : 'pointer',
                color: currentRound.loading
                  ? '#aaa'
                  : currentRound.data.initialized
                    ? 'var(--primary)'
                    : 'orange',
                // width: 116,
                height: 24,
                marginLeft: 16,
                whiteSpace: 'nowrap',
                fontSize: 10,
                textTransform: 'uppercase',
                boxShadow: `inset 0 0 0 1px ${
                  currentRound.loading
                    ? '#aaa'
                    : currentRound.data.initialized
                      ? 'var(--primary)'
                      : 'orange'
                }`,
              }}
            >
              {networkName}
            </span>
            <span
              onClick={initializeRound}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                paddingRight: 24,
                padding: `4px 8px`,
                background: currentRound.loading
                  ? '#aaa'
                  : currentRound.data.initialized
                    ? 'var(--primary)'
                    : 'orange',
                cursor:
                  currentRound.loading || currentRound.data.initialized
                    ? 'default'
                    : 'pointer',
                color: '#000',
                width: 116,
                whiteSpace: 'nowrap',
              }}
            >
              {currentRound.loading ? (
                <MoreHorizontalIcon size={16} />
              ) : currentRound.data.initialized ? (
                <PlayIcon size={16} />
              ) : (
                <PauseIcon size={16} />
              )}
              <span style={{ fontSize: 10, textTransform: 'uppercase' }}>
                &nbsp;Round #{currentRound.data.id}
              </span>
            </span>
          </React.Fragment>
        }

        {/*onSearch && <NavSearch onSearch={onSearch} />*/}

        <div
          style={{
            display: 'inline-flex',
            flexFlow: 'row wrap',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            color: '#fff',
          }}
        >
          <NavbarLink exact to="/token">
            <Icon
              stategy="url"
              use={`/static/images/lpt-${
                window.location.pathname === '/token' ? 'green' : 'light'
              }.svg`}
              style={{ width: 16 }}
            />
            <span>&nbsp;Token</span>
          </NavbarLink>
          <NavbarLink to="/transcoders">
            <CpuIcon size={16} />
            <span>&nbsp;Transcoders</span>
          </NavbarLink>
          {myAccountAddress && (
            <NavbarLink
              to="/me"
              isActive={(match, location) => {
                const { pathname } = location
                const [addr] = pathname
                  .split('/')
                  .filter(x => x.substring(0, 2) === '0x')
                return addr ? addr.toLowerCase() === myAccountAddress : false
              }}
            >
              <UserIcon size={16} />
              <span>&nbsp;My Account</span>
            </NavbarLink>
          )}
          <SimpleMenu
            handle={
              <Button
                style={{
                  minWidth: 0,
                  width: 32,
                  height: 32,
                  color: '#fff',
                  marginLeft: 16,
                }}
              >
                <Icon use="more_vert" />
              </Button>
            }
            onSelected={async ({ detail }) => {
              const { action } = detail.item.dataset
              switch (action) {
                case 'feedback':
                  return window.open(
                    'https://github.com/livepeer/livepeerjs/issues',
                  )
                case 'smart-contracts':
                  return (window.location.hash = '#/smart-contracts')
              }
            }}
          >
            <MenuItem data-action="feedback">
              <Icon use="feedback" style={{ marginRight: 8 }} />Report an issue
            </MenuItem>
            <MenuItem data-action="smart-contracts">
              <Icon use="code" style={{ marginRight: 8 }} />Smart Contract
              Addresses
            </MenuItem>
          </SimpleMenu>
        </div>
      </Nav>
    </Navbar>
  )
}
const Nav = styled.nav`
  display: flex;
  flex-flow: row;
  // justify-content: space-between;
  align-items: center;
  height: 64px;
  // margin-bottom: 24px;
  padding: 16px 24px;
  background: #000;
  & *::placeholder {
    color: #fff;
  }
  & > a {
    text-decoration: none;
    font-size: 16px;
    color: #fff;
  }
`

const NavbarLink = styled(NavLink).attrs({
  activeStyle: props => ({
    color: 'var(--primary)',
    backgroundImage:
      'linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0) 0px,var(--primary) 0px,var(--primary) 4px,rgba(0,0,0,0) 4px)',
  }),
})`
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
  margin-left: 24px;
  height: 64px;
  text-decoration: none;
  text-transform: uppercase;
  @media (max-width: 640px) {
    > span {
      display: none;
    }
  }
`

const NavSearchContainer = styled.div`
  width: 320px;
  padding-left: 16px;
  position: relative;
  @media (max-width: 480px) {
    display: none;
  }
`

const NavSearch = ({ onSearch }) => (
  <NavSearchContainer>
    {/*
<Search
color="#fff"
size={24}
style={{ opacity: 0.75, position: 'absolute', top: 4, left: 8 }}
/>
*/}
    <input
      type="search"
      placeholder="Search accounts by ETH address"
      style={{
        width: '100%',
        height: 32,
        margin: 0,
        padding: '0 16px',
        background: 'rgba(255,255,255,.2)',
        color: '#fff',
        outline: 0,
        border: 'none',
        borderRadius: 0,
        WebkitAppearance: 'textfield',
      }}
      onKeyDown={e => {
        const { value } = e.target
        if (e.keyCode !== 13) return
        if (!value.startsWith('0x')) return
        onSearch(value)
        e.target.value = ''
      }}
    />
  </NavSearchContainer>
)

export default compose(
  connectToasts,
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
)(BasicNavbar)
