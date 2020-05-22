import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { useContext } from 'react'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'
import { initTransaction } from '../../lib/utils'

export default ({ pollAddress, choiceId, children, ...props }) => {
  const context = useWeb3React()
  const client = useApolloClient()

  if (!context.active) {
    return null
  }

  const { vote }: any = useContext(MutationsContext)

  return (
    <Button
      onClick={() => {
        initTransaction(client, async () => {
          await vote({ variables: { pollAddress, choiceId } })
        })
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
