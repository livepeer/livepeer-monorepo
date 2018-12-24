// @flow
import * as React from 'react'
import { BasicModal, InlineAccount, Button } from '../../components'
import { formatBalance } from '../../utils'
import enhance from './enhance'

type RebondProps = {
  history: History,
  amount: number,
  unbondlock: object,
  bond: () => void,
  transcoders: GraphQLProps<Transcoder>,
  delegator: GraphQLProps<Delegator>,
}

const Rebond: React.ComponentType<RebondProps> = ({
  history,
  unbondlock,
  bond,
  transcoders,
  delegator,
}) => {
  const closeModal = () => history.goBack()

  let { amount = 0 } = unbondlock || {}
  amount = formatBalance(amount)

  let { delegateAddress } = delegator || {}

  if (!delegateAddress && transcoders['data'][0]) {
    delegateAddress = transcoders['data'][0]['id']
  }

  return (
    <React.Fragment>
      <BasicModal title="Rebond" onClose={closeModal}>
        <p
          style={{ textAlign: 'center' }}
        >{`Rebond ${amount} LPT to the most recent transcoder`}</p>
        <InlineAccount address={delegateAddress || ''} truncate={40} />
        <p>
          Note: You can only bond to one transcoder at a time. To bond to a
          different transcoder, bond to this transcoder and then on the
          transcoders page, bond all LPT to a different transcoder
        </p>
        <Button onClick={bond} className="primary">
          Rebond
        </Button>
        <Button onClick={closeModal} className="primary">
          Cancel
        </Button>
      </BasicModal>
    </React.Fragment>
  )
}

export default enhance(Rebond)
