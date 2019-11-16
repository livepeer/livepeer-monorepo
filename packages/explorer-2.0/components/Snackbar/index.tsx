/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import Close from '../../static/img/close.svg'

export default ({ children, onClose }) => (
  <div
    sx={{
      borderRadius: '3px',
      backgroundColor: 'muted',
      position: 'fixed',
      transform: 'translateX(-50%)',
      left: '50%',
      fontSize: '14px',
      padding: '16px 24px',
      boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#282828',
      bottom: '24px',
      zIndex: '100',
    }}
  >
    <Flex sx={{ alignItems: 'center' }}>
      <div>{children}</div>
      <Close onClick={onClose} sx={{ cursor: 'pointer', ml: 3 }} />
    </Flex>
  </div>
)
