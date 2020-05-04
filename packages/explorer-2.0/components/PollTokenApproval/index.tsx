import Button from '../Button'
import { MAXIUMUM_VALUE_UINT256 } from '../../lib/utils'
import { useContext } from 'react'
import { MutationsContext } from '../../contexts'

export default () => {
  const { approve }: any = useContext(MutationsContext)

  return (
    <>
      <Button
        onClick={async () => {
          try {
            await approve({
              variables: { type: 'createPoll', amount: MAXIUMUM_VALUE_UINT256 },
            })
          } catch (e) {
            console.log(e)
          }
        }}
      >
        Unlock LPT for poll creation
      </Button>
    </>
  )
}
