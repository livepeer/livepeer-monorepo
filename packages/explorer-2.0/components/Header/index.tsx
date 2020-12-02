import { Flex, Box } from 'theme-ui'
import Hamburger from '../Hamburger'
import Button from '../Button'
import { gql, useApolloClient } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'
import WalletIcon from '../../public/img/wallet.svg'

interface Props {
  onDrawerOpen: Function
  title?: JSX.Element | string
}

const Index = ({ onDrawerOpen, title }: Props) => {
  const client = useApolloClient()
  const { active, account } = useWeb3React()

  return (
    <Flex
      sx={{
        bg: 'background',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        display: ['flex', 'flex', 'flex', 'none'],
        justifyContent: 'space-between',
        py: [2, 2, 3],
        px: 2,
      }}
    >
      <Flex sx={{ alignItems: 'center' }}>
        <Hamburger onClick={onDrawerOpen} sx={{ mr: 2 }} />
        <Box sx={{ fontWeight: 600 }}>{title}</Box>
      </Flex>
      {active && (
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
            cursor: 'pointer',
            alignItems: 'center',
            fontSize: 1,
            borderRadius: 6,
            bg: 'surface',
            py: '6px',
            px: '10px',
          }}
        >
          <WalletIcon sx={{ color: 'text', width: 16, height: 16, mr: 1 }} />
          {account.replace(account.slice(5, 39), '…')}
        </Flex>
      )}
      {!active && (
        <Button
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
            mt: '3px',
            fontSize: 14,
            textTransform: 'initial',
            borderRadius: 4,
            ml: 2,
            fontWeight: 600,
          }}
          variant="primaryOutlineSmall"
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  )
}

export default Index
