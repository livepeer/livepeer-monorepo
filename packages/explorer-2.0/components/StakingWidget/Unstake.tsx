import { useContext } from 'react'
import Utils from 'web3-utils'
import Button from '../Button'
import { useWeb3React } from '@web3-react/core'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'
import { initTransaction } from '../../lib/utils'

export default ({ amount, newPosPrev, newPosNext, delegator, disabled }) => {
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
        onClick={() => {
          initTransaction(client, async () => {
            await unbond({
              variables: {
                amount: Utils.toWei(amount ? amount.toString() : '0'),
                newPosPrev,
                newPosNext,
                delegator: delegator?.id,
                lastClaimRound: delegator?.lastClaimRound
              },
            })
          })
        }}
        sx={{ width: '100%' }}
      >
        Unstake
      </Button>
    </>
  )
}
