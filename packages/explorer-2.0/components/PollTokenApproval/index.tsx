import Button from '../Button'
import { MAXIUMUM_VALUE_UINT256 } from '../../lib/utils'
import { useContext } from 'react'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'

export default () => {
  const client = useApolloClient()
  const { approve }: any = useContext(MutationsContext)

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
            await approve({
              variables: { type: 'createPoll', amount: MAXIUMUM_VALUE_UINT256 },
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
      >
        Unlock LPT for poll creation
      </Button>
    </>
  )
}
