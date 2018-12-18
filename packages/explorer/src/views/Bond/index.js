// @flow
import * as React from 'react'
import { BasicModal, BondForm } from '../../components'
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
  protocol: GraphQLProps<Protocol>,
}

const BondView: React.ComponentType<BondViewProps> = ({
  approve,
  bond,
  goApprove,
  history,
  location,
  match,
  me,
  onClose,
  protocol,
  ...props
}) => {
  const { delegateAddress } = match.params
  const { tokenBalance } = me.data
  const { allowance, bondedAmount } = me.data.delegator
  const closeModal = () => history.push(history.location.pathname)
  const max = fromBaseUnit(MathBN.min(allowance, tokenBalance))
  return (
    <BasicModal title="Bond Your Token" onClose={closeModal}>
      <BondForm
        allowance={allowance}
        bondedAmount={bondedAmount}
        delegateAddress={delegateAddress}
        initialValues={{
          amount: max,
          to: delegateAddress,
        }}
        loading={me.loading}
        max={max}
        maxEarningsClaimsRounds={protocol.data.maxEarningsClaimsRounds}
        onSubmit={bond}
        onCancel={closeModal}
        onUpdateAllowance={goApprove}
        tokenBalance={tokenBalance}
        validateOnBlur
      />
    </BasicModal>
  )
}
export default enhance(BondView)
