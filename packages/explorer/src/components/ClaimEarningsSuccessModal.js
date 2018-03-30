// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import BasicModal from './BasicModal'
import Button from './Button'
import { cond } from '../enhancers'

export type ClaimEarningsSuccessModalProps = {
  roundsLeft: string,
  title: string,
  onClaimMore: any => void,
  onClose: any => void,
}

/**
 * Shown when a bond transaction is successfully completed
 */
const ClaimEarningsSuccessModal: React.ComponentType<
  ClaimEarningsSuccessModalProps,
> = ({ roundsLeft, onClaimMore, onClose, title }) => (
  <BasicModal title={title} onClose={onClose}>
    {roundsLeft === '0' ? (
      <React.Fragment>
        <p>Congratulations! You've claimed all available earnings.</p>
        <div style={{ textAlign: 'right', paddingTop: 24 }}>
          <Button onClick={onClose}>OK</Button>
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <p>
          Congratulations! You've claimed some of your earnings. You still have{' '}
          {roundsLeft} round(s) left to claim.
        </p>
        <div style={{ textAlign: 'right', paddingTop: 24 }}>
          <Button onClick={onClose}>cancel</Button>
          <Button onClick={onClaimMore}>claim more</Button>
        </div>
      </React.Fragment>
    )}
  </BasicModal>
)

export default cond(ClaimEarningsSuccessModal)
