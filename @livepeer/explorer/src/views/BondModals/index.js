// @flow
import * as React from 'react'
import {
  BondErrorModal,
  BondSuccessModal,
  BondTransactionModal,
} from '../../components'
import enhance from './enhance'
import { sleep } from '../../utils'

type BondModalsViewProps = {
  bondStatus: TransactionStatus,
  me: GraphQLProps<Account>,
  onClose: any => void,
  onBond: any => void,
}

const BondModalsView: React.ComponentType<BondModalsViewProps> = ({
  bondStatus,
  me,
  onClose,
  onBond,
}) => (
  <React.Fragment>
    <BondErrorModal
      action="bond"
      error={bondStatus.error}
      onClose={onClose}
      test={bondStatus.active && bondStatus.error}
      title="Bond Failed"
    />
    <BondSuccessModal
      delegateAddress={bondStatus.id}
      onClose={onClose}
      test={bondStatus.active && bondStatus.done && !bondStatus.error}
      title="Bonding Complete"
    />
    <BondTransactionModal
      bondedAmount={me.data.delegator.bondedAmount}
      delegateAddress={bondStatus.id}
      loading={bondStatus.submitted}
      onBond={onBond}
      onClose={onClose}
      test={bondStatus.active && !bondStatus.done}
      tokenBalance={me.data.tokenBalance}
    />
  </React.Fragment>
)

export default enhance(BondModalsView)
