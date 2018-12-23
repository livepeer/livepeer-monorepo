import * as React from 'react'
import { withProp } from '../../enhancers'
import { BasicModal } from '../../components'
import type { WithdrawProps } from './props'

const Withdraw: React.StatelessFunctionalComponent<WithdrawProps> = ({
  amount,
}) => {
  // const closeModal = () => history.goBack()

  return (
    <BasicModal title="Update Your Transfer Allowance">
      <h1>Hello World</h1>
    </BasicModal>
  )
}

export default withProp('component', Withdraw)
