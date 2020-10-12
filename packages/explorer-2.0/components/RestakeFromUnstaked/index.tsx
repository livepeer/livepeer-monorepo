import { useContext } from 'react'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'
import { initTransaction } from '../../lib/utils'

export default ({
  unbondingLockId,
  delegate,
  newPosPrev,
  newPosNext,
  delegator,
}) => {
  const context = useWeb3React()
  const client = useApolloClient()

  if (!context.active) {
    return null
  }

  const { rebondFromUnbonded }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        onClick={() => {
          initTransaction(client, async () => {
            await rebondFromUnbonded({
              variables: {
                unbondingLockId,
                delegate,
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
        Rebond
      </Button>
    </>
  )
}
