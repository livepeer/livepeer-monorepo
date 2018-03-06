// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import BasicModal from './BasicModal'
import Button from './Button'
import { cond } from '../enhancers'

type WithdrawStakeSuccessModalProps = {|
  title: string,
  onClose: any => void,
|}

/**
 * Shown when a bond transaction is successfully completed
 */
const WithdrawStakeSuccessModal: React.ComponentType<
  WithdrawStakeSuccessModalProps,
> = ({ title, onClose }) => (
  <BasicModal title={title} onClose={onClose}>
    <p>Congratulations! You've claimed all available earnings.</p>
    <div style={{ textAlign: 'right', paddingTop: 24 }}>
      <Button onClick={onClose}>OK</Button>
    </div>
  </BasicModal>
)

export default cond(WithdrawStakeSuccessModal)
