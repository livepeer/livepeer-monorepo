// @flow
import * as React from 'react'
import { BasicModal, Button } from '../../components'
import { formatBalance } from '../../utils'
import enhance from './enhance'

type WithdrawProps = {
  history: History,
  amount: number,
  withdrawStake: () => void,
}

const Withdraw: React.ComponentType<WithdrawProps> = ({
  history,
  withdrawStake,
  unbondlock,
}) => {
  const closeModal = () => history.goBack()
  const { amount } = unbondlock || {}
  return (
    <React.Fragment>
      <BasicModal title="Withdraw your LPT" onClose={closeModal}>
        <h1 style={{ textAlign: 'center' }}>
          {formatBalance(amount || 0)} LPT
        </h1>
        <Button onClick={closeModal} className="mod-btn">
          Cancel
        </Button>
        <Button onClick={withdrawStake} className="primary">
          Withdraw
        </Button>
      </BasicModal>
    </React.Fragment>
  )
}

export default enhance(Withdraw)
