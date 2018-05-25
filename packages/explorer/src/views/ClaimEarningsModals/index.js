// @flow
import * as React from 'react'
import { FORM_ERROR } from 'final-form'
import { BasicModal, ClaimEarningsForm } from '../../components'
import enhance from './enhance'
import { MathBN } from '../../utils'

export type ClaimEarningsModalsViewProps = {
  currentRound: GraphQLProps<Round>,
  history: History,
  me: GraphQLProps<Account>,
  claimEarnings: any => void,
  onClaimMore: any => void,
}

const ClaimEarningsModalsView: React.ComponentType<
  ClaimEarningsModalsViewProps,
> = ({
  claimEarnings,
  currentRound,
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
  const maxClaims = '20' // TODO: get maxClaims from the smart contract
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

export default enhance(ClaimEarningsModalsView)
