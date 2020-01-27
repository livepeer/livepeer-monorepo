import { Flex, Box } from 'theme-ui'
import Hamburger from '../Hamburger'
import Button from '../Button'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ onDrawerOpen }) => {
  const client = useApolloClient()

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
        <Box sx={{ fontWeight: 600 }}>Orchestrators</Box>
      </Flex>
      <Button
        onClick={() => {
          client.writeData({
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
    </Flex>
  )
}
