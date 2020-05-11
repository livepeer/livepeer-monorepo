import { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { MutationsContext } from '../../contexts'

export default ({ lock }) => {
  const context = useWeb3React()

  if (!context.active) {
    return null
  }

  const { withdrawStake }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        onClick={async () => {
          try {
            await withdrawStake({
              variables: {
                unbondingLockId: lock.unbondingLockId,
              },
            })
          } catch (e) {
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
