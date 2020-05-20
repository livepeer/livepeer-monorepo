import { useContext } from 'react'
import Button from '../Button'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ lock }) => {
  const client = useApolloClient()
  const { rebond }: any = useContext(MutationsContext)

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
            await rebond({
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
        Restake
      </Button>
    </>
  )
}
