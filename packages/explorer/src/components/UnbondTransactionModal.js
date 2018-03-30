// @flow
import * as React from 'react'
// import { formatBalance, toBaseUnit } from '../utils'
import { cond } from '../enhancers'
import BasicModal from './BasicModal'
// import UnbondForm from './UnbondForm'

type UnbondTransactionModalProps = {|
  loading: boolean,
  onUnbond: any => void,
  onClose: any => void,
|}

/**
 * Contains a form for approval and bonding, as well as helpful messaging
 */
const UnbondTransactionModal: React.ComponentType<
  UnbondTransactionModalProps,
> = ({ onUnbond, onClose, ...props }) => (
  <BasicModal
    title="Unbond"
    onClose={!props.loading ? onClose : undefined}
  >
    {/* TODO: unbond form */}
    [ form goes here ]
  </BasicModal>
)

const handleSubmitUnbond = submit => ({ ...values }) => {
  // console.log(values)
  submit({
    ...values,
  })
}

export default cond(UnbondTransactionModal)
