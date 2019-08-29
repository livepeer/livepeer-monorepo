/** @jsx jsx */
import React, { useState } from 'react'
import { Styled, jsx, Flex, Box } from 'theme-ui'
import Orchestrators from '../../static/img/orchestrators.svg'
import Network from '../../static/img/network.svg'
import Account from '../../static/img/account.svg'
import Wallet from '../../static/img/wallet.svg'
import Search from '../../static/img/search.svg'
import Link from 'next/link'
import { useRouter } from 'next/router'

const items = [
  { name: 'Orchestrators', link: '/', icon: Orchestrators },
  { name: 'Network', link: '/network', icon: Network },
  { name: 'Search', link: '/search', icon: Search },
  // { name: 'Account', link: '/account', icon: Account },
  { name: 'Connect Wallet', link: '/connect-wallet', icon: Wallet }
]

export default () => {
  const router = useRouter()
  const { pathname } = router

  return (
    <Flex
      sx={{
        width: 256,
        flexDirection: 'column',
        height: '100vh'
      }}>
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
          paddingTop: 5
        }}>
        <Box>
          <Styled.img
            sx={{ pl: 3, width: 160, mb: 4 }}
            src="/static/img/logo.svg"
          />
          <Box>
            {items.map((item, i) => (
              <Link key={i} href={item.link} passHref>
                <Styled.div
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
                      transition: 'color .3s'
                    }
                  }}
                  as="a"
                  key={i}
                  i={i}>
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
