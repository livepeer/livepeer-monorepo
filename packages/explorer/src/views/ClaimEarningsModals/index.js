// @flow
import * as React from 'react'
import {
  ClaimEarningsErrorModal,
  ClaimEarningsSuccessModal,
  ClaimEarningsTransactionModal,
} from '../../components'
import enhance from './enhance'
import { sleep, MathBN } from '../../utils'

export type ClaimEarningsModalsViewProps = {
  claimEarningsStatus: TransactionStatus,
  currentRound: GraphQLProps<Round>,
  me: GraphQLProps<Account>,
  onClose: any => void,
  onClaimEarnings: any => void,
  onClaimMore: any => void,
}

const ClaimEarningsModalsView: React.ComponentType<
  ClaimEarningsModalsViewProps,
> = ({
  claimEarningsStatus,
  currentRound,
  me,
  onClose,
  onClaimEarnings,
  onClaimMore,
}) => {
  const { lastInitializedRound: to } = currentRound.data
  const { lastClaimRound } = me.data.delegator
  const from = MathBN.add(lastClaimRound, '1')
  const diff = MathBN.sub(to, lastClaimRound)
  const maxClaims = '20'
  // console.log(maxClaims, diff, MathBN.min(diff, maxClaims))
  return (
    <React.Fragment>
      <ClaimEarningsErrorModal
        action="claim earnings"
        error={claimEarningsStatus.error}
        onClose={onClose}
        test={claimEarningsStatus.active && claimEarningsStatus.error}
        title="Claim Failed"
      />
      <ClaimEarningsSuccessModal
        onClaimMore={onClaimMore}
        onClose={onClose}
        roundsLeft={diff}
        test={
          claimEarningsStatus.active &&
          claimEarningsStatus.done &&
          !claimEarningsStatus.error
        }
        title="Finished Claiming Earnings"
      />
      <ClaimEarningsTransactionModal
        from={from}
        diff={diff}
        min="1"
        max={MathBN.min(diff, maxClaims)}
        loading={claimEarningsStatus.submitted}
        onClaimEarnings={onClaimEarnings}
        onClose={onClose}
        refresh={me.refetch}
        test={claimEarningsStatus.active && !claimEarningsStatus.done}
        title="Claim Your Earnings"
        to={to}
      />
    </React.Fragment>
  )
}

export default enhance(ClaimEarningsModalsView)
