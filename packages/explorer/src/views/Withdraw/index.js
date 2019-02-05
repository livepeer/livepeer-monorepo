// @flow
import * as React from 'react'
import { BasicModal, WithdrawForm } from '../../components'
import enhance from './enhance'

type WithdrawProps = {
  history: History,
  location: object,
  withdrawStake: () => void,
  unbondlock: GraphQLProps<UnbondLock>,
  delegator: GraphQLProps<Delegator>,
}

const Withdraw: React.ComponentType<WithdrawProps> = ({
  history,
  withdrawStake,
  unbondlock,
  location,
  delegator,
}) => {
  const closeModal = () => history.goBack()
  const { amount } = unbondlock || {}
  const {
    state: { accountId },
  } = location || {}
  return (
    <React.Fragment>
      <BasicModal onClose={closeModal}>
        <WithdrawForm
          onSubmit={withdrawStake}
          history={history}
          loading={delegator.loading}
          onCancel={closeModal}
          amount={amount}
          accountId={accountId}
        />
      </BasicModal>
    </React.Fragment>
  )
}

export default enhance(Withdraw)
