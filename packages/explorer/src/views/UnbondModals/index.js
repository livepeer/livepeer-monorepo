// @flow
import * as React from 'react'
import {
  UnbondErrorModal,
  UnbondSuccessModal,
  UnbondTransactionModal,
} from '../../components'
import enhance from './enhance'
import { sleep } from '../../utils'

type UnbondModalsViewProps = {
  unbondStatus: TransactionStatus,
  me: GraphQLProps<Account>,
  onClose: any => void,
  onUnbond: any => void,
}

const UnbondModalsView: React.ComponentType<UnbondModalsViewProps> = ({
  unbondStatus,
  me,
  onClose,
  onUnbond,
}) => (
  <React.Fragment>
    <UnbondErrorModal
      action="unbond"
      error={unbondStatus.error}
      onClose={onClose}
      test={unbondStatus.active && unbondStatus.error}
      title="Unbond Failed"
    />
    <UnbondSuccessModal
      onClose={onClose}
      test={unbondStatus.active && unbondStatus.done && !unbondStatus.error}
      title="Finished Unbonding"
    />
    <UnbondTransactionModal
      bondedAmount={me.data.delegator.bondedAmount}
      delegateAddress={unbondStatus.id}
      loading={unbondStatus.submitted}
      onUnbond={onUnbond}
      onClose={onClose}
      test={unbondStatus.active && !unbondStatus.done}
      tokenBalance={me.data.tokenBalance}
    />
  </React.Fragment>
)

export default enhance(UnbondModalsView)
