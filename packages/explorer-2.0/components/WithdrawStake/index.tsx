import { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ lock }) => {
  const context = useWeb3React()
  const client = useApolloClient()

  if (!context.active) {
    return null
  }

  const { withdrawStake }: any = useContext(MutationsContext)

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
            await withdrawStake({
              variables: {
                unbondingLockId: lock.unbondingLockId,
              },
            })
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
        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
      >
        Withdraw
      </Button>
    </>
  )
}
