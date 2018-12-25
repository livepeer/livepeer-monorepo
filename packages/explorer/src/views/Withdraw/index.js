// @flow
import * as React from 'react'
import { BasicModal, WithdrawForm } from '../../components'
import enhance from './enhance'

type WithdrawProps = {
  history: History,
  amount: number,
  location: object,
  withdrawStake: () => void,
}

const Withdraw: React.ComponentType<WithdrawProps> = ({
  history,
  withdrawStake,
  unbondlock,
  location,
}) => {
  const closeModal = () => history.goBack()
  const { amount } = unbondlock || {}
  const {
    state: { accountId },
  } = location || {}
  return (
    <React.Fragment>
      <BasicModal title="Withdraw your LPT" onClose={closeModal}>
        <WithdrawForm
          onSubmit={withdrawStake}
          history={history}
          onCancel={closeModal}
          amount={amount}
          accountId={accountId}
        />
      </BasicModal>
    </React.Fragment>
  )
}

export default enhance(Withdraw)
