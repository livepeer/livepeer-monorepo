// @flow
import * as React from 'react'
import { BasicModal, RebondForm } from '../../components'
import { formatBalance } from '../../utils'
import enhance from './enhance'

type RebondProps = {
  history: History,
  amount: number,
  unbondlock: GraphQLProps<UnbondLock>,
  bond: () => void,
  transcoders: GraphQLProps<Transcoder>,
  delegator: GraphQLProps<Delegator>,
  accountId: string,
  state: object,
  location: object,
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

  let { delegateAddress } = delegator['data'] || {}

  if (!delegateAddress && transcoders['data'][0]) {
    delegateAddress = transcoders['data'][0]['id']
  }

  return (
    <React.Fragment>
      <BasicModal onClose={closeModal}>
        <RebondForm
          amount={amount}
          delegateAddress={delegateAddress}
          onSubmit={bond}
          onCancel={closeModal}
          loading={delegator.loading}
        />
      </BasicModal>
    </React.Fragment>
  )
}

export default enhance(Rebond)
