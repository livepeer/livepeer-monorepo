import { Box, Flex } from 'theme-ui'
import React from 'react'

interface Props {
  open?: boolean
  label: React.ReactNode
  button?: React.ReactNode
  sx?: object
}

const Index = ({ open = true, label, button, ...props }: Props) =>
  !open ? null : (
    <Box
      sx={{
        borderRadius: 10,
        border: '1px solid',
        borderColor: 'border',
        width: '100%',
        p: 2,
        fontSize: 0,
        ...props.sx,
      }}
    >
      <Box>
        {label}
        {button && button}
      </Box>
    </Box>
  )

export default Index
