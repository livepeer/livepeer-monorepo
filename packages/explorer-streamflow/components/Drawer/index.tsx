/** @jsx jsx */
import React, { useState } from 'react'
import { Styled, jsx, Flex, Box } from 'theme-ui'
import Orchestrators from '../../static/img/orchestrators.svg'
import Logo from '../../static/img/logo.svg'
import Network from '../../static/img/network.svg'
import Account from '../../static/img/account.svg'
import Wallet from '../../static/img/wallet.svg'
import Search from '../../static/img/search.svg'
import Link from 'next/link'
<<<<<<< HEAD
import { useRouter } from 'next/router'

const DEFAULT_ITEMS = [
  { name: 'Orchestrators', link: '/', icon: Orchestrators },
  { name: 'Network', link: '/network', icon: Network },
  { name: 'Search', link: '/search', icon: Search },
  // { name: 'Account', link: '/account', icon: Account },
  { name: 'Connect Wallet', link: '/connect-wallet', icon: Wallet },
]
=======
import Router, { useRouter } from 'next/router'
import Logo from '../Logo'
import { useWeb3Context } from 'web3-react'
>>>>>>> Abstract next-apollo integration; add styleguide;

export default ({ items = DEFAULT_ITEMS }) => {
  const router = useRouter()
  const { pathname } = router
  const context = useWeb3Context()

  let items = [
    { name: 'Orchestrators', link: '/', icon: Orchestrators },
    { name: 'Network', link: '/network', icon: Network },
    { name: 'Search', link: '/search', icon: Search },
    {
      name: !context.connector ? 'Connect Wallet' : 'My Account',
      link: !context.connector ? '/connect-wallet' : 'me',
      icon: Wallet
    }
  ]

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
<<<<<<< HEAD
          paddingTop: 5,
        }}
      >
        <Box>
          <Logo sx={{ pl: 3, width: 160, mb: 4 }} />
=======
          paddingTop: 5
        }}>
        <Box sx={{ width: 256 }}>
          <Logo sx={{ pl: 3, width: 180, mb: 4 }} />
>>>>>>> Abstract next-apollo integration; add styleguide;
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
<<<<<<< HEAD
                      transition: 'color .3s',
                    },
                  }}
                  as="a"
                  key={i}
                  i={i}
                >
=======
                      transition: 'color .3s'
                    }
                  }}>
>>>>>>> Abstract next-apollo integration; add styleguide;
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
console.log('hi')
