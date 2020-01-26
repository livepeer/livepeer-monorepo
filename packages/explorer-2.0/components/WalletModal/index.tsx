import { useState } from 'react'
import { Box } from 'theme-ui'
import CloseIcon from '../../public/img/close.svg'
import MetaMaskIcon from '../../public/img/metamask.svg'
import PortisIcon from '../../public/img/portis.svg'
import { Dialog } from '@reach/dialog'
import { Flex } from 'theme-ui'
import { SUPPORTED_WALLETS } from '../../lib/constants'
import { Injected, Portis } from '../../lib/connectors'
import { isMobile } from 'react-device-detect'
import { useCookies } from 'react-cookie'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import Spinner from '../Spinner'
import Option from './Option'

export default ({ onWalletModalOpen, visibility = 'visible' }) => {
  const { active, account, connector, activate, error } = useWeb3React()
  const [showDialog, setShowDialog] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [initializing, setInitializing] = useState(false)
  const [cookies, setCookie] = useCookies(['connector'])
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  return (
    showDialog && (
      <Dialog onDismiss={close}>
        <Box sx={{ borderRadius: 'inherit' }}>
          <Box sx={{ position: 'relative', p: [2, 2, 2, 3] }}>
            <Box sx={{ fontWeight: 500 }}>
              {initializing ? (
                <Box sx={{ color: 'primary', cursor: 'pointer' }}>Back</Box>
              ) : (
                'Connect To A Wallet'
              )}
            </Box>
            <CloseIcon
              sx={{ position: 'absolute', right: 20, top: 20, color: 'white' }}
            />
          </Box>
          <Box
            sx={{
              borderBottomLeftRadius: 'inherit',
              borderBottomRightRadius: 'inherit',
              bg: 'rgba(255, 255, 255, .04)',
              p: 3,
            }}
          >
            {/* {initializing ? (
              <>
                <Flex
                  sx={{
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'border',
                    borderRadius: 10,

                    p: 2,
                    mb: 2,
                  }}
                >
                  <Spinner sx={{ width: 20, height: 20, mr: 2 }} />
                  Initializing
                </Flex>
                <WalletCard
                  name="MetaMask"
                  sx={{
                    cursor: 'default',
                    ':hover': {
                      borderColor: 'border',
                    },
                  }}
                  icon={<MetaMaskIcon sx={{ height: 24 }} />}
                />
              </>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridGap: 2,
                  gridTemplateColumns: `repeat(auto-fit, minmax(128px, 1fr))`,
                }}
              >
                <WalletCard
                  onClick={async () => {
                    try {
                      setSelectedProvider('Portis')
                      setInitializing(true)
                      await context.setConnector('Portis', {
                        suppressAndThrowErrors: true,
                      })
                      setCookie('connector', 'Portis', { path: '/' })
                      setInitializing(false)
                    } catch (e) {
                      console.warn(e)
                      setInitializing(false)
                    }
                  }}
                  name="Portis"
                  icon={<PortisIcon sx={{ height: 24 }} />}
                />
                <WalletCard
                  onClick={async () => {
                    try {
                      setSelectedProvider('Injected')
                      setInitializing(true)
                      await context.setConnector('Injected', {
                        suppressAndThrowErrors: true,
                      })
                      setCookie('connector', 'Injected', { path: '/' })
                      setInitializing(false)
                    } catch (e) {
                      console.warn(e)
                      setInitializing(false)
                    }
                  }}
                  name="MetaMask"
                  icon={<MetaMaskIcon sx={{ height: 24 }} />}
                />
              </Box>
            )} */}
          </Box>
        </Box>
      </Dialog>
    )
  )
}

function WalletCard({ hover = true, name, icon, onClick = null, ...props }) {
  return (
    <Flex
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 10,
        p: 2,
        ':hover': {
          borderColor: 'primary',
        },
      }}
      {...props}
    >
      {name}
      {icon}
    </Flex>
  )
}

// function getOptions() {
//   const isMetamask = window['ethereum'] && window['ethereum'].isMetaMask
//   return Object.keys(SUPPORTED_WALLETS).map(key => {
//     const option = SUPPORTED_WALLETS[key]
//     // check for mobile options
//     if (isMobile) {
//       //disable portis on mobile for now
//       if (option.connector === Portis) {
//         return null
//       }

//       if (!window['web3'] && !window['ethereum'] && option.mobile) {
//         return (
//           <Option
//             onClick={() => {
//               option.connector !== connector &&
//                 !option.href &&
//                 tryActivation(option.connector)
//             }}
//             key={key}
//             active={option.connector && option.connector === connector}
//             color={option.color}
//             link={option.href}
//             header={option.name}
//             subheader={null}
//             icon={require('../../assets/images/' + option.iconName)}
//           />
//         )
//       }
//       return null
//     }

//     // overwrite injected when needed
//     if (option.connector === Injected) {
//       // don't show injected if there's no injected provider
//       if (!(window['web3'] || window['ethereum'])) {
//         if (option.name === 'MetaMask') {
//           return (
//             <Option
//               key={key}
//               color={'#E8831D'}
//               header={'Install Metamask'}
//               subheader={null}
//               link={'https://metamask.io/'}
//               icon={MetamaskIcon}
//             />
//           )
//         } else {
//           return null //dont want to return install twice
//         }
//       }
//       // don't return metamask if injected provider isn't metamask
//       else if (option.name === 'MetaMask' && !isMetamask) {
//         return null
//       }
//       // likewise for generic
//       else if (option.name === 'Injected' && isMetamask) {
//         return null
//       }
//     }

//     // return rest of options
//     return (
//       !isMobile &&
//       !option.mobileOnly && (
//         <Option
//           onClick={() => {
//             option.connector === connector
//               ? setWalletView(WALLET_VIEWS.ACCOUNT)
//               : !option.href && tryActivation(option.connector)
//           }}
//           key={key}
//           active={option.connector === connector}
//           color={option.color}
//           link={option.href}
//           header={option.name}
//           subheader={null} //use option.descriptio to bring back multi-line
//           icon={require('../../assets/images/' + option.iconName)}
//         />
//       )
//     )
//   })
// }
