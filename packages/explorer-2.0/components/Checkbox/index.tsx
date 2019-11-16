/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import Check from '../../public/img/check.svg'

export default ({ isActive = false, ...props }) => (
  <div
    {...props}
    sx={{
      border: '2px solid',
      borderRadius: 1000,
      color: 'background',
      borderColor: isActive ? 'primary' : 'muted',
      backgroundColor: isActive ? 'primary' : 'transparent',
      width: 24,
      height: 24,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {isActive && <Check sx={{ width: 16, height: 16 }} />}
  </div>
)
