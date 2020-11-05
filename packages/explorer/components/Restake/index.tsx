import { useContext } from 'react'
import Button from '../Button'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'
import { initTransaction } from '../../lib/utils'

export default ({ unbondingLockId, newPosPrev, newPosNext, delegator }) => {
  const client = useApolloClient()
  const { rebond }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        onClick={() => {
          initTransaction(client, async () => {
            await rebond({
              variables: {
                unbondingLockId,
                newPosPrev,
                newPosNext,
                delegator: delegator?.id,
                lastClaimRound: parseInt(delegator?.lastClaimRound.id, 10),
              },
            })
          })
        }}
        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
      >
        Restake
      </Button>
    </>
  )
}
