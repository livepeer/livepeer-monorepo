import { useContext } from 'react'
import Utils from 'web3-utils'
import Button from '../Button'
import { useWeb3React } from '@web3-react/core'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ amount, disabled }) => {
  const context = useWeb3React()
  const client = useApolloClient()

  if (!context.active) {
    return null
  }

  const { unbond }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        disabled={disabled}
        variant="red"
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
            await unbond({
              variables: {
                amount: Utils.toWei(amount ? amount.toString() : '0'),
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
        sx={{ width: '100%' }}
      >
        Unstake
      </Button>
    </>
  )
}
