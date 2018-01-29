import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const Tabs = styled.div`
  padding: 8px 8px 0 8px;
  border-bottom: 1px solid #ddd;
`

const TabLink = ({ children, to }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        margin: '0 8px',
      }}
    >
      <NavLink
        to={to}
        style={{
          display: 'inline-block',
          textDecoration: 'none',
          textTransform: 'capitalize',
          color: '#888',
          paddingBottom: 20,
          paddingTop: 12,
        }}
        activeStyle={{
          color: '#177E89',
          backgroundImage:
            'linear-gradient(to top,rgba(0,0,0,0),rgba(0,0,0,0) 0px,#00eb88 0px,#00eb88 2px,rgba(0,0,0,0) 2px)',
        }}
      >
        {children}
      </NavLink>
    </div>
  )
}

export { Tabs as default, TabLink }
