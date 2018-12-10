// @flow
import * as React from 'react'
import { BasicModal, ClaimEarningsForm } from '../../components'
import enhance from './enhance'
import { MathBN } from '../../utils'

export type ClaimEarningsViewProps = {
  currentRound: GraphQLProps<Round>,
  protocol: GraphQLProps<Protocol>,
  history: History,
  me: GraphQLProps<Account>,
  claimEarnings: any => void,
  onClaimMore: any => void,
}

const ClaimEarningsView: React.ComponentType<ClaimEarningsViewProps> = ({
  claimEarnings,
  currentRound,
  protocol,
  history,
  me,
  onClose,
  onClaimMore,
  ...props
}) => {
  const { lastInitializedRound: to } = currentRound.data
  const { lastClaimRound } = me.data.delegator
  const loading = currentRound.loading || me.loading
  const from = MathBN.add(lastClaimRound, '1')
  const diff = MathBN.sub(to, lastClaimRound)
  const maxClaims = protocol.data.maxEarningsClaimsRounds
  const closeModal = () => history.push(history.location.pathname)
  return (
    <BasicModal title="Claim Your Earnings" onClose={closeModal}>
      <ClaimEarningsForm
        diff={diff}
        from={from}
        initialValues={{ numRounds: '1' }}
        loading={loading}
        max={MathBN.min(diff, maxClaims)}
        min="1"
        onCancel={closeModal}
        onSubmit={claimEarnings}
        to={to}
      />
    </BasicModal>
  )
}

export default enhance(ClaimEarningsView)
