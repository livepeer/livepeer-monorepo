// @flow
import * as React from 'react'
import {
  BasicModal,
  BondForm,
  // BondErrorModal,
  // BondSuccessModal,
  // BondTransactionModal,
} from '../../components'
import enhance from './enhance'
import { sleep } from '../../utils'

type BondModalsViewProps = {
  bondStatus: TransactionStatus,
  history: History,
  location: Location,
  match: Match,
  me: GraphQLProps<Account>,
  onClose: any => void,
  approveAndBond: any => void,
}

const BondModalsView: React.ComponentType<BondModalsViewProps> = ({
  // bondStatus,
  // className,
  history,
  location,
  match,
  me,
  onClose,
  approveAndBond,
  ...props
}) => {
  const { delegateAddress } = match.params
  const { bondedAmount } = me.data.delegator
  const closeModal = () => history.push(history.location.pathname)
  return (
    <BasicModal title="Bond Your Token" onClose={closeModal}>
      <BondForm
        bondedAmount={bondedAmount}
        delegateAddress={delegateAddress}
        initialValues={{
          amount: '',
          to: delegateAddress,
        }}
        loading={me.loading}
        onSubmit={approveAndBond}
        onCancel={closeModal}
        tokenBalance={me.data.tokenBalance}
        validateOnBlur
      />
    </BasicModal>
  )
}
export default enhance(BondModalsView)
