/** @jsx jsx */
import React from 'react'
import { Styled, jsx, Flex, Box } from 'theme-ui'
import Orchestrators from '../../static/img/orchestrators.svg'
import Network from '../../static/img/network.svg'
import Account from '../../static/img/account.svg'
import Search from '../../static/img/search.svg'
import Link from 'next/link'

const items = [
  { name: 'Orchestrators', link: '/', icon: Orchestrators },
  { name: 'Network', link: '/network', icon: Network },
  { name: 'Search', link: '/search', icon: Search },
  { name: 'Account', link: '/account', icon: Account },
  { name: 'Connect Wallet', link: '/wallet', icon: Search }
]
export default () => {
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
                    color: !i ? 'primary' : 'muted',
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
                  <item.icon sx={{ width: 16, mr: 3 }} />
                  {item.name}
                </Styled.div>
              </Link>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            width: '100%'
          }}>
          {/* <Box
            sx={{
              py: 4,
              borderTop: '1px solid',
              borderColor: 'border',
              mx: 3
            }}>
            <Web3Consumer>
              {context => {
                const { active, connectorName, account, networkId } = context
                return (
                  active && (
                    <>
                      <p>Active Connector: {connectorName}</p>
                      <p>Account: {account || 'None'}</p>
                      <p>Network ID: {networkId}</p>
                    </>
                  )
                )
              }}
            </Web3Consumer>
            Connect Wallet
          </Box> */}
        </Box>
      </Flex>
    </Flex>
  )
}
