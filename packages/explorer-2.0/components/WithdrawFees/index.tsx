import { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { MutationsContext } from '../../contexts'

export default ({ delegator, ...props }) => {
  const context = useWeb3React()

  if (!context.active) {
    return null
  }

  const { withdrawFees }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        onClick={async () => {
          try {
            await withdrawFees()
          } catch (e) {
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
