import { Flex, Box } from 'theme-ui'
import Logo from '../Logo'
import LPT from '../../public/img/lpt.svg'
import WalletIcon from '../../public/img/wallet.svg'
import NewIcon from '../../public/img/new.svg'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import StakingGuide from '../StakingGuide'
import RoundStatus from '../RoundStatus'
import { gql, useApolloClient } from '@apollo/client'
import UniswapModal from '../UniswapModal'

const Index = ({
  items = [],
  open,
  onDrawerOpen,
  onDrawerClose,
  bannerDismissed = false,
}) => {
  const router = useRouter()
  const client = useApolloClient()
  const { asPath } = router
  const context = useWeb3React()
  const visibility = open ? 'visible' : 'hidden'

  Router.events.on('routeChangeStart', () => {
    onDrawerClose()
  })

  return (
    <>
      <Box
        onClick={onDrawerOpen}
        sx={{
          left: 0,
          top: 0,
          position: 'fixed',
          width: '100vw',
          height: 'calc(100vh - 41px)',
          bg: 'rgba(0,0,0,.5)',
          visibility: [visibility, visibility, visibility, 'hidden'],
          zIndex: 100,
        }}
      />
      <Flex
        onClick={onDrawerOpen}
        sx={{
          left: 0,
          top: 0,
          bg: 'black',
          visibility: [visibility, visibility, visibility, 'visible'],
          zIndex: 100,
          width: 240,
          transition: 'transform .3s',
          transform: [
            `translateX(${open ? 0 : '-100%'})`,
            `translateX(${open ? 0 : '-100%'})`,
            `translateX(${open ? 0 : '-100%'})`,
            'none',
          ],
          position: ['fixed', 'fixed', 'fixed', 'sticky'],
          flexDirection: 'column',
          height: bannerDismissed ? '100vh' : 'calc(100vh - 41px)',
          pt: [3, 3, 5],
          px: 3,
          boxShadow: [
            '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
            '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
            '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
            'none',
          ],
          alignItems: 'center',
          justifyContent: 'space-between',
          ':after': {
            pointerEvents: 'none',
            content: '""',
            position: 'absolute',
            height: 550,
            top: 0,
            left: 0,
            width: '100%',
            background:
              'linear-gradient(127.48deg,rgba(38,233,138,0.18) -29.81%,rgba(196,196,196,0) 58.42%)',
          },
        }}
      >
        <Flex
          sx={{
            alignSelf: 'flex-start',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        >
          <Logo isDark pushSx={{ width: 110, mb: 3 }} />
          <Box sx={{ marginBottom: 'auto' }}>
            {items.map((item, i) => (
              <Link key={i} href={item.href} as={item.as} passHref>
                <a
                  sx={{
                    color: asPath.split('?')[0] === item.as ? 'white' : 'muted',
                    lineHeight: 'initial',
                    display: 'flex',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    alignItems: 'center',
                    py: '10px',
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    transition: 'color .3s',
                    '&:hover': {
                      color: 'white',
                      transition: 'color .3s',
                    },
                  }}
                >
                  <item.icon sx={{ width: 20, height: 20, mr: 1 }} />
                  {item.name}
                </a>
              </Link>
            ))}
            {!context.active && (
              <Box
                onClick={() => {
                  client.writeQuery({
                    query: gql`
                      query {
                        walletModalOpen
                      }
                    `,
                    data: {
                      walletModalOpen: true,
                    },
                  })
                }}
                sx={{
                  color: 'muted',
                  lineHeight: 'initial',
                  display: 'flex',
                  fontSize: 14,
                  fontWeight: 500,
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
                className="tour-step-1"
              >
                <WalletIcon sx={{ width: 20, height: 20, mr: 1 }} />
                Connect Wallet
              </Box>
            )}
            <StakingGuide sx={{ display: ['none', 'none', 'none', 'block'] }}>
              Staking Guide
            </StakingGuide>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                mb: 3,
                pb: 3,
                borderBottom: '1px solid',
                borderColor: 'border',
              }}
            >
              <Box sx={{ mb: 2 }}>
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
                    <NewIcon
                      sx={{ color: 'inherit', width: 20, height: 20, mr: 1 }}
                    />
                    What's New
                  </a>
                </Link>
              </Box>
              <Flex
                onClick={() =>
                  client.writeQuery({
                    query: gql`
                      query {
                        uniswapModalOpen
                      }
                    `,
                    data: {
                      uniswapModalOpen: true,
                    },
                  })
                }
                sx={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'color .3s',
                  fontSize: 1,
                  color: 'muted',
                  '&:hover': {
                    color: 'primary',
                    transition: 'color .3s',
                  },
                }}
                className="tour-step-3"
              >
                <LPT sx={{ color: 'inherit', width: 20, height: 20, mr: 1 }} />{' '}
                Get LPT
                <UniswapModal>
                  <Box
                    as="iframe"
                    className="tour-step-4"
                    sx={{
                      bg: '#323639',
                      width: '100%',
                      height: '100%',
                      border: '0',
                    }}
                    src={`https://uniswap.exchange/swap/0x58b6a8a3302369daec383334672404ee733ab239`}
                  />
                </UniswapModal>
              </Flex>
              {context.active && (
                <Flex
                  onClick={() => {
                    client.writeQuery({
                      query: gql`
                        query {
                          walletModalOpen
                        }
                      `,
                      data: {
                        walletModalOpen: true,
                      },
                    })
                  }}
                  sx={{
                    mt: 2,
                    cursor: 'pointer',
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
                  <WalletIcon
                    sx={{ color: 'inherit', width: 18, height: 18, mr: 1 }}
                  />
                  {context.account.replace(context.account.slice(5, 39), '…')}
                </Flex>
              )}
            </Box>
            <RoundStatus />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default Index
