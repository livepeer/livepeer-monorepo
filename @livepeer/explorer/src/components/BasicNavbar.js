import React from 'react'
import styled from 'styled-components'
import {
  Github as GithubIcon,
  MessageCircle as MessageCircleIcon,
  // Search,
  Twitter as TwitterIcon,
} from 'react-feather'
import Navbar from './Navbar'

const BasicNavbar = ({ onSearch }) => (
  <Navbar>
    <Nav>
      <a href="/" style={{ lineHeight: 0, padding: '8px 0' }}>
        <img src="/wordmark.svg" height="24" alt="The Livepeer wordmark" />
      </a>
      <NavSearch onSearch={onSearch} />
      <div
        style={{
          display: 'inline-flex',
          flexFlow: 'row wrap',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <NavSocialLink href="https://github.com/livepeer" target="_blank">
          <GithubIcon color="#fff" size={16} />
          <span>&nbsp;Code</span>
        </NavSocialLink>
        <NavSocialLink href="https://gitter.im/livepeer/dev" target="_blank">
          <MessageCircleIcon color="#fff" size={16} />
          <span>&nbsp;Gitter</span>
        </NavSocialLink>
        <NavSocialLink href="https://twitter.com/LivepeerOrg" target="_blank">
          <TwitterIcon color="#fff" size={16} />
          <span>&nbsp;Follow</span>
        </NavSocialLink>
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
  margin-bottom: 24px;
  padding: 16px 24px;
  background: #283845;
  & *::placeholder {
    color: #fff;
  }
  & > a {
    text-decoration: none;
    font-size: 16px;
    color: #fff;
  }
`

const NavSocialLink = styled.a`
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
