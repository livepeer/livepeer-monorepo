import { DialogContent, DialogOverlay } from '@reach/dialog'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import CloseIcon from '../../public/img/close.svg'

const Index = ({ children }) => {
  const client = useApolloClient()
  const GET_UNISWAP_MODAL_STATUS = gql`
    {
      uniswapModalOpen @client
    }
  `

  const { data } = useQuery(GET_UNISWAP_MODAL_STATUS)
  const close = () => {
    client.writeData({
      data: {
        uniswapModalOpen: false,
      },
    })
  }

  return (
    <DialogOverlay
      onDismiss={close}
      isOpen={data?.uniswapModalOpen}
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
    >
      <DialogContent
        style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: 600,
          justifyContent: 'center',
          height: '80vh',
        }}
      >
        <CloseIcon
          onClick={close}
          sx={{
            cursor: 'pointer',
            position: 'fixed',
            right: 20,
            top: 20,
            zIndex: 1000,
            color: 'white',
          }}
        />
        {children}
      </DialogContent>
    </DialogOverlay>
  )
}

export default Index
