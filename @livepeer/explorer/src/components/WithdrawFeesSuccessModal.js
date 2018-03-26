// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import BasicModal from './BasicModal'
import Button from './Button'
import { cond } from '../enhancers'

type WithdrawFeesSuccessModalProps = {|
  title: string,
  onClose: any => void,
|}

/**
 * Shown when a bond transaction is successfully completed
 */
const WithdrawFeesSuccessModal: React.ComponentType<
  WithdrawFeesSuccessModalProps,
> = ({ title, onClose }) => (
  <BasicModal title={title} onClose={onClose}>
    <p>Congratulations! You've withdrawn your fees.</p>
    <div style={{ textAlign: 'right', paddingTop: 24 }}>
      <Button onClick={onClose}>OK</Button>
    </div>
  </BasicModal>
)

export default cond(WithdrawFeesSuccessModal)
