// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import BasicModal from './BasicModal'
import Button from './Button'
import { cond } from '../enhancers'

type BondSuccessModalProps = {|
  title: string,
  onClose: any => void,
  delegateAddress: string,
|}

/**
 * Shown when a bond transaction is successfully completed
 */
const BondSuccessModal: React.ComponentType<BondSuccessModalProps> = ({
  title,
  onClose,
  delegateAddress,
}) => (
  <BasicModal title={title} onClose={onClose}>
    <p>Congratulations! You successfully bonded to the following delegate:</p>
    <div
      style={{
        fontSize: 14,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <Avatar id={delegateAddress} size={32} />
      <span style={{ marginLeft: 8 }}>{delegateAddress}</span>
    </div>
    <p>
      Please view the{' '}
      <Link onClick={onClose} to="/me/delegating">
        "delegating" section of your account
      </Link>{' '}
      to see your bonded amount.
    </p>
    <div style={{ textAlign: 'right', paddingTop: 24 }}>
      <Button onClick={onClose}>OK</Button>
    </div>
  </BasicModal>
)

export default cond(BondSuccessModal)
