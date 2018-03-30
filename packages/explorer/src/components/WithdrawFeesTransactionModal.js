// @flow
import * as React from 'react'
// import { formatBalance, toBaseUnit } from '../utils'
import { cond } from '../enhancers'
import BasicModal from './BasicModal'
// import WithdrawFeesForm from './WithdrawFeesForm'

type WithdrawFeesTransactionModalProps = {|
  loading: boolean,
  onWithdrawFees: any => void,
  onClose: any => void,
|}

/**
 * Contains a form for approval and bonding, as well as helpful messaging
 */
const WithdrawFeesTransactionModal: React.ComponentType<
  WithdrawFeesTransactionModalProps,
> = ({ onWithdrawFees, onClose, ...props }) => (
  <BasicModal
    title="Withdraw Fees"
    onClose={!props.loading ? onClose : undefined}
  >
    {/* TODO: withdrawFees form */}
    [ form goes here ]
  </BasicModal>
)

const handleSubmitWithdrawFees = submit => ({ ...values }) => {
  // console.log(values)
  submit({
    ...values,
  })
}

export default cond(WithdrawFeesTransactionModal)
