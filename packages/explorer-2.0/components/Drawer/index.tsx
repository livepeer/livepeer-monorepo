import { useState, useEffect } from 'react'
import { Flex, Box } from 'theme-ui'
import Logo from '../../public/img/logo.svg'
import LPT from '../../public/img/lpt.svg'
import Wallet from '../../public/img/wallet.svg'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useWeb3Context } from 'web3-react'
import StakingGuide from '../StakingGuide'
import Modal from '../Modal'
import { useCookies } from 'react-cookie'
import { removeURLParameter } from '../../lib/utils'
import NetworkWidget from '../NetworkWidget'

export default ({ items = [], open, onDrawerOpen }) => {
  const router = useRouter()
  const { query, pathname, asPath } = router
  const context = useWeb3Context()
  const [exchangeOpen, setOpen] = useState(
    query && query.openExchange ? true : false,
  )
  const [cookies, setCookie, removeCookie] = useCookies(['connector'])

  useEffect(() => {
    if (cookies.connector) {
      context.setConnector(cookies.connector)
    } else {
      if (window['web3']) {
        context.setConnector('Injected')
      }
    }
  }, [cookies])

  useEffect(() => {
    if (query && query.openExchange) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [query.openExchange])

  const visibility = open ? 'visible' : 'hidden'

  return (
    <>
      <Box
        onClick={onDrawerOpen}
        sx={{
          left: 0,
          top: 0,
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,.5)',
          visibility: [visibility, visibility, visibility, 'hidden'],
          zIndex: 100,
        }}
      />
      <Flex
        sx={{
          width: 275,
          top: 0,
          transition: 'transform .3s',
          transform: [
            `translateX(${open ? 0 : '-100%'})`,
            `translateX(${open ? 0 : '-100%'})`,
            `translateX(${open ? 0 : '-100%'})`,
            'none',
          ],
          position: ['fixed', 'fixed', 'fixed', 'sticky'],
          flexDirection: 'column',
          bg: 'background',
          zIndex: 100,
          height: '100vh',

          pt: 5,
          pl: 3,
          borderRight: [0, 0, 0, '1px solid'],
          borderColor: ['border', 'border', 'border', 'border'],
          boxShadow: [
            '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
            '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
            '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
            'none',
          ],
          alignItems: 'center',
          justifyContent: 'space-between',
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
            <StakingGuide sx={{ display: ['none', 'none', 'none', 'block'] }}>
              Staking Guide
            </StakingGuide>
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
              {/* <div sx={{ mb: 2 }}>
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
              </div> */}
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
                      isOpen={exchangeOpen}
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
    </>
  )
}
