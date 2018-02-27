// @flow
import * as React from 'react'
import { formatBalance, toBaseUnit } from '../utils'
import { cond } from '../enhancers'
import Avatar from './Avatar'
import BasicModal from './BasicModal'
import Button from './Button'

type BondTransactionModalProps = {|
  bondedAmount: string,
  delegateAddress: string,
  loading: boolean,
  onBond: any => void,
  onClose: any => void,
  tokenBalance: string,
|}

/** Contains a form for approval and bonding, as well as helpful messaging */
const BondTransactionModal: React.ComponentType<BondTransactionModalProps> = ({
  onBond,
  bondedAmount,
  delegateAddress,
  loading,
  onClose,
  tokenBalance,
}) => (
  <BasicModal
    title="Bond to Transcoder"
    onClose={!loading ? onClose : undefined}
  >
    <p>Transcoder Address</p>
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
    <p>Amount to Bond</p>
    {bondedAmount !== '0' && (
      <p style={{ fontSize: 12 }}>
        You already have a bonded amount of {formatBalance(bondedAmount, 18)}{' '}
        LPT. Any additional bond will be added to this amount. By entering 0,
        you will transfer your bonded amount to the selected transcoder.
      </p>
    )}
    <p style={{ fontSize: 12 }}>
      The maximum amount you may bond is&nbsp;
      <span style={{ fontWeight: 400 }}>
        {formatBalance(tokenBalance, 18)} LPT.
      </span>
    </p>
    <input
      id="bondApproveAmount"
      disabled={loading}
      type="text"
      style={{
        width: '90%',
        height: 48,
        padding: 8,
        fontSize: 16,
      }}
    />{' '}
    LPT
    <p style={{ fontSize: 14, lineHeight: 1.5 }}>
      <strong style={{ fontWeight: 'normal' }}>Note</strong>: By clicking
      "Submit", MetaMask will prompt you twice — first for an approval
      transaction, and then for a bonding transaction. You must submit both in
      order to complete the bonding process.
    </p>
    <div style={{ textAlign: 'right', paddingTop: 24 }}>
      <Button disabled={loading} onClick={onClose}>
        Cancel
      </Button>
      <Button
        disabled={loading}
        onClick={async e => {
          const input = document.getElementById('bondApproveAmount')
          if (!(input instanceof HTMLInputElement))
            throw TypeError(
              `#bondApproveAmount element is not HTMLInputElement`,
            )
          const { value } = input
          onBond({
            to: delegateAddress,
            amount: toBaseUnit(value),
          })
        }}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  </BasicModal>
)

export default cond(BondTransactionModal)
