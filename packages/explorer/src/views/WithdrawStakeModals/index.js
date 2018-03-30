// @flow
import * as React from 'react'
import {
  ClaimEarningsErrorModal,
  ClaimEarningsSuccessModal,
  ClaimEarningsTransactionModal,
} from '../../components'
import enhance from './enhance'
import { sleep } from '../../utils'

type ClaimEarningsModalsViewProps = {
  claimEarningsStatus: TransactionStatus,
  me: GraphQLProps<Account>,
  onClose: any => void,
  onClaimEarnings: any => void,
}

const ClaimEarningsModalsView: React.ComponentType<
  ClaimEarningsModalsViewProps,
> = ({ claimEarningsStatus, me, onClose, onClaimEarnings }) => (
  <React.Fragment>
    <ClaimEarningsErrorModal
      action="claim earnings"
      error={claimEarningsStatus.error}
      onClose={onClose}
      test={claimEarningsStatus.active && claimEarningsStatus.error}
      title="Claim Failed"
    />
    <ClaimEarningsSuccessModal
      onClose={onClose}
      test={
        claimEarningsStatus.active &&
        claimEarningsStatus.done &&
        !claimEarningsStatus.error
      }
      title="Finished Claiming Earnings"
    />
    <ClaimEarningsTransactionModal
      bondedAmount={me.data.delegator.bondedAmount}
      delegateAddress={claimEarningsStatus.id}
      loading={claimEarningsStatus.submitted}
      onClaimEarnings={onClaimEarnings}
      onClose={onClose}
      test={claimEarningsStatus.active && !claimEarningsStatus.done}
      tokenBalance={me.data.tokenBalance}
    />
  </React.Fragment>
)

export default enhance(ClaimEarningsModalsView)
