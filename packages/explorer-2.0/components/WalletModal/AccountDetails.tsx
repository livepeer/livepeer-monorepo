import { Box } from 'theme-ui'
import { useWeb3React } from '@web3-react/core'
import { isMobile } from 'react-device-detect'
import { Injected } from '../../lib/connectors'
import CloseIcon from '../../public/img/close.svg'
import { Flex } from 'theme-ui'
import Button from '../Button'
import { SUPPORTED_WALLETS } from '../../lib/constants'

export default ({ onClose, openOptions }) => {
  const { account, connector } = useWeb3React()

  function formatConnectorName() {
    const isMetaMask =
      window['ethereum'] && window['ethereum'].isMetaMask ? true : false
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        k =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== Injected || isMetaMask === (k === 'METAMASK')),
      )
      .map(k => SUPPORTED_WALLETS[k].name)[0]
    return <Box>{name}</Box>
  }

  return (
    <Box sx={{ borderRadius: 'inherit' }}>
      <Box
        sx={{ position: 'relative', pt: [2, 2, 2, 3], px: [2, 2, 2, 3], pb: 0 }}
      >
        <Box sx={{ fontWeight: 500 }}>Account</Box>
        <CloseIcon
          onClick={onClose}
          sx={{
            cursor: 'pointer',
            position: 'absolute',
            right: 20,
            top: 20,
            color: 'white',
          }}
        />
      </Box>
      <Box
        sx={{
          borderBottomLeftRadius: 'inherit',
          borderBottomRightRadius: 'inherit',
          p: 3,
        }}
      >
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 10,
            p: 2,
          }}
        >
          <Flex sx={{ mb: 2, justifyContent: 'space-between' }}>
            {formatConnectorName()}
          </Flex>

          <a
            sx={{
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'primary',
            }}
            href={`https://etherscan.io/address/${account}`}
            target="__blank"
          >
            {account} ↗
          </a>
        </Box>
        {!(isMobile && (window['web3'] || window['ethereum'])) && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="primaryOutline"
              onClick={() => {
                openOptions()
              }}
            >
              Connect to a different wallet
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
