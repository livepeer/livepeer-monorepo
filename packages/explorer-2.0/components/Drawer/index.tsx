/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { jsx, Flex, Box } from 'theme-ui'
import Logo from '../../public/img/logo.svg'
import LPT from '../../public/img/lpt.svg'
import New from '../../public/img/new.svg'
import Wallet from '../../public/img/wallet.svg'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useWeb3Context } from 'web3-react'
import StakingGuide from '../StakingGuide'
import Modal from '../Modal'
import { useCookies } from 'react-cookie'
import { removeURLParameter } from '../../lib/utils'
import NetworkWidget from '../NetworkWidget'

export default ({ items = [] }) => {
  const router = useRouter()
  const { query, pathname, asPath } = router
  const context = useWeb3Context()
  const [open, setOpen] = useState(query && query.openExchange ? true : false)
  const [cookies, setCookie, removeCookie] = useCookies(['connector'])

  useEffect(() => {
    if (cookies.connector) {
      context.setConnector(cookies.connector)
    }
  }, [cookies])

  useEffect(() => {
    if (query && query.openExchange) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [query.openExchange])

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
          pl: 2,
        }}
      >
        <Flex
          sx={{
            alignSelf: 'flex-start',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            pr: 4,
          }}
        >
          <Logo sx={{ mb: 3 }} />
          <Box sx={{ marginBottom: 'auto' }}>
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                as={item.as ? item.as : item.href}
                passHref
              >
                <a
                  className={item.className ? item.className : ''}
                  sx={{
                    color:
                      asPath === (item.as ? item.as : item.href) ||
                      (item.name == 'My Account' &&
                        asPath.includes(context.account))
                        ? 'primary'
                        : 'muted',
                    lineHeight: 'initial',
                    display: 'flex',
                    fontSize: 3,
                    fontWeight: 600,
                    cursor: 'pointer',
                    alignItems: 'center',
                    py: 2,
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    transition: 'color .3s',
                    '&:hover': {
                      color: 'primary',
                      transition: 'color .3s',
                    },
                  }}
                >
                  <item.icon sx={{ width: 20, height: 20, mr: 2 }} />
                  {item.name}
                </a>
              </Link>
            ))}
            <StakingGuide>Staking Guide</StakingGuide>
          </Box>
          <div sx={{ mb: 4 }}>
            <div
              sx={{
                mb: 3,
                pb: 3,
                borderBottom: '1px solid',
                borderColor: 'border',
              }}
            >
              <div sx={{ mb: 2 }}>
                <Link href="/whats-new" as="/whats-new" passHref>
                  <a
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 1,
                      color: 'muted',
                      transition: 'color .3s',
                      '&:hover': {
                        color: 'primary',
                        transition: 'color .3s',
                      },
                    }}
                  >
                    <New
                      sx={{ color: 'inherit', width: 20, height: 20, mr: 1 }}
                    />
                    What's New
                  </a>
                </Link>
              </div>
              <div sx={{ mb: context.active ? 2 : 0 }} className="tour-step-3">
                <Link
                  href={`${pathname}?openExchange=true`}
                  as={`${asPath +
                    (/[?&]q=/.test(asPath)
                      ? '&openExchange=true'
                      : '?openExchange=true')}`}
                  passHref
                >
                  <a
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 1,
                      color: 'muted',
                      transition: 'color .3s',
                      '&:hover': {
                        color: 'primary',
                        transition: 'color .3s',
                      },
                    }}
                  >
                    <LPT
                      sx={{ color: 'inherit', width: 20, height: 20, mr: 1 }}
                    />{' '}
                    Get LPT
                    <Modal
                      className="tour-step-4"
                      isOpen={open}
                      sx={{ maxWidth: 600 }}
                      onDismiss={() => {
                        Router.push(
                          removeURLParameter(pathname, 'openExchange'),
                          removeURLParameter(asPath, 'openExchange'),
                        )
                      }}
                    >
                      <iframe
                        sx={{
                          bg: '#323639',
                          width: '100%',
                          height: '100%',
                          border: '0',
                        }}
                        src={`https://uniswap.exchange/swap/0x58b6a8a3302369daec383334672404ee733ab239?connector=${
                          context.connectorName
                            ? context.connectorName
                            : 'Injected'
                        }`}
                      />
                    </Modal>
                  </a>
                </Link>
              </div>
              {context.active && (
                <div
                  onClick={() => {
                    removeCookie('connector', { path: '/' })
                    context.unsetConnector()
                  }}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 1,
                    color: 'muted',
                    transition: 'color .3s',
                    '&:hover': {
                      color: 'primary',
                      transition: 'color .3s',
                    },
                  }}
                >
                  <Wallet
                    sx={{ color: 'inherit', width: 18, height: 18, mr: 1 }}
                  />
                  Disconnect
                </div>
              )}
            </div>
            <NetworkWidget />
          </div>
        </Flex>
      </Flex>
    </Flex>
  )
}
