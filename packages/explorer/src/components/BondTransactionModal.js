// @flow
import * as React from 'react'
import { formatBalance, toBaseUnit } from '../utils'
import { cond } from '../enhancers'
import Avatar from './Avatar'
import BasicModal from './BasicModal'
import BondForm from './BondForm'
import InlineHint from './InlineHint'

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
    <InlineHint flag="bond-modal">
      <h3>Lorem Ipsum</h3>
      <p>
        Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio
        sollicitudin, in neque magna, orci pede, vel eleifend urna.
      </p>
    </InlineHint>
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
