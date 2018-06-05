// @flow
import * as React from 'react'
import { BasicModal, ApproveForm } from '../../components'
import enhance from './enhance'
import { MathBN, fromBaseUnit } from '../../utils'

type ApproveViewProps = {
  approve: any => void,
  goBond: any => void,
  history: History,
  location: Location,
  match: Match,
  me: GraphQLProps<Account>,
  onClose: any => void,
}

const ApproveView: React.ComponentType<ApproveViewProps> = ({
  approve,
  goBond,
  history,
  location,
  match,
  me,
  onClose,
  ...props
}) => {
  const { delegateAddress } = match.params
  const { tokenBalance } = me.data
  const { allowance, bondedAmount } = me.data.delegator
  const closeModal = () => history.goBack()
  const max = fromBaseUnit(MathBN.min(allowance, tokenBalance))
  console.log(max, tokenBalance, me)
  return (
    <BasicModal title="Update Your Transfer Allowance" onClose={closeModal}>
      <ApproveForm
        allowance={allowance}
        bondedAmount={bondedAmount}
        delegateAddress={delegateAddress}
        initialValues={{ amount: '' }}
        loading={me.loading}
        max={max}
        onSubmit={approve}
        onCancel={closeModal}
        onUpdateAllowance={goBond}
        tokenBalance={tokenBalance}
        validateOnBlur
      />
    </BasicModal>
  )
}
export default enhance(ApproveView)
