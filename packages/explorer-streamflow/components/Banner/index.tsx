/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React from 'react'

interface Props {
  open: boolean
  label: React.ReactNode
  button?: React.ReactNode
  sx?: object
}

export default ({ open = true, label, button, ...props }: Props) =>
  !open ? null : (
    <div
      sx={{
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'border',
        width: '100%',
        mb: 2,
        p: 2,
        fontSize: 0,
        ...props.sx,
      }}
    >
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        {label}
        {button && button}
      </Flex>
    </div>
  )
