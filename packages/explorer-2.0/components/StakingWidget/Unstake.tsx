import { useContext } from 'react'
import Utils from 'web3-utils'
import Button from '../Button'
import { useWeb3React } from '@web3-react/core'
import { MutationsContext } from '../../contexts'

export default ({ amount, disabled }) => {
  const context = useWeb3React()

  if (!context.active) {
    return null
  }

  const { unbond }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        disabled={disabled}
        variant="red"
        onClick={async () => {
          try {
            await unbond({
              variables: {
                amount: Utils.toWei(amount ? amount.toString() : '0'),
              },
            })
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ width: '100%' }}
      >
        Unstake
      </Button>
    </>
  )
}
