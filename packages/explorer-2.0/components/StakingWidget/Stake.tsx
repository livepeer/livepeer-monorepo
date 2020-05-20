import React, { useContext } from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import Utils from 'web3-utils'
import Button from '../Button'
import { useWeb3React } from '@web3-react/core'
import { MutationsContext } from '../../contexts'

export default ({ transcoder, amount, disabled }) => {
  const client = useApolloClient()
  const context = useWeb3React()
  const { bond }: any = useContext(MutationsContext)

  if (!context.active) {
    return null
  }

  return (
    <>
      <Button
        disabled={disabled}
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
            await bond({
              variables: {
                to: transcoder.id,
                amount: Utils.toWei(amount ? amount.toString() : '0'),
              },
            })
            client.writeData({
              data: {
                txSummaryModal: {
                  __typename: 'TxSummaryModal',
                  open: false,
                },
                tourOpen: false,
              },
            })
          } catch (e) {
            client.writeData({
              data: {
                txSummaryModal: {
                  __typename: 'TxSummaryModal',
                  error: true,
                },
                tourOpen: false,
              },
            })
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ width: '100%' }}
      >
        Stake
      </Button>
    </>
  )
}
