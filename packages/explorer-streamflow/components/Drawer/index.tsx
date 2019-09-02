/** @jsx jsx */
import React, { useState } from 'react'
import { Styled, jsx, Flex, Box } from 'theme-ui'
import Logo from '../../static/img/logo.svg'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default ({ items = [] }) => {
  const router = useRouter()
  const { pathname } = router

  return (
    <Flex
      sx={{
        width: 256,
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Flex
        sx={{
          position: 'fixed',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          width: 256,
          borderRight: '1px solid',
          borderColor: 'border',
          paddingTop: 5,
        }}
      >
        <Box sx={{ width: 256 }}>
          <Logo sx={{ pl: 3, width: 180, mb: 4 }} />
          <Box>
            {items.map((item, i) => (
              <Link key={i} href={item.link} passHref>
                <Styled.div
                  as="a"
                  sx={{
                    color: pathname === item.link ? 'primary' : 'muted',
                    lineHeight: 'initial',
                    display: 'flex',
                    fontSize: 20,
                    fontWeight: 600,
                    cursor: 'pointer',
                    alignItems: 'center',
                    p: 2,
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    transition: 'color .3s',
                    '&:hover': {
                      color: 'primary',
                      transition: 'color .3s',
                    },
                  }}
                >
                  <item.icon sx={{ width: 20, mr: 2 }} />
                  {item.name}
                </Styled.div>
              </Link>
            ))}
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}
