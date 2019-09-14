/** @jsx jsx */
import React from 'react'
import { jsx, Flex, Box } from 'theme-ui'
import Logo from '../../static/img/logo.svg'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default ({ items = [] }) => {
  const router = useRouter()
  const { asPath } = router

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
              <Link
                key={i}
                href={item.href}
                as={item.as ? item.as : item.href}
                passHref
              >
                <a
                  sx={{
                    color:
                      asPath === (item.as ? item.as : item.href)
                        ? 'primary'
                        : 'muted',
                    lineHeight: 'initial',
                    display: 'flex',
                    fontSize: 3,
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
                </a>
              </Link>
            ))}
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}
