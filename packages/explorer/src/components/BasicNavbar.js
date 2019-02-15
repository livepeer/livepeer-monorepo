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
import { Icon } from 'rmwc/Icon'
import Navbar from './Navbar'
import {
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
  connectToasts,
} from '../enhancers'
import { NetworkStatus } from 'apollo-client'

const BasicNavbar = ({ onSearch, currentRound, toasts, coinbase, history }) => {
  const myAccountAddress = coinbase.data.coinbase
  const { host } = window.livepeer.config.eth.currentProvider
  // Test if web3 is injected
  // For Mist compatability we also check if the web3 object has the `version` property
  // because at the moment the Mist provided web3 object does not have additional properties like `version`
  // As a result, if a web3 object with the `version` property is not available, we fallback
  // to using a default provider which should be the case for Mist
  const networkName = !(window.web3 && window.web3.version)
    ? /infura/.test(host)
      ? host.split('.')[0].replace(/(http|https):\/\//, '')
      : 'Custom RPC'
    : {
        1: 'Mainnet',
        4: 'Rinkeby',
      }[window.web3.version.network] || 'Custom RPC'
  // We don't want to show our "loading" state for periodic polls, so:
  const showLoading = !(
    currentRound.networkStatus === NetworkStatus.ready ||
    currentRound.networkStatus === NetworkStatus.poll
  )
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
        <NetworkBadge
          onClick={() => (window.location.hash = '#/protocol-status')}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              paddingRight: 24,
              padding: 8,
              background: 'none',
              cursor: 'pointer',
              color: showLoading
                ? '#aaa'
                : currentRound.data.initialized
                ? 'var(--primary)'
                : 'orange',
              height: 24,
              marginLeft: 16,
              whiteSpace: 'nowrap',
              fontSize: 10,
              textTransform: 'uppercase',
              boxShadow: `inset 0 0 0 1px ${
                showLoading
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              paddingRight: 24,
              padding: `4px 8px`,
              background: showLoading
                ? '#aaa'
                : currentRound.data.initialized
                ? 'var(--primary)'
                : 'orange',
              cursor: 'pointer',
              color: '#000',
              whiteSpace: 'nowrap',
            }}
          >
            {showLoading ? (
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
        </NetworkBadge>

        {/*onSearch && <NavSearch onSearch={onSearch} />*/}

        <NavbarLinks>
          <Form
            onSubmit={e => {
              e.preventDefault()
              const data = new FormData(e.target)
              history.push(`/accounts/${data.get('address')}`)
            }}
          >
            <SearchBar
              required
              name="address"
              id="address"
              type="search"
              pattern="^0x[a-fA-F0-9]{40}$"
              placeholder="Enter an ETH account address"
              onChange={e => {
                const re = new RegExp(e.target.pattern)
                const sub = document.getElementById('sub')
                const invalidColor = '#868686'
                if (re.test(e.target.value)) {
                  e.target.style.color = '#FFFFFF'
                  sub.style.color = '#00EA86'
                } else {
                  e.target.style.color = invalidColor
                  sub.style.color = invalidColor
                }
              }}
            />
            <div
              style={{
                textAlign: 'center',
                width: '5%',
                display: 'inline-block',
              }}
            >
              <CTAButton id="sub" type="submit">
                <span>&rarr;</span>
              </CTAButton>
            </div>
          </Form>
          <NavbarLink exact to="/about">
            <HomeIcon size={16} />
            <span>&nbsp;About</span>
          </NavbarLink>
          <NavbarLink to="/transcoders">
            <CpuIcon size={16} />
            <span>&nbsp;Transcoders</span>
          </NavbarLink>
          {!window.limitedWeb3Conn && myAccountAddress && (
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
            style={{
              width: 350,
            }}
            handle={
              <Btn
                style={{
                  minWidth: 0,
                  width: 32,
                  height: 32,
                  color: '#fff',
                  marginLeft: 16,
                  background: 'transparent',
                  outline: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Icon use="more_vert" />
              </Btn>
            }
            onSelected={({ detail }) => {
              const { action } = detail.item.dataset
              switch (action) {
                case 'feedback':
                  return window.open(
                    'https://github.com/livepeer/livepeerjs/issues',
                  )
                case 'smart-contracts':
                  return (window.location.hash = '#/smart-contracts')
                case 'search':
                  break
                default:
                  return ''
              }
            }}
          >
            <MenuItem data-action="feedback">
              <Icon use="feedback" style={{ marginRight: 8 }} />
              Report an issue
            </MenuItem>
            <MenuItem data-action="smart-contracts">
              <Icon use="code" style={{ marginRight: 8 }} />
              Smart Contract Addresses
            </MenuItem>
            <MenuItem id="search" data-action="search">
              <form
                style={{
                  width: '95%',
                }}
                onSubmit={e => {
                  e.preventDefault()
                  const data = new FormData(e.target)
                  history.push(`/accounts/${data.get('address')}`)
                }}
              >
                <SearchBar
                  required
                  name="address"
                  id="address2"
                  type="search"
                  pattern="^0x[a-fA-F0-9]{40}$"
                  placeholder="Enter an ETH account address"
                  onChange={e => {
                    const re = new RegExp(e.target.pattern)
                    const sub = document.getElementById('sub2')
                    const invalidColor = '#868686'
                    if (re.test(e.target.value)) {
                      e.target.style.color = '#FFFFFF'
                      sub.style.color = '#00EA86'
                    } else {
                      e.target.style.color = invalidColor
                      sub.style.color = invalidColor
                    }
                  }}
                />
                <div
                  style={{
                    textAlign: 'center',
                    width: '5%',
                    display: 'inline-block',
                  }}
                >
                  <CTAButton id="sub2" type="submit">
                    <span>&rarr;</span>
                  </CTAButton>
                </div>
              </form>
            </MenuItem>
          </SimpleMenu>
        </NavbarLinks>
      </Nav>
    </Navbar>
  )
}

const Nav = styled.nav`
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 90px;
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
  @media (min-width: 1147px) {
    #search {
      display: none;
    }
  }
`

const NavbarLinks = styled.div`
  display: inline-flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  min-width: 180px;
  color: #fff;
  @media (max-width: 480px) {
    > a:first-child {
      display: none;
    }
  }
`

const NavbarLink = styled(NavLink).attrs({
  activeStyle: props => ({
    color: 'var(--primary)',
    backgroundImage:
      'linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0) 0px,var(--primary) 0px,var(--primary) 4px,rgba(0,0,0,0) 4px)',
  }),
})`
  font-family: 'AkkuratMonoPro', 'Helvetica Neue', helvetica, arial, sans-serif;
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: 12px;
  margin-left: 35px;
  height: 90px;
  text-decoration: none;
  text-transform: uppercase;
  > span {
    font-family: 'AkkuratMonoPro', 'Helvetica Neue', helvetica, arial,
      sans-serif;
  }
  @media (max-width: 800px) {
    > span {
      display: none;
    }
  }
  @media (max-width: 520px) {
    margin-left: 10px;
  }
`

const NetworkBadge = styled.span`
  display: inline-flex;
  align-items: center;
  @media (max-width: 520px) {
    > span:nth-child(2) {
      display: none !important;
    }
  }
`

const placeHolderColor = '#868686'

const SearchBar = styled.input`
  width: 90%;
  height: 25px;
  margin: 0 10px;
  padding: 16px;
  background: #242424;
  color: #868686;
  border: none;
  font-size: 16px;
  outline: 0;
  font-family: 'AkkuratMonoPro', 'Helvetica Neue', helvetica, arial, sans-serif;
  -webkit-appearance: textfield;
  ::placeholder {
    color: ${placeHolderColor};
  }
  :-ms-input-placeholder {
    color: ${placeHolderColor};
  }
  ::-ms-input-placeholder {
    color: ${placeHolderColor};
  }
`

const CTAButton = styled.button`
  font-family: 'AkkuratMonoPro', 'Helvetica Neue', helvetica, arial, sans-serif;
  background: none;
  border: none;
  color: #868686;
  cursor: pointer;
  display: inline-block;
  font-size: ${({ big }) => (big ? '26px' : '22px')};
  letter-spacing: 2px;
  outline: 0;
  text-transform: uppercase;
`

const Form = styled.form`
  @media (min-width: 1440px) {
    width: 500px;
  }
  @media (max-width: 1439px) {
    width: 400px;
  }
  @media (max-width: 1146px) {
    display: none;
  }
`

const Btn = styled.button`
  @media (max-width: 520px) {
    margin: 0 10px !important;
  }
`

export default compose(
  connectToasts,
  connectCoinbaseQuery,
  connectCurrentRoundQuery,
)(BasicNavbar)
