import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { useContext } from 'react'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ pollAddress, choiceId, children, ...props }) => {
  const context = useWeb3React()
  const client = useApolloClient()

  if (!context.active) {
    return null
  }

  const { vote }: any = useContext(MutationsContext)

  return (
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
          await vote({ variables: { pollAddress, choiceId } })
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
      {children}
    </Button>
  )
}
