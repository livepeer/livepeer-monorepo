// @flow
import * as React from 'react'
import { cond } from '../enhancers'
import { MathBN } from '../utils'
import BasicModal from './BasicModal'
import ClaimEarningsForm from './ClaimEarningsForm'
import type { ClaimEarningsFormProps } from './ClaimEarningsForm'

export type ClaimEarningsTransactionModalProps = {
  loading: boolean,
  onClose: any => void,
  refresh: any => void,
  title: string,
  ...ClaimEarningsFormProps,
  onClaimEarnings: any => void,
}

/**
 * Contains a form for claiming earnings
 */
const ClaimEarningsTransactionModal: React.ComponentType<
  ClaimEarningsTransactionModalProps,
> = ({ onClaimEarnings, onClose, refresh, title, ...props }) => (
  <BasicModal title={title} onClose={!props.loading ? onClose : undefined}>
    <ClaimEarningsForm
      {...props}
      initialValues={{ numRounds: '1' }}
      onCancel={onClose}
      onSubmit={handleSubmitClaimEarnings({
        lastRound: props.from,
        submit: onClaimEarnings,
        refresh,
      })}
    />
  </BasicModal>
)

const handleSubmitClaimEarnings = ({ lastRound, refresh, submit }) => async ({
  numRounds,
}) => {
  const endRound = MathBN.sub(MathBN.add(lastRound, numRounds), '1')
  return submit({
    endRound,
  })
}

export default cond(ClaimEarningsTransactionModal)
