import React, { useState } from 'react'
import styled from 'styled-components'
import {
  GitHub as GitHubIcon,
  MessageCircle as MessageCircleIcon,
  // Search,
  Twitter as TwitterIcon,
} from 'react-feather'
import Navbar from './Navbar'
import { MenuItem, SimpleMenu } from 'rmwc/Menu'
import { Button } from 'rmwc/Button'
import { Icon } from 'rmwc/Icon'

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
          <GitHubIcon color="#fff" size={16} />
          <span>&nbsp;Code</span>
        </NavSocialLink>
        <NavSocialLink href="https://discord.gg/7wRSUGX" target="_blank">
          <MessageCircleIcon color="#fff" size={16} />
          <span>&nbsp;Discord</span>
        </NavSocialLink>
        <NavSocialLink href="https://twitter.com/LivepeerOrg" target="_blank">
          <TwitterIcon color="#fff" size={16} />
          <span>&nbsp;Follow</span>
        </NavSocialLink>
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
              default:
                throw new Error(`unexpected action: ${action}`)
            }
          }}
        >
          <MenuItem data-action="feedback">
            <Icon use="feedback" style={{ marginRight: 8 }} />
            Report an issue
          </MenuItem>
        </SimpleMenu>
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

const NavSearchContainer = styled.form`
  display: block;
  width: 320px;
  padding-left: 16px;
  position: relative;
  @media (max-width: 480px) {
    display: none;
  }
`

const NavSearchInput = styled.input`
  width: 100%;
  height: 32px;
  margin: 0;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  outline: 0;
  border: none;
  border-radius: 1;
`

const NavSearch = ({ onSearch }) => {
  const [search, setSearch] = useState('')
  return (
    <NavSearchContainer
      onSubmit={e => {
        e.preventDefault()
        if (!search) {
          return
        }
        onSearch(search)
        setSearch('')
      }}
    >
      {/*
<Search
color="#fff"
size={24}
style={{ opacity: 0.75, position: 'absolute', top: 4, left: 8 }}
/>
*/}
      <NavSearchInput
        onChange={e => setSearch(e.target.value)}
        value={search}
        type="search"
        placeholder="Enter stream URL"
      />
    </NavSearchContainer>
  )
}

export default BasicNavbar
