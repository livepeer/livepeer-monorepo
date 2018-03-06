// @flow
import * as React from 'react'
// import { formatBalance, toBaseUnit } from '../utils'
import { cond } from '../enhancers'
import BasicModal from './BasicModal'
// import ClaimEarningsForm from './ClaimEarningsForm'

type ClaimEarningsTransactionModalProps = {|
  loading: boolean,
  onClaimEarnings: any => void,
  onClose: any => void,
|}

/**
 * Contains a form for approval and bonding, as well as helpful messaging
 */
const ClaimEarningsTransactionModal: React.ComponentType<
  ClaimEarningsTransactionModalProps,
> = ({ onClaimEarnings, onClose, ...props }) => (
  <BasicModal
    title="Claim Earnings"
    onClose={!props.loading ? onClose : undefined}
  >
    {/* TODO: claimEarnings form */}
    [ form goes here ]
  </BasicModal>
)

const handleSubmitClaimEarnings = submit => ({ ...values }) => {
  // console.log(values)
  submit({
    ...values,
  })
}

export default cond(ClaimEarningsTransactionModal)
