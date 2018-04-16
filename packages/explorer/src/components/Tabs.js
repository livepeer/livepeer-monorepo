import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const Tabs = styled.div`
  padding: 0;
  overflow: auto;
  white-space: nowrap;
`

const TabLink = ({ children, to }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        marginRight: 64,
      }}
    >
      <NavLink
        to={to}
        style={{
          display: 'inline-block',
          textDecoration: 'none',
          textTransform: 'uppercase',
          color: 'var(--bg-light)',
          opacity: 0.7,
          paddingBottom: 20,
          paddingTop: 12,
          fontSize: 14,
          letterSpacing: '1px',
        }}
        activeStyle={{
          color: 'var(--primary)',
          opacity: 1,
          backgroundImage:
            'linear-gradient(to top,rgba(0,0,0,0),rgba(0,0,0,0) 0px,var(--primary) 0px,var(--primary) 2px,rgba(0,0,0,0) 2px)',
        }}
      >
        {children}
      </NavLink>
    </div>
  )
}

export { Tabs as default, TabLink }
