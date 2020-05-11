import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { useContext } from 'react'
import { MutationsContext } from '../../contexts'

export default ({ pollAddress, choiceId, children, ...props }) => {
  const context = useWeb3React()

  if (!context.active) {
    return null
  }

  const { vote }: any = useContext(MutationsContext)

  return (
    <Button
      onClick={async () => {
        try {
          await vote({ variables: { pollAddress, choiceId } })
        } catch (e) {
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
