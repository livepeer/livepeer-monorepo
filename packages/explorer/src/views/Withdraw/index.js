// @flow
import * as React from 'react'
import { BasicModal, Button } from '../../components'

type WithdrawProps = {
  history: History,
  withdrawStake: () => void,
}

const Withdraw: React.ComponentType<WithdrawProps> = ({
  history,
  withdrawStake,
}) => {
  const closeModal = () => history.goBack()

  return (
    <React.Fragment>
      <BasicModal title="Update Your Transfer Allowance" onClose={closeModal}>
        <h1>Hello World</h1>
        <Button className="mod-btn">Cancel</Button>
      </BasicModal>
    </React.Fragment>
  )
}

export default Withdraw
