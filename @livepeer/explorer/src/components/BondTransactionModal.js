// @flow
import * as React from 'react'
import { formatBalance, toBaseUnit } from '../utils'
import { cond } from '../enhancers'
import Avatar from './Avatar'
import BasicModal from './BasicModal'
import BondForm from './BondForm'

type BondTransactionModalProps = {|
  bondedAmount: string,
  delegateAddress: string,
  loading: boolean,
  onBond: any => void,
  onClose: any => void,
  tokenBalance: string,
|}

/**
 * Contains a form for approval and bonding, as well as helpful messaging
 */
const BondTransactionModal: React.ComponentType<BondTransactionModalProps> = ({
  onBond,
  onClose,
  ...props
}) => (
  <BasicModal
    title="Bond to Transcoder"
    onClose={!props.loading ? onClose : undefined}
  >
    <BondForm
      {...props}
      initialValues={{
        amount: '',
        to: props.delegateAddress,
      }}
      onSubmit={handleSubmitBond(onBond)}
      onCancel={onClose}
    />
  </BasicModal>
)

const handleSubmitBond = submit => ({ to, amount }) => {
  // console.log(to, amount)
  submit({
    to,
    amount: toBaseUnit(amount),
  })
}

export default cond(BondTransactionModal)
