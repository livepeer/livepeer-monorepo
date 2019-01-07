// @flow
import * as React from 'react'
import { BasicModal, UnbondForm } from '../../components'
import enhance from './enhance'
import { MathBN, fromBaseUnit } from '../../utils'

type BondViewProps = {
  bond: any => void,
  bondStatus: TransactionStatus,
  goApprove: any => void,
  history: History,
  location: Location,
  match: Match,
  me: GraphQLProps<Account>,
  onClose: any => void,
}

const UnbondView: React.ComponentType<BondViewProps> = ({
  approve,
  unbond,
  goApprove,
  history,
  location,
  match,
  me,
  onClose,
  ...props
}) => {
  const { delegateAddress } = match.params
  const { tokenBalance, id } = me.data
  const { allowance, bondedAmount } = me.data.delegator
  const closeModal = () => history.push(history.location.pathname)
  const view = () => history.push(`accounts/${id}/delegating`)
  const max = fromBaseUnit(MathBN.min(allowance, tokenBalance))
  return (
    <BasicModal title="Unbond Your Token" onClose={closeModal}>
      <UnbondForm
        allowance={allowance}
        bondedAmount={bondedAmount}
        delegateAddress={delegateAddress}
        initialValues={{
          amount: max,
          to: delegateAddress,
        }}
        loading={me.loading}
        max={max}
        history={history}
        onSubmit={unbond}
        view={view}
        onCancel={closeModal}
        onUpdateAllowance={goApprove}
        tokenBalance={tokenBalance}
        validateOnBlur
      />
    </BasicModal>
  )
}
export default enhance(UnbondView)
