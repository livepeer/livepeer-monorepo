import React from 'react'
import { compose } from 'recompose'
import { EMPTY_ADDRESS } from '@livepeer/sdk'
import styled from 'styled-components'
import { NavLink, Link } from 'react-router-dom'
import {
  MoreHorizontal as MoreHorizontalIcon,
  MoreVertical as MoreVerticalIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Cpu as CpuIcon,
  User as UserIcon,
} from 'react-feather'
import Navbar from './Navbar'
import { connectCurrentRoundQuery, connectToasts } from '../enhancers'

const BasicNavbar = ({ onSearch, currentRound, toasts }) => {
  const notAuthenticated =
    window.livepeer.config.defaultTx.from ===
    '0x0000000000000000000000000000000000000000'
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
        {onSearch && <NavSearch onSearch={onSearch} />}
        {
          <span
            onClick={async () => {
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
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              paddingRight: 24,
              padding: 8,
              background: currentRound.loading
                ? '#aaa'
                : currentRound.data.initialized ? 'var(--primary)' : 'orange',
              cursor:
                currentRound.loading || currentRound.data.initialized
                  ? 'default'
                  : 'pointer',
              color: '#000',
              width: 116,
              marginLeft: 16,
              whiteSpace: 'nowrap',
              borderRadius: 4,
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
              &nbsp;Round Status
            </span>
          </span>
        }
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
          <NavbarLink to="/transcoders">
            <CpuIcon size={16} />
            <span>&nbsp;Transcoders</span>
          </NavbarLink>
          {window.livepeer.config.defaultTx.from !== EMPTY_ADDRESS && (
            <NavbarLink to="/me">
              <UserIcon size={16} />
              <span>&nbsp;My Account</span>
            </NavbarLink>
          )}
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
  activeStyle: props => ({ color: 'var(--primary)' }),
})`
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: 11px;
  margin-left: 24px;
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
      placeholder="Enter an ETH account address"
      style={{
        width: '100%',
        height: 32,
        margin: 0,
        padding: '0 16px',
        background: 'rgba(255,255,255,.2)',
        color: '#fff',
        outline: 0,
        border: 'none',
        borderRadius: 4,
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

export default compose(connectToasts, connectCurrentRoundQuery)(BasicNavbar)
