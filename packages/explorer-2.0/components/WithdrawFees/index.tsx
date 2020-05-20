import { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ delegator, ...props }) => {
  const context = useWeb3React()
  const client = useApolloClient()

  if (!context.active) {
    return null
  }

  const { withdrawFees }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        onClick={async () => {
          try {
            client.writeData({
              data: {
                txSummaryModal: {
                  __typename: 'TxSummaryModal',
                  open: true,
                },
              },
            })
            await withdrawFees()
            client.writeData({
              data: {
                txSummaryModal: {
                  __typename: 'TxSummaryModal',
                  open: false,
                },
              },
            })
          } catch (e) {
            client.writeData({
              data: {
                txSummaryModal: {
                  __typename: 'TxSummaryModal',
                  error: true,
                },
              },
            })
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        {...props}
      >
        Withdraw
      </Button>
    </>
  )
}
