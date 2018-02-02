import React from 'react'
import { EMPTY_ADDRESS } from '@livepeer/sdk'
import styled from 'styled-components'
import { NavLink, Link } from 'react-router-dom'
import { Cpu as CpuIcon, User as UserIcon } from 'react-feather'
import Navbar from './Navbar'

const BasicNavbar = ({ onSearch }) => (
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
      <div
        style={{
          display: 'inline-flex',
          flexFlow: 'row wrap',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
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
  activeStyle: props => ({ color: '#00eb88' }),
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

export default BasicNavbar
