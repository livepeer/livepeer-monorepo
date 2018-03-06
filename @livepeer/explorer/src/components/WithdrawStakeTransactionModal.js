// @flow
import * as React from 'react'
// import { formatBalance, toBaseUnit } from '../utils'
import { cond } from '../enhancers'
import BasicModal from './BasicModal'
// import WithdrawStakeForm from './WithdrawStakeForm'

type WithdrawStakeTransactionModalProps = {|
  loading: boolean,
  onWithdrawStake: any => void,
  onClose: any => void,
|}

/**
 * Contains a form for approval and bonding, as well as helpful messaging
 */
const WithdrawStakeTransactionModal: React.ComponentType<
  WithdrawStakeTransactionModalProps,
> = ({ onWithdrawStake, onClose, ...props }) => (
  <BasicModal
    title="Withdraw Stake"
    onClose={!props.loading ? onClose : undefined}
  >
    {/* TODO: withdrawStake form */}
    [ form goes here ]
  </BasicModal>
)

const handleSubmitWithdrawStake = submit => ({ ...values }) => {
  // console.log(values)
  submit({
    ...values,
  })
}

export default cond(WithdrawStakeTransactionModal)
