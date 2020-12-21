import { Flex, Box } from 'theme-ui'
import Hamburger from '../Hamburger'
import React from 'react'
import AccountMenu from '../AccountMenu'

interface Props {
  onDrawerOpen: Function
  title?: JSX.Element | string
}

const Index = ({ onDrawerOpen, title }: Props) => {
  return (
    <Flex
      sx={{
        bg: 'background',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        display: ['flex', 'flex', 'flex', 'none'],
        justifyContent: 'space-between',
        py: [2, 2, 3],
        px: 20,
      }}
    >
      <Flex sx={{ alignItems: 'center' }}>
        <Hamburger onClick={onDrawerOpen} sx={{ mr: 2 }} />
        <Box sx={{ fontWeight: 600 }}>{title}</Box>
      </Flex>
      <AccountMenu isInHeader={true} />
    </Flex>
  )
}

export default Index
